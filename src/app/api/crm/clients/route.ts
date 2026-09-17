import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api-guard";
import { listClients, type ClientStatus } from "@/lib/queries/crm";

const VALID_STATUSES = new Set(["nouveau", "contacte", "qualifie", "negociation", "converti", "perdu"]);

export async function GET(request: NextRequest) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const status = request.nextUrl.searchParams.get("status");
  const filters = status && VALID_STATUSES.has(status) ? { status: status as ClientStatus } : {};
  const clients = await listClients(filters);
  return NextResponse.json(clients);
}
