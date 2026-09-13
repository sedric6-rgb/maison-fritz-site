import Link from "next/link";
import type { Agent } from "@/lib/queries/agents";

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <Link
      href={`/team/${agent.slug}`}
      className="group block overflow-hidden rounded-sm border border-line bg-paper"
    >
      <div className="aspect-square w-full overflow-hidden bg-bg-alt">
        {agent.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={agent.photo_url}
            alt={agent.full_name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-ink-soft">
            Pas de photo
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold">{agent.full_name}</h3>
        <p className="mt-1 text-sm text-ochre">{agent.role}</p>
        {agent.city && <p className="mt-1 text-sm text-ink-soft">{agent.city}</p>}
      </div>
    </Link>
  );
}
