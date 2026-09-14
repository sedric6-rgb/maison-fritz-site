import Link from "next/link";
import type { Agent } from "@/lib/queries/agents";

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <Link href={`/team/${agent.slug}`} className="group block">
      <div className="aspect-[4/5] w-full overflow-hidden bg-bg-alt">
        {agent.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={agent.photo_url} alt={agent.full_name} className="img-cover img-zoom" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-ink-faint">
            Photo à venir
          </div>
        )}
      </div>
      <div className="pt-4">
        <h3 className="text-lg">{agent.full_name}</h3>
        <p className="mt-1 text-sm text-ochre">{agent.role}</p>
        {agent.city && <p className="mt-1 text-sm text-ink-soft">{agent.city}</p>}
      </div>
    </Link>
  );
}
