import Link from "next/link";
import { listJobListings } from "@/lib/queries/careers";

export const revalidate = 0;

export default async function CareersPage() {
  const jobs = await listJobListings();

  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <h1 className="text-4xl">Careers</h1>
        <p className="mt-4 text-ink-soft">Rejoignez l&apos;équipe Maison Fritz.</p>
        {jobs.length === 0 ? (
          <p className="mt-16 text-center text-ink-soft">Aucune offre ouverte pour le moment.</p>
        ) : (
          <div className="mt-10 divide-y divide-line border-y border-line">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/careers/${job.slug}`}
                className="flex items-center justify-between py-6 hover:bg-paper"
              >
                <div>
                  <h2 className="text-lg font-semibold">{job.title}</h2>
                  <p className="mt-1 text-sm text-ink-soft">
                    {[job.city, job.contract_type].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <span className="text-sm text-forest-deep underline">Voir l&apos;offre</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
