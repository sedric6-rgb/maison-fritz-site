import { notFound } from "next/navigation";
import { getJobListingBySlug } from "@/lib/queries/careers";
import { submitJobApplication } from "@/lib/actions/leads";

export const revalidate = 0;

export default async function JobDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { slug } = await params;
  const { sent, error } = await searchParams;
  const job = await getJobListingBySlug(slug);
  if (!job) notFound();

  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <h1 className="text-4xl">{job.title}</h1>
        <p className="mt-2 text-ink-soft">
          {[job.city, job.contract_type].filter(Boolean).join(" · ")}
        </p>
        {job.description && (
          <div className="mt-8 whitespace-pre-line text-ink-soft">{job.description}</div>
        )}

        <div className="mt-12 border-t border-line pt-10">
          <h2 className="text-2xl">Postuler</h2>

          {sent ? (
            <p className="mt-6 max-w-md rounded-sm bg-forest/10 p-4 text-sm text-forest-deep">
              Votre candidature a bien été envoyée. Nous revenons vers vous rapidement.
            </p>
          ) : (
            <form action={submitJobApplication} className="mt-6 grid max-w-xl gap-4 sm:grid-cols-2">
              <input type="hidden" name="job_id" value={job.id} />
              <input type="hidden" name="job_slug" value={job.slug} />
              {error && (
                <p className="sm:col-span-2 text-sm text-terracotta">
                  Merci d&apos;indiquer votre nom et un téléphone ou un email.
                </p>
              )}
              <div>
                <label className="field-label" htmlFor="name">Nom</label>
                <input id="name" name="name" required className="field-input" />
              </div>
              <div>
                <label className="field-label" htmlFor="phone">Téléphone</label>
                <input id="phone" name="phone" className="field-input" />
              </div>
              <div>
                <label className="field-label" htmlFor="email">Email</label>
                <input id="email" name="email" type="email" className="field-input" />
              </div>
              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="message">Message / motivation</label>
                <textarea id="message" name="message" rows={4} className="field-input" />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className="btn btn-primary">Envoyer ma candidature</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
