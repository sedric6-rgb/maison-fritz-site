import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api-guard";
import { db } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT f.*, c.full_name AS client_full_name
     FROM client_followups f
     JOIN clients c ON c.id = f.client_id
     ORDER BY f.is_done ASC, f.due_date ASC
     LIMIT 100`
  );
  return NextResponse.json(rows);
}
