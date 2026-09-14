"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/actions/admin-guard";
import {
  createClient,
  updateClient,
  deleteClient,
  addClientActivity,
  addFollowup,
  markFollowupDone,
  deleteFollowup,
  createClientFromLead,
  type ClientInput,
  type ClientStatus,
} from "@/lib/queries/crm";

function parseClientInput(formData: FormData): ClientInput {
  const agentId = String(formData.get("assigned_agent_id") || "");
  return {
    full_name: String(formData.get("full_name") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    status: (String(formData.get("status") || "nouveau") as ClientStatus),
    source: String(formData.get("source") || "").trim(),
    assigned_agent_id: agentId ? Number(agentId) : null,
    notes: String(formData.get("notes") || "").trim(),
  };
}

export async function createClientAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = await createClient(parseClientInput(formData));
  redirect(`/admin/clients/${id}/edit`);
}

export async function updateClientAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await updateClient(id, parseClientInput(formData));
  redirect(`/admin/clients/${id}/edit`);
}

export async function deleteClientAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await deleteClient(id);
  redirect("/admin/clients");
}

export async function addActivityAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const clientId = Number(formData.get("client_id"));
  const type = String(formData.get("type") || "note") as
    | "note"
    | "appel"
    | "email"
    | "rdv"
    | "autre";
  const content = String(formData.get("content") || "").trim();
  if (content) {
    await addClientActivity(clientId, type, content);
  }
  redirect(`/admin/clients/${clientId}/edit`);
}

export async function addFollowupAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const clientId = Number(formData.get("client_id"));
  const dueDate = String(formData.get("due_date") || "");
  const note = String(formData.get("note") || "").trim();
  if (dueDate) {
    await addFollowup(clientId, dueDate, note);
  }
  redirect(`/admin/clients/${clientId}/edit`);
}

export async function toggleFollowupDoneAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const clientId = Number(formData.get("client_id"));
  const done = formData.get("done") === "on";
  await markFollowupDone(id, done);
  redirect(`/admin/clients/${clientId}/edit`);
}

export async function deleteFollowupAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const clientId = Number(formData.get("client_id"));
  await deleteFollowup(id);
  redirect(`/admin/clients/${clientId}/edit`);
}

export async function convertLeadToClientAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const leadId = Number(formData.get("lead_id"));
  const clientId = await createClientFromLead(leadId);
  redirect(`/admin/clients/${clientId}/edit`);
}
