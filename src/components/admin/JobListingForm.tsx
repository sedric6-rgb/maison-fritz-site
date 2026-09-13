import type { JobListing } from "@/lib/queries/careers";

export function JobListingForm({
  action,
  job,
}: {
  action: (formData: FormData) => void;
  job?: JobListing;
}) {
  return (
    <form action={action} className="mt-6 grid max-w-2xl gap-5 sm:grid-cols-2">
      {job && <input type="hidden" name="id" value={job.id} />}

      <div className="sm:col-span-2">
        <label className="field-label" htmlFor="title">Intitulé du poste</label>
        <input id="title" name="title" required defaultValue={job?.title} className="field-input" />
      </div>

      <div>
        <label className="field-label" htmlFor="city">Ville</label>
        <input id="city" name="city" defaultValue={job?.city || ""} className="field-input" />
      </div>

      <div>
        <label className="field-label" htmlFor="contract_type">Type de contrat</label>
        <input id="contract_type" name="contract_type" defaultValue={job?.contract_type || ""} className="field-input" placeholder="CDI, indépendant..." />
      </div>

      <div className="sm:col-span-2">
        <label className="field-label" htmlFor="description">Description du poste</label>
        <textarea id="description" name="description" rows={6} defaultValue={job?.description || ""} className="field-input" />
      </div>

      <div className="sm:col-span-2">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_active" defaultChecked={job?.is_active ?? true} /> Offre active (visible sur le site)
        </label>
      </div>

      <div className="sm:col-span-2">
        <button type="submit" className="btn btn-primary">
          {job ? "Enregistrer les modifications" : "Publier l'offre"}
        </button>
      </div>
    </form>
  );
}
