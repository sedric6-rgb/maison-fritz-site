import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api-guard";
import { listAiMessages, saveAiMessage } from "@/lib/queries/crm-hub";
import { getAiResponse } from "@/lib/crm-ai-service";

export async function POST(request: NextRequest) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const { message } = await request.json();
  if (!message || typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Message requis" }, { status: 400 });
  }

  const trimmed = message.trim();
  await saveAiMessage("user", trimmed);

  const history = await listAiMessages();
  const aiResponse = await getAiResponse(trimmed, history);
  await saveAiMessage("assistant", aiResponse);

  return NextResponse.json({ response: aiResponse });
}
