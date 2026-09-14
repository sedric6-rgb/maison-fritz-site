import Link from "next/link";
import { db } from "@/lib/db";
import type { RowDataPacket } from "mysql2";
import { listClients, listUpcomingFollowups } from "@/lib/queries/crm";
import { formatDate, isOverdue } from "@/lib/format";

export const revalidate = 0;

async function count(table: string): Promise<number> {
  const [rows] = await db.query<RowDataPacket[]>(`SELECT COUNT(*) as c FROM ${table}`);
  return Number(rows[0]?.c || 0);
}

export default async function AdminHomePage() {
  const [properties, agents, posts, jobs, leads, clients, upcomingFollowups] = await Promise.all([
    count("properties"),
    count("agents"),
    count("blog_posts"),
    count("job_listings"),
    count("contact_leads"),
    listClients(),
    listUpcomingFollowups(6),
  ]);

  const cards = [
    { label: "Propriétés", value: properties, href: "/admin/properties" },
    { label: "Agents", value: agents, href: "/admin/agents" },
    { label: "Articles de blog", value: posts, href: "/admin/blog" },
    { label: "Offres d'emploi", value: jobs, href: "/admin/careers" },
    { label: "Demandes reçues", value: leads, href: "/admin/leads" },
    { label: "Clients (CRM)", value: clients.length, href: "/admin/clients" },
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

      <div className="mt-12">
        <h2 className="text-2xl">Prochaines relances</h2>
        <div className="mt-4 divide-y divide-line border-y border-line">
          {upcomingFollowups.map((f) => {
            const overdue = isOverdue(f.due_date);
            return (
              <Link
                key={f.id}
                href={`/admin/clients/${f.client_id}/edit`}
                className="flex items-center justify-between gap-4 py-3 hover:bg-paper"
              >
                <div>
                  <p className="font-semibold">{f.client_full_name}</p>
                  <p className="text-sm text-ink-soft">{f.note || "Relance"}</p>
                </div>
                <p className={`shrink-0 text-sm ${overdue ? "text-terracotta" : "text-ink-soft"}`}>
                  {formatDate(f.due_date)}
                  {overdue ? " — en retard" : ""}
                </p>
              </Link>
            );
          })}
          {upcomingFollowups.length === 0 && (
            <p className="py-6 text-center text-sm text-ink-soft">Aucune relance programmée.</p>
          )}
        </div>
      </div>
    </div>
  );
}
