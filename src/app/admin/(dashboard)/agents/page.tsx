import Link from "next/link";
import { listAgents } from "@/lib/queries/agents";
import { deleteAgentAction } from "@/lib/actions/admin-agents";

export const revalidate = 0;

export default async function AdminAgentsPage() {
  const agents = await listAgents();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Agents</h1>
        <Link href="/admin/agents/new" className="btn btn-primary">
          + Nouvel agent
        </Link>
      </div>

      <div className="mt-8 divide-y divide-line border-y border-line">
        {agents.map((a) => (
          <div key={a.id} className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="font-semibold">{a.full_name}</p>
              <p className="text-sm text-ink-soft">{a.role}</p>
            </div>
            <div className="flex shrink-0 items-center gap-4 text-sm">
              <Link href={`/admin/agents/${a.id}/edit`} className="text-forest-deep underline">
                Modifier
              </Link>
              <form action={deleteAgentAction}>
                <input type="hidden" name="id" value={a.id} />
                <button type="submit" className="text-terracotta underline">
                  Supprimer
                </button>
              </form>
            </div>
          </div>
        ))}
        {agents.length === 0 && (
          <p className="py-8 text-center text-ink-soft">Aucun agent pour le moment.</p>
        )}
      </div>
    </div>
  );
}
