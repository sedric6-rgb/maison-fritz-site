"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/actions/admin-guard";
import {
  createJobListing,
  updateJobListing,
  deleteJobListing,
  type JobListingInput,
} from "@/lib/queries/careers";

function parseInput(formData: FormData): JobListingInput {
  return {
    title: String(formData.get("title") || "").trim(),
    city: String(formData.get("city") || "").trim(),
    contract_type: String(formData.get("contract_type") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    is_active: formData.get("is_active") === "on",
  };
}

export async function createJobListingAction(formData: FormData): Promise<void> {
  await requireAdmin();
  await createJobListing(parseInput(formData));
  redirect("/admin/careers");
}

export async function updateJobListingAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await updateJobListing(id, parseInput(formData));
  redirect("/admin/careers");
}

export async function deleteJobListingAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await deleteJobListing(id);
  redirect("/admin/careers");
}
