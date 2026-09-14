import Link from "next/link";
import { listJobListings } from "@/lib/queries/careers";

export const revalidate = 0;

export default async function CareersPage() {
  const jobs = await listJobListings();

  return (
    <section className="py-16 sm:py-20">
      <div className="wrap-text">
        <p className="eyebrow">Nous rejoindre</p>
        <h1 className="mt-4">Carrières</h1>
        <p className="mt-4 text-ink-soft">Rejoignez l&apos;équipe Maison Fritz.</p>
        {jobs.length === 0 ? (
          <p className="mt-20 text-center text-ink-soft">Aucune offre ouverte pour le moment.</p>
        ) : (
          <div className="mt-14 divide-y divide-line hairline border-b border-line">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/careers/${job.slug}`}
                className="flex items-center justify-between gap-6 py-7 transition-colors hover:bg-paper"
              >
                <div>
                  <h2 className="text-xl">{job.title}</h2>
                  <p className="mt-1 text-sm text-ink-soft">
                    {[job.city, job.contract_type].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <span className="shrink-0 text-sm text-forest-deep underline underline-offset-4">Voir l&apos;offre</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
