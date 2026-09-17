"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import CrmMessageBubble from "./CrmMessageBubble";
import CrmComposer from "./CrmComposer";

type TeamMessage = {
  id: number;
  sender_name: string;
  body: string;
  created_at: string;
};

export default function CrmChannelTeam() {
  const [messages, setMessages] = useState<TeamMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/crm/team-messages");
      if (!res.ok) return;
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch {}
  }, []);

  useEffect(() => {
    fetchMessages().finally(() => setLoading(false));
    const interval = setInterval(fetchMessages, 8000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    const optimistic: TeamMessage = {
      id: Date.now(),
      sender_name: "Admin",
      body: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      await fetch("/api/crm/team-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderName: "Admin", body: text }),
      });
      fetchMessages();
    } catch {}
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#2a4a3f] px-5 pt-4 pb-3">
        <h3 className="text-lg font-bold text-white"># Équipe</h3>
        <p className="mt-1 text-[12px] text-[#6b7a6e]">
          Messagerie interne de l'agence
        </p>
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-[#162e28]" />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-[13px] text-[#6b7a6e]">
              Aucun message. Commencez la conversation !
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((m) => (
              <CrmMessageBubble
                key={m.id}
                sender={m.sender_name}
                body={m.body}
                time={m.created_at}
                isOwn={m.sender_name === "Admin"}
              />
            ))}
          </div>
        )}
      </div>

      <CrmComposer onSend={handleSend} placeholder="Message à l'équipe…" />
    </div>
  );
}
