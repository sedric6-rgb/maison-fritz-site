"use client";

import { useEffect, useState } from "react";

type Property = {
  id: number;
  slug: string;
  title: string;
  listing_type: string;
  status: string;
  city: string;
  neighborhood: string | null;
  price: number;
  bedrooms: number;
  surface_m2: number;
};

const STATUS_LABELS: Record<string, string> = {
  disponible: "Disponible",
  vendu: "Vendu",
  loue: "Loué",
};

const STATUS_COLORS: Record<string, string> = {
  disponible: "bg-emerald-500/20 text-emerald-300",
  vendu: "bg-[#6b7a6e]/20 text-[#6b7a6e]",
  loue: "bg-blue-500/20 text-blue-300",
};

type Filter = "" | "disponible" | "vendu" | "loue";

export default function CrmChannelProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("");

  useEffect(() => {
    fetch("/api/crm/properties")
      .then((r) => r.json())
      .then((data) => setProperties(Array.isArray(data) ? data : []))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter
    ? properties.filter((p) => p.status === filter)
    : properties;

  const formatPrice = (val: number) =>
    new Intl.NumberFormat("fr-FR").format(Math.round(val)) + " FCFA";

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#2a4a3f] px-5 pt-4 pb-3">
        <h3 className="text-lg font-bold text-white"># Biens</h3>
        <p className="mt-1 text-[12px] text-[#6b7a6e]">
          Portefeuille de propriétés · {properties.length} bien{properties.length > 1 ? "s" : ""}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(
            [
              { key: "", label: "Tous" },
              { key: "disponible", label: "Disponibles" },
              { key: "vendu", label: "Vendus" },
              { key: "loue", label: "Loués" },
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
            Aucun bien pour ce filtre.
          </p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {filtered.map((p) => (
              <a
                key={p.id}
                href={`/admin/properties/${p.id}/edit`}
                className="flex items-center gap-3 rounded-lg bg-[#162e28] px-3 py-3 transition-colors hover:bg-[#1e3b34]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0e211c] text-[16px]">
                  {p.listing_type === "location" ? "🏠" : "🏡"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[13px] font-bold text-white">
                      {p.title}
                    </span>
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        STATUS_COLORS[p.status] || "bg-gray-500/20 text-gray-300"
                      }`}
                    >
                      {STATUS_LABELS[p.status] || p.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-[#6b7a6e]">
                    {[p.city, p.neighborhood].filter(Boolean).join(" · ")}
                    {p.surface_m2 ? ` · ${p.surface_m2} m²` : ""}
                    {p.bedrooms ? ` · ${p.bedrooms} ch.` : ""}
                  </p>
                </div>
                <span className="shrink-0 text-[12px] font-bold text-[#ad7f34]">
                  {formatPrice(p.price)}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
