import Link from "next/link";
import { db } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

export const revalidate = 0;

async function count(table: string): Promise<number> {
  const [rows] = await db.query<RowDataPacket[]>(`SELECT COUNT(*) as c FROM ${table}`);
  return Number(rows[0]?.c || 0);
}

export default async function AdminHomePage() {
  const [properties, agents, posts, jobs, leads] = await Promise.all([
    count("properties"),
    count("agents"),
    count("blog_posts"),
    count("job_listings"),
    count("contact_leads"),
  ]);

  const cards = [
    { label: "Propriétés", value: properties, href: "/admin/properties" },
    { label: "Agents", value: agents, href: "/admin/agents" },
    { label: "Articles de blog", value: posts, href: "/admin/blog" },
    { label: "Offres d'emploi", value: jobs, href: "/admin/careers" },
    { label: "Demandes reçues", value: leads, href: "/admin/leads" },
  ];

  return (
    <div>
      <h1 className="text-3xl">Tableau de bord</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="border border-line bg-paper p-6">
            <div className="font-display text-3xl text-forest-deep">{c.value}</div>
            <div className="mt-1 text-sm text-ink-soft">{c.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
