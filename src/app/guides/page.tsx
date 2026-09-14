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
    <section className="py-16 sm:py-20">
      <div className="wrap">
        <p className="eyebrow">Ressources</p>
        <h1 className="mt-4">Guides</h1>
        <p className="mt-4 max-w-lg text-ink-soft">
          Des repères pratiques pour investir, vendre ou louer sereinement au Congo.
        </p>
        <div className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2">
          {GUIDES.map((g) => (
            <div key={g.title} className="border-t border-forest pt-6">
              <h3>{g.title}</h3>
              <p className="mt-3 text-sm text-ink-soft">{g.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
