"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "./admin-guard";

export async function updateClientProfile(
  clientId: number,
  data: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postal_code: string;
  }
): Promise<{ success: boolean }> {
  await requireAdmin();
  try {
    if (!db) throw new Error("no db");
    await db.query(
      `UPDATE bank_clients SET first_name=?, last_name=?, email=?, phone=?, address=?, city=?, postal_code=? WHERE id=?`,
      [data.first_name, data.last_name, data.email, data.phone, data.address, data.city, data.postal_code, clientId]
    );
  } catch {
    return { success: false };
  }
  revalidatePath("/admin/clients", "layout");
  revalidatePath("/espace-client", "layout");
  return { success: true };
}

export async function sendClientMessage(
  clientId: number,
  subject: string,
  body: string
): Promise<{ success: boolean }> {
  await requireAdmin();
  try {
    if (!db) throw new Error("no db");
    await db.query(
      `INSERT INTO bank_messages (client_id, subject, body, sender, is_read, created_at) VALUES (?, ?, ?, 'banque', 0, CURDATE())`,
      [clientId, subject, body]
    );
  } catch {
    return { success: false };
  }
  revalidatePath("/admin/clients", "layout");
  revalidatePath("/espace-client", "layout");
  return { success: true };
}

export async function addClientTransaction(
  clientId: number,
  data: {
    type: string;
    amount: number;
    account_id: number;
    description: string;
  }
): Promise<{ success: boolean }> {
  await requireAdmin();
  try {
    if (!db) throw new Error("no db");

    const isCredit = data.type === "credit" || data.type === "virement_entrant";
    const category = data.type === "credit" ? "virement_entrant" : data.type === "virement" ? "virement_sortant" : data.type === "prelevement" ? "prelevement" : "carte";
    const dbType = isCredit ? "credit" : "debit";
    const signedAmount = data.amount;

    const [accountRows] = await db.query<import("mysql2").RowDataPacket[]>(
      "SELECT balance FROM bank_accounts WHERE id = ? AND client_id = ?",
      [data.account_id, clientId]
    );
    if (!Array.isArray(accountRows) || accountRows.length === 0) {
      return { success: false };
    }
    const currentBalance = Number(accountRows[0].balance);
    const newBalance = isCredit ? currentBalance + signedAmount : currentBalance - signedAmount;

    const ref = `TXN-${Date.now()}`;
    await db.query(
      `INSERT INTO bank_transactions (account_id, type, category, amount, balance_after, description, counterparty, reference, executed_at)
       VALUES (?, ?, ?, ?, ?, ?, 'Admin', ?, NOW())`,
      [data.account_id, dbType, category, signedAmount, newBalance, data.description, ref]
    );

    await db.query(
      "UPDATE bank_accounts SET balance = ? WHERE id = ?",
      [newBalance, data.account_id]
    );
  } catch {
    return { success: false };
  }
  revalidatePath("/admin/clients", "layout");
  revalidatePath("/espace-client", "layout");
  return { success: true };
}
