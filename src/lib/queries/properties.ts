import { db } from "@/lib/db";
import { slugify, uniqueSlug } from "@/lib/slugify";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

export type Property = {
  id: number;
  slug: string;
  title: string;
  listing_type: "vente" | "location";
  status: "disponible" | "vendu" | "loue";
  is_exclusive: boolean;
  is_newly_built: boolean;
  is_frontline_beach: boolean;
  featured: boolean;
  city: string;
  neighborhood: string | null;
  price: number;
  bedrooms: number;
  bathrooms: number;
  surface_m2: number;
  description: string | null;
  video_url: string | null;
  agent_id: number | null;
  created_at: string;
  updated_at: string;
};

export type PropertyPhoto = { id: number; property_id: number; url: string; position: number };

export type PropertyFilters = {
  tag?: "exclusive" | "newly_built" | "frontline_beach";
  city?: string;
  listingType?: "vente" | "location";
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  includeSold?: boolean;
};

export async function listProperties(filters: PropertyFilters = {}): Promise<Property[]> {
  const where: string[] = [];
  const params: (string | number)[] = [];

  if (!filters.includeSold) {
    where.push("status = 'disponible'");
  }
  if (filters.tag === "exclusive") where.push("is_exclusive = TRUE");
  if (filters.tag === "newly_built") where.push("is_newly_built = TRUE");
  if (filters.tag === "frontline_beach") where.push("is_frontline_beach = TRUE");
  if (filters.city) {
    where.push("city = ?");
    params.push(filters.city);
  }
  if (filters.listingType) {
    where.push("listing_type = ?");
    params.push(filters.listingType);
  }
  if (filters.minPrice != null) {
    where.push("price >= ?");
    params.push(filters.minPrice);
  }
  if (filters.maxPrice != null) {
    where.push("price <= ?");
    params.push(filters.maxPrice);
  }
  if (filters.bedrooms != null) {
    where.push("bedrooms >= ?");
    params.push(filters.bedrooms);
  }

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT * FROM properties ${whereClause} ORDER BY created_at DESC`,
    params
  );
  return rows as Property[];
}

export async function getFeaturedProperty(): Promise<Property | null> {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT * FROM properties WHERE featured = TRUE AND status = 'disponible' ORDER BY created_at DESC LIMIT 1`
  );
  return (rows[0] as Property) ?? null;
}

export async function listSoldProperties(limit = 6): Promise<Property[]> {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT * FROM properties WHERE status IN ('vendu','loue') ORDER BY updated_at DESC LIMIT ?`,
    [limit]
  );
  return rows as Property[];
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const [rows] = await db.query<RowDataPacket[]>(`SELECT * FROM properties WHERE slug = ?`, [
    slug,
  ]);
  return (rows[0] as Property) ?? null;
}

export async function getPropertyById(id: number): Promise<Property | null> {
  const [rows] = await db.query<RowDataPacket[]>(`SELECT * FROM properties WHERE id = ?`, [id]);
  return (rows[0] as Property) ?? null;
}

export async function getPropertyPhotos(propertyId: number): Promise<PropertyPhoto[]> {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT * FROM property_photos WHERE property_id = ? ORDER BY position ASC, id ASC`,
    [propertyId]
  );
  return rows as PropertyPhoto[];
}

async function slugExists(slug: string): Promise<boolean> {
  const [rows] = await db.query<RowDataPacket[]>(`SELECT id FROM properties WHERE slug = ?`, [
    slug,
  ]);
  return rows.length > 0;
}

export type PropertyInput = {
  title: string;
  listing_type: "vente" | "location";
  status: "disponible" | "vendu" | "loue";
  is_exclusive: boolean;
  is_newly_built: boolean;
  is_frontline_beach: boolean;
  featured: boolean;
  city: string;
  neighborhood: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  surface_m2: number;
  description: string;
  video_url: string;
  agent_id: number | null;
  photoUrls: string[];
};

export async function createProperty(input: PropertyInput): Promise<number> {
  const slug = await uniqueSlug(input.title, slugExists);
  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO properties
      (slug, title, listing_type, status, is_exclusive, is_newly_built, is_frontline_beach,
       featured, city, neighborhood, price, bedrooms, bathrooms, surface_m2, description,
       video_url, agent_id)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      slug,
      input.title,
      input.listing_type,
      input.status,
      input.is_exclusive,
      input.is_newly_built,
      input.is_frontline_beach,
      input.featured,
      input.city,
      input.neighborhood || null,
      input.price,
      input.bedrooms,
      input.bathrooms,
      input.surface_m2,
      input.description || null,
      input.video_url || null,
      input.agent_id,
    ]
  );
  const propertyId = result.insertId;
  await replacePhotos(propertyId, input.photoUrls);
  return propertyId;
}

export async function updateProperty(id: number, input: PropertyInput): Promise<void> {
  const current = await getPropertyById(id);
  if (!current) throw new Error("Propriété introuvable");

  const slug =
    slugify(input.title) === current.slug
      ? current.slug
      : await uniqueSlug(input.title, slugExists);

  await db.query(
    `UPDATE properties SET
      slug=?, title=?, listing_type=?, status=?, is_exclusive=?, is_newly_built=?,
      is_frontline_beach=?, featured=?, city=?, neighborhood=?, price=?, bedrooms=?,
      bathrooms=?, surface_m2=?, description=?, video_url=?, agent_id=?
     WHERE id=?`,
    [
      slug,
      input.title,
      input.listing_type,
      input.status,
      input.is_exclusive,
      input.is_newly_built,
      input.is_frontline_beach,
      input.featured,
      input.city,
      input.neighborhood || null,
      input.price,
      input.bedrooms,
      input.bathrooms,
      input.surface_m2,
      input.description || null,
      input.video_url || null,
      input.agent_id,
      id,
    ]
  );
  await replacePhotos(id, input.photoUrls);
}

async function replacePhotos(propertyId: number, urls: string[]): Promise<void> {
  await db.query(`DELETE FROM property_photos WHERE property_id = ?`, [propertyId]);
  const cleanUrls = urls.map((u) => u.trim()).filter(Boolean);
  if (cleanUrls.length === 0) return;
  const values = cleanUrls.map((url, index) => [propertyId, url, index]);
  await db.query(`INSERT INTO property_photos (property_id, url, position) VALUES ?`, [values]);
}

export async function deleteProperty(id: number): Promise<void> {
  await db.query(`DELETE FROM properties WHERE id = ?`, [id]);
}

export async function listPropertiesByAgent(agentId: number): Promise<Property[]> {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT * FROM properties WHERE agent_id = ? AND status = 'disponible' ORDER BY created_at DESC`,
    [agentId]
  );
  return rows as Property[];
}

export async function listSimilarProperties(property: Property, limit = 3): Promise<Property[]> {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT * FROM properties
     WHERE id <> ? AND status = 'disponible'
       AND (city = ? OR listing_type = ?)
     ORDER BY (city = ?) DESC, (listing_type = ?) DESC, featured DESC, created_at DESC
     LIMIT ?`,
    [property.id, property.city, property.listing_type, property.city, property.listing_type, limit]
  );
  return rows as Property[];
}

export async function listDistinctCities(): Promise<string[]> {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT DISTINCT city FROM properties ORDER BY city ASC`
  );
  return (rows as { city: string }[]).map((r) => r.city);
}
