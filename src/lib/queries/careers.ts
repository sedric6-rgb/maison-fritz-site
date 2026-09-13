import { db } from "@/lib/db";
import { slugify, uniqueSlug } from "@/lib/slugify";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

export type JobListing = {
  id: number;
  slug: string;
  title: string;
  city: string | null;
  contract_type: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
};

export async function listJobListings(activeOnly = true): Promise<JobListing[]> {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT * FROM job_listings ${activeOnly ? "WHERE is_active = TRUE" : ""} ORDER BY created_at DESC`
  );
  return rows as JobListing[];
}

export async function getJobListingBySlug(slug: string): Promise<JobListing | null> {
  const [rows] = await db.query<RowDataPacket[]>(`SELECT * FROM job_listings WHERE slug = ?`, [
    slug,
  ]);
  return (rows[0] as JobListing) ?? null;
}

export async function getJobListingById(id: number): Promise<JobListing | null> {
  const [rows] = await db.query<RowDataPacket[]>(`SELECT * FROM job_listings WHERE id = ?`, [id]);
  return (rows[0] as JobListing) ?? null;
}

async function slugExists(slug: string): Promise<boolean> {
  const [rows] = await db.query<RowDataPacket[]>(`SELECT id FROM job_listings WHERE slug = ?`, [
    slug,
  ]);
  return rows.length > 0;
}

export type JobListingInput = {
  title: string;
  city: string;
  contract_type: string;
  description: string;
  is_active: boolean;
};

export async function createJobListing(input: JobListingInput): Promise<number> {
  const slug = await uniqueSlug(input.title, slugExists);
  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO job_listings (slug, title, city, contract_type, description, is_active)
     VALUES (?,?,?,?,?,?)`,
    [slug, input.title, input.city || null, input.contract_type || null, input.description || null, input.is_active]
  );
  return result.insertId;
}

export async function updateJobListing(id: number, input: JobListingInput): Promise<void> {
  const current = await getJobListingById(id);
  if (!current) throw new Error("Offre introuvable");
  const slug =
    slugify(input.title) === current.slug
      ? current.slug
      : await uniqueSlug(input.title, slugExists);

  await db.query(
    `UPDATE job_listings SET slug=?, title=?, city=?, contract_type=?, description=?, is_active=?
     WHERE id=?`,
    [slug, input.title, input.city || null, input.contract_type || null, input.description || null, input.is_active, id]
  );
}

export async function deleteJobListing(id: number): Promise<void> {
  await db.query(`DELETE FROM job_listings WHERE id = ?`, [id]);
}
