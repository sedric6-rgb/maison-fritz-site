import { db } from "@/lib/db";
import { slugify, uniqueSlug } from "@/lib/slugify";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  published_at: string;
  created_at: string;
};

export async function listBlogPosts(limit?: number): Promise<BlogPost[]> {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT * FROM blog_posts ORDER BY published_at DESC ${limit ? "LIMIT ?" : ""}`,
    limit ? [limit] : []
  );
  return rows as BlogPost[];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const [rows] = await db.query<RowDataPacket[]>(`SELECT * FROM blog_posts WHERE slug = ?`, [
    slug,
  ]);
  return (rows[0] as BlogPost) ?? null;
}

export async function getBlogPostById(id: number): Promise<BlogPost | null> {
  const [rows] = await db.query<RowDataPacket[]>(`SELECT * FROM blog_posts WHERE id = ?`, [id]);
  return (rows[0] as BlogPost) ?? null;
}

async function slugExists(slug: string): Promise<boolean> {
  const [rows] = await db.query<RowDataPacket[]>(`SELECT id FROM blog_posts WHERE slug = ?`, [
    slug,
  ]);
  return rows.length > 0;
}

export type BlogPostInput = {
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
};

export async function createBlogPost(input: BlogPostInput): Promise<number> {
  const slug = await uniqueSlug(input.title, slugExists);
  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO blog_posts (slug, title, excerpt, content, cover_image_url)
     VALUES (?,?,?,?,?)`,
    [slug, input.title, input.excerpt || null, input.content, input.cover_image_url || null]
  );
  return result.insertId;
}

export async function updateBlogPost(id: number, input: BlogPostInput): Promise<void> {
  const current = await getBlogPostById(id);
  if (!current) throw new Error("Article introuvable");
  const slug =
    slugify(input.title) === current.slug
      ? current.slug
      : await uniqueSlug(input.title, slugExists);

  await db.query(
    `UPDATE blog_posts SET slug=?, title=?, excerpt=?, content=?, cover_image_url=? WHERE id=?`,
    [slug, input.title, input.excerpt || null, input.content, input.cover_image_url || null, id]
  );
}

export async function deleteBlogPost(id: number): Promise<void> {
  await db.query(`DELETE FROM blog_posts WHERE id = ?`, [id]);
}
