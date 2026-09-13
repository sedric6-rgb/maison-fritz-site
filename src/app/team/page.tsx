import { listAgents } from "@/lib/queries/agents";
import { AgentCard } from "@/components/AgentCard";

export const revalidate = 0;

export default async function TeamPage() {
  const agents = await listAgents();

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <h1 className="text-4xl">Notre équipe</h1>
        <p className="mt-4 max-w-xl text-ink-soft">
          Des agents formés au réseau Maison Fritz, présents à Pointe-Noire et Brazzaville.
        </p>
        {agents.length === 0 ? (
          <p className="mt-16 text-center text-ink-soft">L&apos;équipe sera bientôt présentée ici.</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
