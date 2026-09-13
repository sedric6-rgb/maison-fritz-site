const GUIDES = [
  {
    title: "Confier son bien à distance : le guide complet",
    text: "Les documents à préparer, les étapes du mandat et ce que vérifie Maison Fritz avant toute mise en location ou en vente.",
  },
  {
    title: "Comprendre les frais d'une vente immobilière au Congo",
    text: "Frais de notaire, commission d'agence, taxes : à quoi s'attendre avant de signer.",
  },
  {
    title: "Louer son bien en toute sécurité",
    text: "Vérification des locataires, rédaction du bail, et ce qui change avec une gestion locative déléguée.",
  },
  {
    title: "Reconnaître un démarcheur non fiable",
    text: "Les signaux d'alerte à connaître avant de confier un bien à un intermédiaire informel.",
  },
];

export default function GuidesPage() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <h1 className="text-4xl">Guides</h1>
        <p className="mt-4 max-w-xl text-ink-soft">
          Des repères pratiques pour investir, vendre ou louer sereinement au Congo.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {GUIDES.map((g) => (
            <div key={g.title} className="border border-line bg-paper p-6">
              <h2 className="text-lg font-semibold">{g.title}</h2>
              <p className="mt-2 text-sm text-ink-soft">{g.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
