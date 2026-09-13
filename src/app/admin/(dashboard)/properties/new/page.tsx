import { listAgents } from "@/lib/queries/agents";
import { createPropertyAction } from "@/lib/actions/admin-properties";
import { PropertyForm } from "@/components/admin/PropertyForm";

export default async function NewPropertyPage() {
  const agents = await listAgents();
  return (
    <div>
      <h1 className="text-3xl">Nouvelle propriété</h1>
      <PropertyForm action={createPropertyAction} agents={agents} />
    </div>
  );
}
