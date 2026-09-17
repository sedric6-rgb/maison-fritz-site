"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import CrmMessageBubble from "./CrmMessageBubble";
import CrmComposer from "./CrmComposer";

type AiMessage = {
  id: number;
  role: "user" | "assistant";
  body: string;
  created_at: string;
};

const SUGGESTIONS = [
  "Quel est l'état du marché immobilier à Brazzaville ?",
  "Comment rédiger une annonce attractive ?",
  "Quels documents pour une vente immobilière ?",
  "Conseils pour qualifier un prospect",
];

export default function CrmChannelAi() {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/crm/ai-messages");
      if (!res.ok) return;
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch {}
  }, []);

  useEffect(() => {
    fetchMessages().finally(() => setLoading(false));
  }, [fetchMessages]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    const userMsg: AiMessage = {
      id: Date.now(),
      role: "user",
      body: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setSending(true);

    try {
      const res = await fetch("/api/crm/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      if (data.response) {
        const aiMsg: AiMessage = {
          id: Date.now() + 1,
          role: "assistant",
          body: data.response,
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch {
      const errMsg: AiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        body: "Erreur de connexion. Réessayez dans un moment.",
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setSending(false);
    }
  };

  const handleClear = async () => {
    try {
      await fetch("/api/crm/ai-messages", { method: "DELETE" });
      setMessages([]);
    } catch {}
  };

  const showWelcome = !loading && messages.length === 0;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-[#2a4a3f] px-5 pt-4 pb-3">
        <div>
          <h3 className="text-lg font-bold text-white">
            <span className="mr-2 text-[#ad7f34]">✦</span>Fritz IA
          </h3>
          <p className="mt-1 text-[12px] text-[#6b7a6e]">
            Assistant intelligent Maison Fritz
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClear}
            className="rounded border border-[#2a4a3f] px-2.5 py-1 text-[11px] text-[#6b7a6e] transition-colors hover:border-[#9c4a2e] hover:text-[#9c4a2e]"
          >
            Effacer
          </button>
        )}
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[0, 1].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-[#162e28]" />
            ))}
          </div>
        ) : showWelcome ? (
          <div className="flex h-full flex-col items-center justify-center gap-5 px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ad7f34]/20 text-2xl text-[#ad7f34]">
              ✦
            </div>
            <div>
              <h4 className="text-[16px] font-bold text-white">
                Bienvenue sur Fritz IA
              </h4>
              <p className="mt-1.5 max-w-xs text-[13px] text-[#6b7a6e]">
                Votre assistant immobilier intelligent. Posez vos questions sur
                le marché, vos clients ou la gestion de l'agence.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s)}
                  className="rounded-lg border border-[#2a4a3f] px-3 py-2 text-left text-[12px] text-[#9da89e] transition-colors hover:border-[#ad7f34]/50 hover:text-[#c9a15f]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((m) => (
              <CrmMessageBubble
                key={m.id}
                sender={m.role === "assistant" ? "Fritz IA" : "Vous"}
                body={m.body}
                time={m.created_at}
                isAi={m.role === "assistant"}
                isOwn={m.role === "user"}
              />
            ))}
            {sending && (
              <div className="flex items-center gap-2 px-2 py-1">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#ad7f34]" />
                <span className="text-[12px] text-[#6b7a6e]">
                  Fritz IA réfléchit…
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <CrmComposer
        onSend={handleSend}
        placeholder="Posez votre question à Fritz IA…"
        disabled={sending}
      />
    </div>
  );
}
