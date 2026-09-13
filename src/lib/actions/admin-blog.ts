"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/actions/admin-guard";
import {
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  type BlogPostInput,
} from "@/lib/queries/blog";

function parseInput(formData: FormData): BlogPostInput {
  return {
    title: String(formData.get("title") || "").trim(),
    excerpt: String(formData.get("excerpt") || "").trim(),
    content: String(formData.get("content") || "").trim(),
    cover_image_url: String(formData.get("cover_image_url") || "").trim(),
  };
}

export async function createBlogPostAction(formData: FormData): Promise<void> {
  await requireAdmin();
  await createBlogPost(parseInput(formData));
  redirect("/admin/blog");
}

export async function updateBlogPostAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await updateBlogPost(id, parseInput(formData));
  redirect("/admin/blog");
}

export async function deleteBlogPostAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await deleteBlogPost(id);
  redirect("/admin/blog");
}
