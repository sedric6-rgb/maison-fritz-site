"use client";

type Channel =
  | "clients"
  | "leads"
  | "equipe"
  | "relances"
  | "biens"
  | "assistant";

const CHANNELS: { key: Channel; label: string; icon: string }[] = [
  { key: "clients", label: "Clients", icon: "#" },
  { key: "leads", label: "Demandes", icon: "#" },
  { key: "equipe", label: "Équipe", icon: "#" },
  { key: "relances", label: "Relances", icon: "#" },
  { key: "biens", label: "Biens", icon: "#" },
];

export default function CrmSidebar({
  active,
  onSelect,
  onClose,
  pendingLeads,
}: {
  active: Channel;
  onSelect: (ch: Channel) => void;
  onClose?: () => void;
  pendingLeads: number;
}) {
  return (
    <div className="flex h-full w-64 flex-col bg-[#0e211c] text-white">
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <div>
          <h2 className="font-display text-lg leading-tight text-white">
            Maison <span className="text-[#ad7f34]">Fritz</span>
          </h2>
          <p className="text-[11px] text-[#9da89e]">CRM Hub</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded p-1.5 text-[#9da89e] hover:bg-[#1e3b34] hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      <div className="mt-2 px-3">
        <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-[#6b7a6e]">
          Canaux
        </p>
        <div className="mt-1 flex flex-col gap-0.5">
          {CHANNELS.map((ch) => (
            <button
              key={ch.key}
              onClick={() => {
                onSelect(ch.key);
                onClose?.();
              }}
              className={`flex items-center gap-2 rounded px-2 py-1.5 text-left text-[13px] transition-colors ${
                active === ch.key
                  ? "bg-[#1e3b34] font-semibold text-white"
                  : "text-[#b0c0b3] hover:bg-[#162e28] hover:text-white"
              }`}
            >
              <span className="text-[#6b7a6e]">{ch.icon}</span>
              <span className="flex-1">{ch.label}</span>
              {ch.key === "leads" && pendingLeads > 0 && (
                <span className="rounded-full bg-[#ad7f34] px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {pendingLeads}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 px-3">
        <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-[#6b7a6e]">
          Assistant IA
        </p>
        <div className="mt-1">
          <button
            onClick={() => {
              onSelect("assistant");
              onClose?.();
            }}
            className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[13px] transition-colors ${
              active === "assistant"
                ? "bg-[#1e3b34] font-semibold text-white"
                : "text-[#b0c0b3] hover:bg-[#162e28] hover:text-white"
            }`}
          >
            <span className="text-[13px]">✦</span>
            <span>Fritz IA</span>
          </button>
        </div>
      </div>

      <div className="mt-auto px-4 py-4">
        <a
          href="/admin"
          className="block rounded border border-[#2a4a3f] px-3 py-2 text-center text-[12px] text-[#9da89e] transition-colors hover:border-[#ad7f34] hover:text-[#ad7f34]"
        >
          ← Retour admin
        </a>
      </div>
    </div>
  );
}

export type { Channel };
