import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api-guard";
import { getCrmStats } from "@/lib/queries/crm-hub";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const stats = await getCrmStats();
  return NextResponse.json(stats);
}
