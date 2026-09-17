import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api-guard";
import { listAiMessages, clearAiHistory } from "@/lib/queries/crm-hub";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const messages = await listAiMessages();
  return NextResponse.json(messages);
}

export async function DELETE() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  await clearAiHistory();
  return NextResponse.json({ ok: true });
}
