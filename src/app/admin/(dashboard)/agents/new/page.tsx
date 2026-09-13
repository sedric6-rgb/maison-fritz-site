import { createAgentAction } from "@/lib/actions/admin-agents";
import { AgentForm } from "@/components/admin/AgentForm";

export default function NewAgentPage() {
  return (
    <div>
      <h1 className="text-3xl">Nouvel agent</h1>
      <AgentForm action={createAgentAction} />
    </div>
  );
}
