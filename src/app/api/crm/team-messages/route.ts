import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api-guard";
import { listTeamMessages, sendTeamMessage } from "@/lib/queries/crm-hub";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const messages = await listTeamMessages();
  return NextResponse.json(messages);
}

export async function POST(request: NextRequest) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const { senderName, body } = await request.json();
  if (!body || typeof body !== "string" || !body.trim()) {
    return NextResponse.json({ error: "Message requis" }, { status: 400 });
  }
  const id = await sendTeamMessage(senderName || "Admin", body.trim());
  return NextResponse.json({ id });
}
