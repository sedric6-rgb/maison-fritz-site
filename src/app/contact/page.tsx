import { submitContactForm } from "@/lib/actions/leads";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { sent, error } = await searchParams;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-2xl px-6 sm:px-8">
        <h1 className="text-4xl">Contact</h1>
        <p className="mt-4 text-ink-soft">
          Une question, un bien à confier, un projet d&apos;achat ? Écrivez-nous.
        </p>

        {sent ? (
          <p className="mt-8 rounded-sm bg-forest/10 p-4 text-sm text-forest-deep">
            Votre message a bien été envoyé. Nous vous répondons rapidement.
          </p>
        ) : (
          <form action={submitContactForm} className="mt-8 flex flex-col gap-4">
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
    </section>
  );
}
