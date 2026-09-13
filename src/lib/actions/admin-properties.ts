"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/actions/admin-guard";
import {
  createProperty,
  updateProperty,
  deleteProperty,
  type PropertyInput,
} from "@/lib/queries/properties";

function parseInput(formData: FormData): PropertyInput {
  const photoUrls = String(formData.get("photo_urls") || "")
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean);

  const agentIdRaw = String(formData.get("agent_id") || "");

  return {
    title: String(formData.get("title") || "").trim(),
    listing_type: formData.get("listing_type") === "location" ? "location" : "vente",
    status: (["disponible", "vendu", "loue"].includes(String(formData.get("status")))
      ? formData.get("status")
      : "disponible") as PropertyInput["status"],
    is_exclusive: formData.get("is_exclusive") === "on",
    is_newly_built: formData.get("is_newly_built") === "on",
    is_frontline_beach: formData.get("is_frontline_beach") === "on",
    featured: formData.get("featured") === "on",
    city: String(formData.get("city") || "").trim(),
    neighborhood: String(formData.get("neighborhood") || "").trim(),
    price: Number(formData.get("price")) || 0,
    bedrooms: Number(formData.get("bedrooms")) || 0,
    bathrooms: Number(formData.get("bathrooms")) || 0,
    surface_m2: Number(formData.get("surface_m2")) || 0,
    description: String(formData.get("description") || "").trim(),
    video_url: String(formData.get("video_url") || "").trim(),
    agent_id: agentIdRaw ? Number(agentIdRaw) : null,
    photoUrls,
  };
}

export async function createPropertyAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const input = parseInput(formData);
  await createProperty(input);
  redirect("/admin/properties");
}

export async function updatePropertyAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const input = parseInput(formData);
  await updateProperty(id, input);
  redirect("/admin/properties");
}

export async function deletePropertyAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await deleteProperty(id);
  redirect("/admin/properties");
}
