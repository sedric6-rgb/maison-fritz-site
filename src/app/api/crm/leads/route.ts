import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api-guard";
import { db } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT * FROM contact_leads ORDER BY created_at DESC LIMIT 100`
  );
  return NextResponse.json(rows);
}
