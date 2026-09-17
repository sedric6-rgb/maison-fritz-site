"use client";

import { useEffect, useState } from "react";

type Client = {
  id: number;
  full_name: string;
  phone: string | null;
  email: string | null;
  status: string;
  source: string | null;
  updated_at: string;
};

const STATUS_LABELS: Record<string, string> = {
  nouveau: "Nouveau",
  contacte: "Contacté",
  qualifie: "Qualifié",
  negociation: "Négociation",
  converti: "Converti",
  perdu: "Perdu",
};

const STATUS_COLORS: Record<string, string> = {
  nouveau: "bg-blue-500/20 text-blue-300",
  contacte: "bg-emerald-500/20 text-emerald-300",
  qualifie: "bg-[#ad7f34]/20 text-[#c9a15f]",
  negociation: "bg-purple-500/20 text-purple-300",
  converti: "bg-green-500/20 text-green-300",
  perdu: "bg-red-500/20 text-red-300",
};

type Filter = "" | "nouveau" | "contacte" | "qualifie" | "negociation" | "converti" | "perdu";

export default function CrmChannelClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/crm/clients${filter ? `?status=${filter}` : ""}`)
      .then((r) => r.json())
      .then((data) => setClients(Array.isArray(data) ? data : []))
      .catch(() => setClients([]))
      .finally(() => setLoading(false));
  }, [filter]);

  const filters: { key: Filter; label: string }[] = [
    { key: "", label: "Tous" },
    { key: "nouveau", label: "Nouveaux" },
    { key: "contacte", label: "Contactés" },
    { key: "qualifie", label: "Qualifiés" },
    { key: "negociation", label: "Négociation" },
    { key: "converti", label: "Convertis" },
    { key: "perdu", label: "Perdus" },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#2a4a3f] px-5 pt-4 pb-3">
        <h3 className="text-lg font-bold text-white"># Clients</h3>
        <p className="mt-1 text-[12px] text-[#6b7a6e]">
          Pipeline de clients · {clients.length} enregistré{clients.length > 1 ? "s" : ""}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {filters.map((f) => (
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
        ) : clients.length === 0 ? (
          <p className="py-8 text-center text-[13px] text-[#6b7a6e]">
            Aucun client pour ce filtre.
          </p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {clients.map((c) => (
              <a
                key={c.id}
                href={`/admin/clients/${c.id}/edit`}
                className="flex items-center gap-3 rounded-lg bg-[#162e28] px-3 py-3 transition-colors hover:bg-[#1e3b34]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0e211c] text-[13px] font-bold text-[#9da89e]">
                  {c.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[13px] font-bold text-white">
                      {c.full_name}
                    </span>
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        STATUS_COLORS[c.status] || "bg-gray-500/20 text-gray-300"
                      }`}
                    >
                      {STATUS_LABELS[c.status] || c.status}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-[#6b7a6e]">
                    {[c.phone, c.email].filter(Boolean).join(" · ") || "Aucun contact"}
                  </p>
                </div>
                <span className="text-[18px] text-[#2a4a3f]">›</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
