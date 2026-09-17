"use client";

import { useEffect, useState } from "react";

type Followup = {
  id: number;
  client_id: number;
  due_date: string;
  note: string | null;
  is_done: boolean;
  client_full_name: string;
};

export default function CrmChannelFollowups() {
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDone, setShowDone] = useState(false);

  useEffect(() => {
    fetch("/api/crm/followups")
      .then((r) => r.json())
      .then((data) => setFollowups(Array.isArray(data) ? data : []))
      .catch(() => setFollowups([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = followups.filter((f) => (showDone ? f.is_done : !f.is_done));

  const isOverdue = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return d.getTime() < now.getTime();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#2a4a3f] px-5 pt-4 pb-3">
        <h3 className="text-lg font-bold text-white"># Relances</h3>
        <p className="mt-1 text-[12px] text-[#6b7a6e]">
          Relances planifiées et rappels de suivi
        </p>
        <div className="mt-3 flex gap-1.5">
          <button
            onClick={() => setShowDone(false)}
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
              !showDone
                ? "bg-[#ad7f34] text-white"
                : "border border-[#2a4a3f] text-[#9da89e] hover:text-[#c9a15f]"
            }`}
          >
            À faire
          </button>
          <button
            onClick={() => setShowDone(true)}
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
              showDone
                ? "bg-[#ad7f34] text-white"
                : "border border-[#2a4a3f] text-[#9da89e] hover:text-[#c9a15f]"
            }`}
          >
            Terminées
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        {loading ? (
          <div className="flex flex-col gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-[#162e28]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-8 text-center text-[13px] text-[#6b7a6e]">
            {showDone ? "Aucune relance terminée." : "Aucune relance en attente."}
          </p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {filtered.map((f) => {
              const overdue = !f.is_done && isOverdue(f.due_date);
              return (
                <a
                  key={f.id}
                  href={`/admin/clients/${f.client_id}/edit`}
                  className="flex items-center gap-3 rounded-lg bg-[#162e28] px-3 py-3 transition-colors hover:bg-[#1e3b34]"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg ${
                      overdue ? "bg-[#9c4a2e]/20" : "bg-[#0e211c]"
                    }`}
                  >
                    <span className={`text-[14px] font-bold ${overdue ? "text-[#9c4a2e]" : "text-white"}`}>
                      {new Date(f.due_date).toLocaleDateString("fr-FR", { day: "numeric" })}
                    </span>
                    <span className="text-[9px] uppercase text-[#6b7a6e]">
                      {new Date(f.due_date).toLocaleDateString("fr-FR", { month: "short" })}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[13px] font-bold text-white">
                      {f.client_full_name}
                    </span>
                    <p className="mt-0.5 truncate text-[11px] text-[#6b7a6e]">
                      {f.note || "Relance"}
                    </p>
                  </div>
                  {overdue && (
                    <span className="shrink-0 rounded bg-[#9c4a2e]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#9c4a2e]">
                      En retard
                    </span>
                  )}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
