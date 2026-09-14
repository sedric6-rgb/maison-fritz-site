import { submitContactForm } from "@/lib/actions/leads";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { sent, error } = await searchParams;

  return (
    <section className="py-16 sm:py-20">
      <div className="wrap grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <p className="eyebrow">Parlons-en</p>
          <h1 className="mt-4">Contact</h1>
          <p className="mt-5 max-w-sm text-ink-soft">
            Une question, un bien à confier, un projet d&apos;achat ? Écrivez-nous, un membre
            de l&apos;équipe vous répond rapidement.
          </p>
          <div className="mt-10 space-y-1 text-sm text-ink-soft">
            <p className="text-ink">Pointe-Noire · Brazzaville · Congo</p>
            <a href="mailto:contact@maisonfritz.com" className="text-forest-deep underline">
              contact@maisonfritz.com
            </a>
          </div>
        </div>

        <div>
          {sent ? (
            <p className="border border-line bg-forest/10 p-6 text-sm text-forest-deep">
              Votre message a bien été envoyé. Nous vous répondons rapidement.
            </p>
          ) : (
            <form action={submitContactForm} className="flex flex-col gap-5">
              {error && (
                <p className="text-sm text-terracotta">
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
              <div>
                <label className="field-label" htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={5} className="field-input" />
              </div>
              <div>
                <button type="submit" className="btn btn-primary">Envoyer</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
