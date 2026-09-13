"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/actions/admin-guard";
import { markLeadTreated, deleteLead } from "@/lib/queries/leads";

export async function toggleLeadTreatedAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const treated = formData.get("treated") === "on";
  await markLeadTreated(id, treated);
  redirect("/admin/leads");
}

export async function deleteLeadAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await deleteLead(id);
  redirect("/admin/leads");
}
