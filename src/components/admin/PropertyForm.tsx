import type { Property } from "@/lib/queries/properties";
import type { Agent } from "@/lib/queries/agents";
import { ImageUploader } from "@/components/admin/ImageUploader";

export function PropertyForm({
  action,
  property,
  photoUrls,
  agents,
}: {
  action: (formData: FormData) => void;
  property?: Property;
  photoUrls?: string[];
  agents: Agent[];
}) {
  return (
    <form action={action} className="mt-6 grid max-w-3xl gap-5 sm:grid-cols-2">
      {property && <input type="hidden" name="id" value={property.id} />}

      <div className="sm:col-span-2">
        <label className="field-label" htmlFor="title">Titre</label>
        <input id="title" name="title" required defaultValue={property?.title} className="field-input" />
      </div>

      <div>
        <label className="field-label" htmlFor="listing_type">Type d&apos;annonce</label>
        <select id="listing_type" name="listing_type" defaultValue={property?.listing_type || "vente"} className="field-input">
          <option value="vente">Vente</option>
          <option value="location">Location</option>
        </select>
      </div>

      <div>
        <label className="field-label" htmlFor="status">Statut</label>
        <select id="status" name="status" defaultValue={property?.status || "disponible"} className="field-input">
          <option value="disponible">Disponible</option>
          <option value="vendu">Vendu</option>
          <option value="loue">Loué</option>
        </select>
      </div>

      <div>
        <label className="field-label" htmlFor="city">Ville</label>
        <input id="city" name="city" required defaultValue={property?.city} className="field-input" />
      </div>

      <div>
        <label className="field-label" htmlFor="neighborhood">Quartier</label>
        <input id="neighborhood" name="neighborhood" defaultValue={property?.neighborhood || ""} className="field-input" />
      </div>

      <div>
        <label className="field-label" htmlFor="price">Prix (FCFA)</label>
        <input id="price" name="price" type="number" required defaultValue={property?.price} className="field-input" />
      </div>

      <div>
        <label className="field-label" htmlFor="agent_id">Agent en charge</label>
        <select id="agent_id" name="agent_id" defaultValue={property?.agent_id ?? ""} className="field-input">
          <option value="">Aucun</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>{a.full_name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="field-label" htmlFor="bedrooms">Chambres</label>
        <input id="bedrooms" name="bedrooms" type="number" defaultValue={property?.bedrooms ?? 0} className="field-input" />
      </div>

      <div>
        <label className="field-label" htmlFor="bathrooms">Salles de bain</label>
        <input id="bathrooms" name="bathrooms" type="number" defaultValue={property?.bathrooms ?? 0} className="field-input" />
      </div>

      <div>
        <label className="field-label" htmlFor="surface_m2">Surface (m²)</label>
        <input id="surface_m2" name="surface_m2" type="number" defaultValue={property?.surface_m2 ?? 0} className="field-input" />
      </div>

      <div className="sm:col-span-2">
        <label className="field-label" htmlFor="video_url">Lien vidéo (YouTube, optionnel)</label>
        <input id="video_url" name="video_url" defaultValue={property?.video_url || ""} className="field-input" />
      </div>

      <div className="sm:col-span-2">
        <label className="field-label" htmlFor="description">Description</label>
        <textarea id="description" name="description" rows={5} defaultValue={property?.description || ""} className="field-input" />
      </div>

      <div className="sm:col-span-2">
        <ImageUploader
          name="photo_urls"
          label="Photos du bien"
          initialUrls={photoUrls}
          multiple
        />
      </div>

      <div className="flex flex-wrap gap-6 sm:col-span-2">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_visible" defaultChecked={property?.is_visible ?? true} /> Afficher cette annonce sur le site
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_exclusive" defaultChecked={property?.is_exclusive} /> Exclusive
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_newly_built" defaultChecked={property?.is_newly_built} /> Newly Built
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_frontline_beach" defaultChecked={property?.is_frontline_beach} /> Frontline Beach
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={property?.featured} /> Propriété vedette (accueil)
        </label>
      </div>

      <div className="sm:col-span-2">
        <button type="submit" className="btn btn-primary">
          {property ? "Enregistrer les modifications" : "Créer la propriété"}
        </button>
      </div>
    </form>
  );
}
