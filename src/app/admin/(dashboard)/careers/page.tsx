import Link from "next/link";
import { listJobListings } from "@/lib/queries/careers";
import { deleteJobListingAction } from "@/lib/actions/admin-careers";

export const revalidate = 0;

export default async function AdminCareersPage() {
  const jobs = await listJobListings(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Offres d&apos;emploi</h1>
        <Link href="/admin/careers/new" className="btn btn-primary">
          + Nouvelle offre
        </Link>
      </div>

      <div className="mt-8 divide-y divide-line border-y border-line">
        {jobs.map((j) => (
          <div key={j.id} className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="font-semibold">{j.title}</p>
              <p className="text-sm text-ink-soft">
                {[j.city, j.contract_type].filter(Boolean).join(" · ")} · {j.is_active ? "Active" : "Masquée"}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-4 text-sm">
              <Link href={`/admin/careers/${j.id}/edit`} className="text-forest-deep underline">
                Modifier
              </Link>
              <form action={deleteJobListingAction}>
                <input type="hidden" name="id" value={j.id} />
                <button type="submit" className="text-terracotta underline">
                  Supprimer
                </button>
              </form>
            </div>
          </div>
        ))}
        {jobs.length === 0 && (
          <p className="py-8 text-center text-ink-soft">Aucune offre pour le moment.</p>
        )}
      </div>
    </div>
  );
}
