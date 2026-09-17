"use client";

import { useEffect, useState } from "react";

type Lead = {
  id: number;
  lead_type: string;
  name: string;
  phone: string | null;
  email: string | null;
  message: string | null;
  is_treated: boolean;
  created_at: string;
};

const TYPE_LABELS: Record<string, string> = {
  contact: "Contact",
  property_inquiry: "Demande bien",
  job_application: "Candidature",
  sell_with_us: "Vendre avec nous",
};

type Filter = "all" | "pending" | "treated";

export default function CrmChannelLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    setLoading(true);
    fetch("/api/crm/leads")
      .then((r) => r.json())
      .then((data) => setLeads(Array.isArray(data) ? data : []))
      .catch(() => setLeads([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = leads.filter((l) => {
    if (filter === "pending") return !l.is_treated;
    if (filter === "treated") return l.is_treated;
    return true;
  });

  const pending = leads.filter((l) => !l.is_treated).length;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#2a4a3f] px-5 pt-4 pb-3">
        <h3 className="text-lg font-bold text-white"># Demandes</h3>
        <p className="mt-1 text-[12px] text-[#6b7a6e]">
          {pending} demande{pending > 1 ? "s" : ""} en attente
        </p>
        <div className="mt-3 flex gap-1.5">
          {(
            [
              { key: "all", label: "Toutes" },
              { key: "pending", label: "En attente" },
              { key: "treated", label: "Traitées" },
            ] as { key: Filter; label: string }[]
          ).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                filter === f.key
                  ? "bg-[#ad7f34] text-white"
                  : "border border-[#2a4a3f] text-[#9da89e] hover:border-[#ad7f34]/50 hover:text-[#c9a15f]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        {loading ? (
          <div className="flex flex-col gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-[#162e28]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-8 text-center text-[13px] text-[#6b7a6e]">
            Aucune demande pour ce filtre.
          </p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {filtered.map((l) => (
              <div
                key={l.id}
                className="rounded-lg bg-[#162e28] px-3 py-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-white">{l.name}</span>
                  <span className="rounded bg-[#1e3b34] px-1.5 py-0.5 text-[10px] font-bold text-[#9da89e]">
                    {TYPE_LABELS[l.lead_type] || l.lead_type}
                  </span>
                  {!l.is_treated && (
                    <span className="rounded bg-[#ad7f34]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#c9a15f]">
                      Nouveau
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[11px] text-[#6b7a6e]">
                  {[l.phone, l.email].filter(Boolean).join(" · ")}
                </p>
                {l.message && (
                  <p className="mt-1.5 line-clamp-2 text-[12px] text-[#9da89e]">
                    {l.message}
                  </p>
                )}
                <p className="mt-1.5 text-[10px] text-[#4a5a4e]">
                  {new Date(l.created_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
