import { db } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

const blockedClients = new Set<number>();

export async function isClientBlocked(clientId: number): Promise<boolean> {
  try {
    if (!db) throw new Error("no db");
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT status FROM bank_clients WHERE id = ?",
      [clientId]
    );
    if (rows.length > 0) {
      return rows[0].status === "bloqué";
    }
  } catch {
    // No database — use in-memory fallback
  }
  return blockedClients.has(clientId);
}

export async function setClientBlocked(clientId: number, blocked: boolean): Promise<void> {
  if (blocked) {
    blockedClients.add(clientId);
  } else {
    blockedClients.delete(clientId);
  }

  try {
    if (!db) return;
    await db.query(
      "UPDATE bank_clients SET status = ? WHERE id = ?",
      [blocked ? "bloqué" : "actif", clientId]
    );
  } catch {
    // No database — in-memory only
  }
}
