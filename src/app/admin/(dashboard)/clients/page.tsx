import Link from "next/link";
import { listClients, type ClientStatus } from "@/lib/queries/crm";
import { listAgents } from "@/lib/queries/agents";
import { STATUS_LABELS } from "@/components/admin/ClientForm";
import { formatDate } from "@/lib/format";

export const revalidate = 0;

const STATUS_TABS: { key: string; label: string }[] = [
  { key: "", label: "Tous" },
  { key: "nouveau", label: STATUS_LABELS.nouveau },
  { key: "contacte", label: STATUS_LABELS.contacte },
  { key: "qualifie", label: STATUS_LABELS.qualifie },
  { key: "negociation", label: STATUS_LABELS.negociation },
  { key: "converti", label: STATUS_LABELS.converti },
  { key: "perdu", label: STATUS_LABELS.perdu },
];

export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const validStatus = (STATUS_TABS.some((t) => t.key === status) ? status : undefined) as
    | ClientStatus
    | undefined;

  const [clients, agents] = await Promise.all([
    listClients(validStatus ? { status: validStatus } : {}),
    listAgents(),
  ]);
  const agentsById = new Map(agents.map((a) => [a.id, a.full_name]));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Clients (CRM)</h1>
        <Link href="/admin/clients/new" className="btn btn-primary">
          + Nouveau client
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 hairline pb-6 text-sm">
        {STATUS_TABS.map((t) => {
          const active = (status || "") === t.key;
          return (
            <Link
              key={t.key}
              href={t.key ? `/admin/clients?status=${t.key}` : "/admin/clients"}
              className={`rounded-full px-3 py-1.5 ${
                active ? "bg-forest text-paper" : "border border-line text-ink-soft"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-6 divide-y divide-line border-y border-line">
        {clients.map((c) => (
          <Link
            key={c.id}
            href={`/admin/clients/${c.id}/edit`}
            className="flex items-center justify-between gap-4 py-4 hover:bg-paper"
          >
            <div>
              <p className="font-semibold">
                {c.full_name}{" "}
                <span className="ml-2 rounded-full border border-ochre/40 px-2 py-0.5 text-xs text-ochre">
                  {STATUS_LABELS[c.status] || c.status}
                </span>
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                {[c.phone, c.email].filter(Boolean).join(" · ") || "Aucun contact renseigné"}
              </p>
            </div>
            <div className="shrink-0 text-right text-sm text-ink-soft">
              <p>{c.assigned_agent_id ? agentsById.get(c.assigned_agent_id) : "Non assigné"}</p>
              <p className="mt-1 text-xs text-ink-faint">Mis à jour le {formatDate(c.updated_at)}</p>
            </div>
          </Link>
        ))}
        {clients.length === 0 && (
          <p className="py-8 text-center text-ink-soft">Aucun client pour ce filtre.</p>
        )}
      </div>
    </div>
  );
}
