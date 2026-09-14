import type { Client } from "@/lib/queries/crm";
import type { Agent } from "@/lib/queries/agents";

export const STATUS_LABELS: Record<string, string> = {
  nouveau: "Nouveau",
  contacte: "Contacté",
  qualifie: "Qualifié",
  negociation: "En négociation",
  converti: "Converti",
  perdu: "Perdu",
};

export function ClientForm({
  action,
  client,
  agents,
}: {
  action: (formData: FormData) => void;
  client?: Client;
  agents: Agent[];
}) {
  return (
    <form action={action} className="mt-6 grid max-w-2xl gap-5 sm:grid-cols-2">
      {client && <input type="hidden" name="id" value={client.id} />}

      <div className="sm:col-span-2">
        <label className="field-label" htmlFor="full_name">Nom complet</label>
        <input id="full_name" name="full_name" required defaultValue={client?.full_name} className="field-input" />
      </div>

      <div>
        <label className="field-label" htmlFor="phone">Téléphone</label>
        <input id="phone" name="phone" defaultValue={client?.phone || ""} className="field-input" />
      </div>

      <div>
        <label className="field-label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" defaultValue={client?.email || ""} className="field-input" />
      </div>

      <div>
        <label className="field-label" htmlFor="status">Statut</label>
        <select id="status" name="status" defaultValue={client?.status || "nouveau"} className="field-input">
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="field-label" htmlFor="assigned_agent_id">Agent assigné</label>
        <select
          id="assigned_agent_id"
          name="assigned_agent_id"
          defaultValue={client?.assigned_agent_id ?? ""}
          className="field-input"
        >
          <option value="">Aucun</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>{a.full_name}</option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2">
        <label className="field-label" htmlFor="source">Source</label>
        <input
          id="source"
          name="source"
          defaultValue={client?.source || ""}
          className="field-input"
          placeholder="Contact site, bouche-à-oreille, salon..."
        />
      </div>

      <div className="sm:col-span-2">
        <label className="field-label" htmlFor="notes">Notes générales</label>
        <textarea id="notes" name="notes" rows={4} defaultValue={client?.notes || ""} className="field-input" />
      </div>

      <div className="sm:col-span-2">
        <button type="submit" className="btn btn-primary">
          {client ? "Enregistrer les modifications" : "Créer la fiche client"}
        </button>
      </div>
    </form>
  );
}
