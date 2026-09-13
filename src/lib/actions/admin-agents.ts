"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/actions/admin-guard";
import { createAgent, updateAgent, deleteAgent, type AgentInput } from "@/lib/queries/agents";

function parseInput(formData: FormData): AgentInput {
  return {
    full_name: String(formData.get("full_name") || "").trim(),
    role: String(formData.get("role") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    city: String(formData.get("city") || "").trim(),
    bio: String(formData.get("bio") || "").trim(),
    photo_url: String(formData.get("photo_url") || "").trim(),
  };
}

export async function createAgentAction(formData: FormData): Promise<void> {
  await requireAdmin();
  await createAgent(parseInput(formData));
  redirect("/admin/agents");
}

export async function updateAgentAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await updateAgent(id, parseInput(formData));
  redirect("/admin/agents");
}

export async function deleteAgentAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await deleteAgent(id);
  redirect("/admin/agents");
}
