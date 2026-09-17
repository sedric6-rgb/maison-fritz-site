"use client";

import { useState, useEffect } from "react";
import CrmSidebar, { type Channel } from "@/components/crm-hub/CrmSidebar";
import CrmChannelClients from "@/components/crm-hub/CrmChannelClients";
import CrmChannelLeads from "@/components/crm-hub/CrmChannelLeads";
import CrmChannelTeam from "@/components/crm-hub/CrmChannelTeam";
import CrmChannelFollowups from "@/components/crm-hub/CrmChannelFollowups";
import CrmChannelProperties from "@/components/crm-hub/CrmChannelProperties";
import CrmChannelAi from "@/components/crm-hub/CrmChannelAi";

export default function CrmHubPage() {
  const [channel, setChannel] = useState<Channel>("clients");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingLeads, setPendingLeads] = useState(0);

  useEffect(() => {
    fetch("/api/crm/stats")
      .then((r) => r.json())
      .then((data) => setPendingLeads(data.pendingLeads || 0))
      .catch(() => {});
  }, []);

  const renderChannel = () => {
    switch (channel) {
      case "clients":
        return <CrmChannelClients />;
      case "leads":
        return <CrmChannelLeads />;
      case "equipe":
        return <CrmChannelTeam />;
      case "relances":
        return <CrmChannelFollowups />;
      case "biens":
        return <CrmChannelProperties />;
      case "assistant":
        return <CrmChannelAi />;
      default:
        return <CrmChannelClients />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0a1a15]">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <CrmSidebar
          active={channel}
          onSelect={setChannel}
          pendingLeads={pendingLeads}
        />
      </div>

      {/* Mobile overlay sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 flex md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <CrmSidebar
              active={channel}
              onSelect={setChannel}
              onClose={() => setSidebarOpen(false)}
              pendingLeads={pendingLeads}
            />
          </div>
          <div className="flex-1 bg-black/60" />
        </div>
      )}

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col bg-[#0a1a15]">
        {/* Mobile header */}
        <div className="flex items-center gap-3 border-b border-[#2a4a3f] bg-[#0e211c] px-4 py-3 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1e3b34] text-white"
            aria-label="Menu"
          >
            ☰
          </button>
          <h1 className="font-display flex-1 text-center text-[15px] font-semibold text-white">
            Maison <span className="text-[#ad7f34]">Fritz</span> CRM
          </h1>
          <a
            href="/admin"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1e3b34] text-[13px] text-[#9da89e]"
            aria-label="Retour admin"
          >
            ✕
          </a>
        </div>

        {/* Channel content */}
        <div className="flex-1 overflow-hidden">{renderChannel()}</div>
      </div>
    </div>
  );
}
