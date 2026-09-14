import { notFound } from "next/navigation";
import {
  getClientById,
  listClientActivities,
  listClientFollowups,
} from "@/lib/queries/crm";
import { listAgents } from "@/lib/queries/agents";
import {
  updateClientAction,
  deleteClientAction,
  addActivityAction,
  addFollowupAction,
  toggleFollowupDoneAction,
  deleteFollowupAction,
} from "@/lib/actions/admin-clients";
import { ClientForm } from "@/components/admin/ClientForm";
import { formatDate, isOverdue } from "@/lib/format";

export const revalidate = 0;

const ACTIVITY_LABELS: Record<string, string> = {
  note: "Note",
  appel: "Appel",
  email: "Email",
  rdv: "Rendez-vous",
  autre: "Autre",
};

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const clientId = Number(id);
  const [client, agents, activities, followups] = await Promise.all([
    getClientById(clientId),
    listAgents(),
    listClientActivities(clientId),
    listClientFollowups(clientId),
  ]);
  if (!client) notFound();

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">{client.full_name}</h1>
        <form action={deleteClientAction}>
          <input type="hidden" name="id" value={client.id} />
          <button type="submit" className="text-sm text-terracotta underline">
            Supprimer ce client
          </button>
        </form>
      </div>

      <ClientForm action={updateClientAction} client={client} agents={agents} />

      {/* Relances */}
      <div className="mt-14 hairline pt-10">
        <h2 className="text-2xl">Relances</h2>

        <div className="mt-6 divide-y divide-line">
          {followups.map((f) => {
            const overdue = !f.is_done && isOverdue(f.due_date);
            return (
              <div key={f.id} className="flex items-center justify-between gap-4 py-3">
                <div className="flex items-center gap-3">
                  <form action={toggleFollowupDoneAction}>
                    <input type="hidden" name="id" value={f.id} />
                    <input type="hidden" name="client_id" value={client.id} />
                    <input type="hidden" name="done" value={f.is_done ? "" : "on"} />
                    <button
                      type="submit"
                      aria-label={f.is_done ? "Marquer non faite" : "Marquer faite"}
                      className={`h-5 w-5 border ${
                        f.is_done ? "border-forest bg-forest" : "border-line"
                      }`}
                    />
                  </form>
                  <div>
                    <p className={f.is_done ? "text-ink-soft line-through" : ""}>
                      {f.note || "Relance"}
                    </p>
                    <p className={`text-sm ${overdue ? "text-terracotta" : "text-ink-soft"}`}>
                      {formatDate(f.due_date)}
                      {overdue ? " — en retard" : ""}
                    </p>
                  </div>
                </div>
                <form action={deleteFollowupAction}>
                  <input type="hidden" name="id" value={f.id} />
                  <input type="hidden" name="client_id" value={client.id} />
                  <button type="submit" className="text-sm text-terracotta underline">
                    Supprimer
                  </button>
                </form>
              </div>
            );
          })}
          {followups.length === 0 && (
            <p className="py-4 text-sm text-ink-soft">Aucune relance programmée.</p>
          )}
        </div>

        <form action={addFollowupAction} className="mt-6 flex flex-wrap items-end gap-4">
          <input type="hidden" name="client_id" value={client.id} />
          <div>
            <label className="field-label" htmlFor="due_date">Date</label>
            <input id="due_date" name="due_date" type="date" required className="field-input" />
          </div>
          <div className="flex-1 min-w-[220px]">
            <label className="field-label" htmlFor="followup-note">Note</label>
            <input id="followup-note" name="note" className="field-input" placeholder="Rappeler pour la visite" />
          </div>
          <button type="submit" className="btn btn-primary">Programmer</button>
        </form>
      </div>

      {/* Historique / activités */}
      <div className="mt-14 hairline pt-10">
        <h2 className="text-2xl">Historique</h2>

        <div className="mt-6 space-y-5">
          {activities.map((a) => (
            <div key={a.id} className="border-l-2 border-ochre pl-4">
              <p className="text-sm text-ink-soft">
                {ACTIVITY_LABELS[a.type] || a.type} — {formatDate(a.created_at)}
              </p>
              <p className="mt-1 whitespace-pre-line">{a.content}</p>
            </div>
          ))}
          {activities.length === 0 && (
            <p className="text-sm text-ink-soft">Aucune activité enregistrée pour le moment.</p>
          )}
        </div>

        <form action={addActivityAction} className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end">
          <input type="hidden" name="client_id" value={client.id} />
          <div>
            <label className="field-label" htmlFor="type">Type</label>
            <select id="type" name="type" defaultValue="note" className="field-input">
              <option value="note">Note</option>
              <option value="appel">Appel</option>
              <option value="email">Email</option>
              <option value="rdv">Rendez-vous</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="field-label" htmlFor="content">Détail</label>
            <input id="content" name="content" required className="field-input" placeholder="A visité la villa côte sauvage, très intéressé" />
          </div>
          <button type="submit" className="btn btn-primary">Ajouter</button>
        </form>
      </div>
    </div>
  );
}
