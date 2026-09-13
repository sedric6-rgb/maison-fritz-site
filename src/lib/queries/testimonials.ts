import { db } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

export type Testimonial = {
  id: number;
  author_name: string;
  rating: number;
  message: string;
  is_published: boolean;
  created_at: string;
};

export async function listPublishedTestimonials(limit = 6): Promise<Testimonial[]> {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT * FROM testimonials WHERE is_published = TRUE ORDER BY created_at DESC LIMIT ?`,
    [limit]
  );
  return rows as Testimonial[];
}
