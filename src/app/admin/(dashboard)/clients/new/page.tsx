import { listAgents } from "@/lib/queries/agents";
import { createClientAction } from "@/lib/actions/admin-clients";
import { ClientForm } from "@/components/admin/ClientForm";

export default async function NewClientPage() {
  const agents = await listAgents();

  return (
    <div>
      <h1 className="text-3xl">Nouveau client</h1>
      <ClientForm action={createClientAction} agents={agents} />
    </div>
  );
}
