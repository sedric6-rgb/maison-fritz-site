"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "./admin-guard";
import { setClientBlocked } from "@/lib/blocked-clients";

export async function blockClientAction(
  clientId: number
): Promise<{ success: boolean }> {
  await requireAdmin();
  setClientBlocked(clientId, true);
  revalidatePath("/admin/clients", "layout");
  revalidatePath("/espace-client", "layout");
  return { success: true };
}

export async function unblockClientAction(
  clientId: number
): Promise<{ success: boolean }> {
  await requireAdmin();
  setClientBlocked(clientId, false);
  revalidatePath("/admin/clients", "layout");
  revalidatePath("/espace-client", "layout");
  return { success: true };
}
