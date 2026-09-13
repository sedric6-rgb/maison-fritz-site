"use server";

import { redirect } from "next/navigation";
import { createLead } from "@/lib/queries/leads";

function str(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitContactForm(formData: FormData): Promise<void> {
  const name = str(formData, "name");
  const phone = str(formData, "phone");
  const email = str(formData, "email");
  const message = str(formData, "message");

  if (!name || (!phone && !email)) {
    redirect("/contact?error=1");
  }

  await createLead({ lead_type: "contact", name, phone, email, message });
  redirect("/contact?sent=1");
}

export async function submitPropertyInquiry(formData: FormData): Promise<void> {
  const propertyId = Number(formData.get("property_id"));
  const propertySlug = str(formData, "property_slug");
  const name = str(formData, "name");
  const phone = str(formData, "phone");
  const email = str(formData, "email");
  const message = str(formData, "message");

  if (!name || (!phone && !email) || !propertyId) {
    redirect(`/properties/${propertySlug}?error=1`);
  }

  await createLead({
    lead_type: "property_inquiry",
    name,
    phone,
    email,
    message,
    property_id: propertyId,
  });
  redirect(`/properties/${propertySlug}?sent=1`);
}

export async function submitJobApplication(formData: FormData): Promise<void> {
  const jobId = Number(formData.get("job_id"));
  const jobSlug = str(formData, "job_slug");
  const name = str(formData, "name");
  const phone = str(formData, "phone");
  const email = str(formData, "email");
  const message = str(formData, "message");

  if (!name || (!phone && !email) || !jobId) {
    redirect(`/careers/${jobSlug}?error=1`);
  }

  await createLead({
    lead_type: "job_application",
    name,
    phone,
    email,
    message,
    job_listing_id: jobId,
  });
  redirect(`/careers/${jobSlug}?sent=1`);
}

export async function submitSellWithUs(formData: FormData): Promise<void> {
  const name = str(formData, "name");
  const phone = str(formData, "phone");
  const email = str(formData, "email");
  const message = str(formData, "message");

  if (!name || (!phone && !email)) {
    redirect("/about?error=1#sell-with-us");
  }

  await createLead({ lead_type: "sell_with_us", name, phone, email, message });
  redirect("/about?sent=1#sell-with-us");
}
