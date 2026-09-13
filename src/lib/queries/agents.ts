import { db } from "@/lib/db";
import { slugify, uniqueSlug } from "@/lib/slugify";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

export type Agent = {
  id: number;
  slug: string;
  full_name: string;
  role: string;
  phone: string | null;
  email: string | null;
  city: string | null;
  bio: string | null;
  photo_url: string | null;
  created_at: string;
};

export async function listAgents(): Promise<Agent[]> {
  const [rows] = await db.query<RowDataPacket[]>(`SELECT * FROM agents ORDER BY full_name ASC`);
  return rows as Agent[];
}

export async function getAgentBySlug(slug: string): Promise<Agent | null> {
  const [rows] = await db.query<RowDataPacket[]>(`SELECT * FROM agents WHERE slug = ?`, [slug]);
  return (rows[0] as Agent) ?? null;
}

export async function getAgentById(id: number): Promise<Agent | null> {
  const [rows] = await db.query<RowDataPacket[]>(`SELECT * FROM agents WHERE id = ?`, [id]);
  return (rows[0] as Agent) ?? null;
}

async function slugExists(slug: string): Promise<boolean> {
  const [rows] = await db.query<RowDataPacket[]>(`SELECT id FROM agents WHERE slug = ?`, [slug]);
  return rows.length > 0;
}

export type AgentInput = {
  full_name: string;
  role: string;
  phone: string;
  email: string;
  city: string;
  bio: string;
  photo_url: string;
};

export async function createAgent(input: AgentInput): Promise<number> {
  const slug = await uniqueSlug(input.full_name, slugExists);
  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO agents (slug, full_name, role, phone, email, city, bio, photo_url)
     VALUES (?,?,?,?,?,?,?,?)`,
    [
      slug,
      input.full_name,
      input.role,
      input.phone || null,
      input.email || null,
      input.city || null,
      input.bio || null,
      input.photo_url || null,
    ]
  );
  return result.insertId;
}

export async function updateAgent(id: number, input: AgentInput): Promise<void> {
  const current = await getAgentById(id);
  if (!current) throw new Error("Agent introuvable");
  const slug =
    slugify(input.full_name) === current.slug
      ? current.slug
      : await uniqueSlug(input.full_name, slugExists);

  await db.query(
    `UPDATE agents SET slug=?, full_name=?, role=?, phone=?, email=?, city=?, bio=?, photo_url=?
     WHERE id=?`,
    [
      slug,
      input.full_name,
      input.role,
      input.phone || null,
      input.email || null,
      input.city || null,
      input.bio || null,
      input.photo_url || null,
      id,
    ]
  );
}

export async function deleteAgent(id: number): Promise<void> {
  await db.query(`DELETE FROM agents WHERE id = ?`, [id]);
}
