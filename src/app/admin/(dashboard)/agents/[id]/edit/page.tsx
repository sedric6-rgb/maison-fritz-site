import { notFound } from "next/navigation";
import { getAgentById } from "@/lib/queries/agents";
import { updateAgentAction } from "@/lib/actions/admin-agents";
import { AgentForm } from "@/components/admin/AgentForm";

export default async function EditAgentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = await getAgentById(Number(id));
  if (!agent) notFound();

  return (
    <div>
      <h1 className="text-3xl">Modifier : {agent.full_name}</h1>
      <AgentForm action={updateAgentAction} agent={agent} />
    </div>
  );
}
