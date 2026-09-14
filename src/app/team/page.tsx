import { listAgents } from "@/lib/queries/agents";
import { AgentCard } from "@/components/AgentCard";

export const revalidate = 0;

export default async function TeamPage() {
  const agents = await listAgents();

  return (
    <section className="py-16 sm:py-20">
      <div className="wrap">
        <p className="eyebrow">L&apos;équipe</p>
        <h1 className="mt-4">Notre équipe</h1>
        <p className="mt-4 max-w-lg text-ink-soft">
          Des agents formés au réseau Maison Fritz, présents à Pointe-Noire et Brazzaville.
        </p>
        {agents.length === 0 ? (
          <p className="mt-20 text-center text-ink-soft">L&apos;équipe sera bientôt présentée ici.</p>
        ) : (
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
