import type { Agent } from "@/lib/queries/agents";
import { ImageUploader } from "@/components/admin/ImageUploader";

export function AgentForm({
  action,
  agent,
}: {
  action: (formData: FormData) => void;
  agent?: Agent;
}) {
  return (
    <form action={action} className="mt-6 grid max-w-2xl gap-5 sm:grid-cols-2">
      {agent && <input type="hidden" name="id" value={agent.id} />}

      <div className="sm:col-span-2">
        <label className="field-label" htmlFor="full_name">Nom complet</label>
        <input id="full_name" name="full_name" required defaultValue={agent?.full_name} className="field-input" />
      </div>

      <div>
        <label className="field-label" htmlFor="role">Rôle</label>
        <input id="role" name="role" required defaultValue={agent?.role} className="field-input" placeholder="Agent immobilier" />
      </div>

      <div>
        <label className="field-label" htmlFor="city">Ville</label>
        <input id="city" name="city" defaultValue={agent?.city || ""} className="field-input" />
      </div>

      <div>
        <label className="field-label" htmlFor="phone">Téléphone</label>
        <input id="phone" name="phone" defaultValue={agent?.phone || ""} className="field-input" />
      </div>

      <div>
        <label className="field-label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" defaultValue={agent?.email || ""} className="field-input" />
      </div>

      <div className="sm:col-span-2">
        <ImageUploader
          name="photo_url"
          label="Photo de l’agent"
          initialUrls={agent?.photo_url ? [agent.photo_url] : []}
          aspectRatio={3 / 4}
        />
      </div>

      <div className="sm:col-span-2">
        <label className="field-label" htmlFor="bio">Présentation</label>
        <textarea id="bio" name="bio" rows={4} defaultValue={agent?.bio || ""} className="field-input" />
      </div>

      <div className="sm:col-span-2">
        <button type="submit" className="btn btn-primary">
          {agent ? "Enregistrer les modifications" : "Créer l'agent"}
        </button>
      </div>
    </form>
  );
}
