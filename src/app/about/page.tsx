import { submitSellWithUs } from "@/lib/actions/leads";

const SECTIONS = [
  { id: "mission", label: "Mission" },
  { id: "vision", label: "Vision" },
  { id: "valeurs", label: "Valeurs" },
  { id: "ceo", label: "CEO" },
  { id: "marketing", label: "Marketing" },
  { id: "histoire", label: "Histoire" },
  { id: "faq", label: "FAQ" },
  { id: "hq", label: "HQ" },
  { id: "sell-with-us", label: "Sell with us" },
];

const FAQ = [
  {
    q: "Comment sont sécurisés les fonds lors d'une vente ?",
    a: "Les fonds transitent par le compte séquestre du notaire jusqu'à la signature de l'acte définitif, jamais directement par l'agence.",
  },
  {
    q: "Puis-je confier mon bien à distance, depuis l'étranger ?",
    a: "Oui, c'est le cœur de notre offre : mandat signé électroniquement, reporting régulier et un seul interlocuteur dédié.",
  },
  {
    q: "Quelles villes couvrez-vous ?",
    a: "Pointe-Noire et Brazzaville pour la phase 1, avec une extension progressive prévue vers d'autres villes du Congo.",
  },
  {
    q: "Facturez-vous des frais de visite aux locataires ?",
    a: "Non. Les visites restent gratuites pour les personnes qui recherchent un logement.",
  },
];

export default async function AboutPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { sent, error } = await searchParams;

  return (
    <section className="py-16 sm:py-20">
      <div className="wrap-text">
        <p className="eyebrow">Maison Fritz</p>
        <h1 className="mt-4">À propos</h1>

        <nav className="mt-10 flex flex-wrap gap-x-7 gap-y-2 hairline border-b border-line pb-7 text-sm text-ink-soft">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="hover:text-forest-deep">
              {s.label}
            </a>
          ))}
        </nav>

        <div className="mt-16 space-y-20">
          <div id="mission" className="scroll-mt-24">
            <h2>Mission</h2>
            <p className="mt-5 text-ink-soft">
              Permettre à toute personne, où qu&apos;elle se trouve, de faire fructifier un bien
              immobilier au Congo en toute confiance — grâce à des mandats sécurisés
              juridiquement et un suivi transparent, sans avoir à être physiquement présente.
            </p>
          </div>

          <div id="vision" className="scroll-mt-24">
            <h2>Vision</h2>
            <p className="mt-5 text-ink-soft">
              Devenir le réseau d&apos;agences immobilières de référence au Congo, reconnu pour
              son sérieux par la diaspora comme par les investisseurs locaux.
            </p>
          </div>

          <div id="valeurs" className="scroll-mt-24">
            <h2>Valeurs</h2>
            <ul className="mt-6 grid gap-4 text-ink-soft sm:grid-cols-2">
              <li className="border-l-2 border-ochre pl-4">Transparence sur les mandats et les frais</li>
              <li className="border-l-2 border-ochre pl-4">Rigueur juridique à chaque étape</li>
              <li className="border-l-2 border-ochre pl-4">Un seul interlocuteur, du début à la fin</li>
              <li className="border-l-2 border-ochre pl-4">Respect des locataires comme des propriétaires</li>
            </ul>
          </div>

          <div id="ceo" className="scroll-mt-24">
            <h2>CEO</h2>
            <p className="mt-5 text-ink-soft">
              Maison Fritz est fondée et dirigée par Fritz Mambouka, entrepreneur dans
              l&apos;immobilier et la construction au Congo et au Gabon.
            </p>
          </div>

          <div id="marketing" className="scroll-mt-24">
            <h2>Marketing</h2>
            <p className="mt-5 text-ink-soft">
              Le réseau Maison Fritz s&apos;appuie sur une présence digitale forte et sur le
              bouche-à-oreille de sa communauté de propriétaires et d&apos;investisseurs, en
              particulier au sein de la diaspora congolaise.
            </p>
          </div>

          <div id="histoire" className="scroll-mt-24">
            <h2>Histoire</h2>
            <p className="mt-5 text-ink-soft">
              Né d&apos;un constat simple — investir à distance dans l&apos;immobilier au Congo
              restait risqué faute de relais fiable — Maison Fritz se lance en phase 1 en
              novembre 2026 à Pointe-Noire et Brazzaville, avec un modèle de franchise inspiré
              des grands réseaux internationaux.
            </p>
          </div>

          <div id="faq" className="scroll-mt-24">
            <h2>FAQ</h2>
            <div className="mt-7 divide-y divide-line">
              {FAQ.map((item) => (
                <div key={item.q} className="py-5">
                  <p className="font-display text-lg text-forest-deep">{item.q}</p>
                  <p className="mt-2 text-sm text-ink-soft">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="hq" className="scroll-mt-24">
            <h2>HQ</h2>
            <p className="mt-5 text-ink-soft">
              Siège social à Pointe-Noire, Congo — bureau secondaire à Brazzaville.
            </p>
          </div>

          <div id="sell-with-us" className="scroll-mt-24 border border-line bg-paper p-8 sm:p-10">
            <h2>Sell with us</h2>
            <p className="mt-5 max-w-xl text-ink-soft">
              Vous souhaitez vendre, louer ou faire gérer votre propriété ? Confiez-nous votre
              bien pour une estimation confidentielle, une présentation soignée et un suivi
              transparent jusqu&apos;à la signature.
            </p>

            {sent ? (
              <p className="mt-7 max-w-md bg-forest/10 p-4 text-sm text-forest-deep">
                Votre demande a bien été envoyée. Nous revenons vers vous rapidement.
              </p>
            ) : (
              <form action={submitSellWithUs} className="mt-7 grid max-w-xl gap-4 sm:grid-cols-2">
                {error && (
                  <p className="sm:col-span-2 text-sm text-terracotta">
                    Merci d&apos;indiquer votre nom et un téléphone ou un email.
                  </p>
                )}
                <div>
                  <label className="field-label" htmlFor="sw-name">Nom</label>
                  <input id="sw-name" name="name" required className="field-input" />
                </div>
                <div>
                  <label className="field-label" htmlFor="sw-phone">Téléphone</label>
                  <input id="sw-phone" name="phone" className="field-input" />
                </div>
                <div>
                  <label className="field-label" htmlFor="sw-email">Email</label>
                  <input id="sw-email" name="email" type="email" className="field-input" />
                </div>
                <div className="sm:col-span-2">
                  <label className="field-label" htmlFor="sw-message">Parlez-nous de votre bien</label>
                  <textarea id="sw-message" name="message" rows={3} className="field-input" />
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" className="btn btn-primary">Demander une estimation</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
