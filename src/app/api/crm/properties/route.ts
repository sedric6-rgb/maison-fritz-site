import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api-guard";
import { db } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT id, slug, title, listing_type, status, city, neighborhood, price, bedrooms, surface_m2
     FROM properties ORDER BY created_at DESC LIMIT 100`
  );
  return NextResponse.json(rows);
}
