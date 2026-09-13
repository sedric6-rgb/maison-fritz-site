import { listLeads } from "@/lib/queries/leads";
import { toggleLeadTreatedAction, deleteLeadAction } from "@/lib/actions/admin-leads";
import { formatDate } from "@/lib/format";

export const revalidate = 0;

const LABELS: Record<string, string> = {
  contact: "Contact",
  property_inquiry: "Demande sur un bien",
  job_application: "Candidature",
  sell_with_us: "Sell with us",
};

export default async function AdminLeadsPage() {
  const leads = await listLeads();

  return (
    <div>
      <h1 className="text-3xl">Demandes reçues</h1>

      <div className="mt-8 divide-y divide-line border-y border-line">
        {leads.map((lead) => (
          <div key={lead.id} className="flex items-start justify-between gap-4 py-5">
            <div>
              <p className="font-semibold">
                {lead.name}{" "}
                <span className="ml-2 rounded-full border border-line px-2 py-0.5 text-xs text-ink-soft">
                  {LABELS[lead.lead_type] || lead.lead_type}
                </span>
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                {[lead.phone, lead.email].filter(Boolean).join(" · ")} — {formatDate(lead.created_at)}
              </p>
              {lead.message && <p className="mt-2 max-w-xl text-sm text-ink-soft">{lead.message}</p>}
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2 text-sm">
              <form action={toggleLeadTreatedAction}>
                <input type="hidden" name="id" value={lead.id} />
                <input type="hidden" name="treated" value={lead.is_treated ? "" : "on"} />
                <button type="submit" className="text-forest-deep underline">
                  {lead.is_treated ? "Marquer non traité" : "Marquer traité"}
                </button>
              </form>
              <form action={deleteLeadAction}>
                <input type="hidden" name="id" value={lead.id} />
                <button type="submit" className="text-terracotta underline">
                  Supprimer
                </button>
              </form>
            </div>
          </div>
        ))}
        {leads.length === 0 && (
          <p className="py-8 text-center text-ink-soft">Aucune demande reçue pour le moment.</p>
        )}
      </div>
    </div>
  );
}
