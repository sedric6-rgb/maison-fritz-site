import { db } from "@/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

export type LeadType = "contact" | "property_inquiry" | "job_application" | "sell_with_us";

export type ContactLead = {
  id: number;
  lead_type: LeadType;
  name: string;
  phone: string | null;
  email: string | null;
  message: string | null;
  property_id: number | null;
  job_listing_id: number | null;
  is_treated: boolean;
  created_at: string;
};

export type CreateLeadInput = {
  lead_type: LeadType;
  name: string;
  phone?: string;
  email?: string;
  message?: string;
  property_id?: number | null;
  job_listing_id?: number | null;
};

export async function createLead(input: CreateLeadInput): Promise<number> {
  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO contact_leads (lead_type, name, phone, email, message, property_id, job_listing_id)
     VALUES (?,?,?,?,?,?,?)`,
    [
      input.lead_type,
      input.name,
      input.phone || null,
      input.email || null,
      input.message || null,
      input.property_id ?? null,
      input.job_listing_id ?? null,
    ]
  );
  return result.insertId;
}

export async function listLeads(): Promise<ContactLead[]> {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT * FROM contact_leads ORDER BY created_at DESC`
  );
  return rows as ContactLead[];
}

export async function markLeadTreated(id: number, treated: boolean): Promise<void> {
  await db.query(`UPDATE contact_leads SET is_treated = ? WHERE id = ?`, [treated, id]);
}

export async function deleteLead(id: number): Promise<void> {
  await db.query(`DELETE FROM contact_leads WHERE id = ?`, [id]);
}
