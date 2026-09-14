import Link from "next/link";

const NAV_COLUMN: { href: string; label: string }[] = [
  { href: "/properties", label: "Propriétés" },
  { href: "/team", label: "Team" },
  { href: "/about", label: "À propos" },
  { href: "/guides", label: "Guides" },
  { href: "/blog", label: "Blog" },
  { href: "/careers", label: "Carrières" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="wrap grid gap-12 py-16 sm:grid-cols-3">
        <div>
          <div className="font-display text-xl text-forest-deep">
            Maison <span className="text-ochre">Fritz</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-ink-soft">
            Immobilier premium au Congo — vente, location et gestion locative, pour les
            propriétaires du pays comme de la diaspora.
          </p>
        </div>

        <nav className="flex flex-col gap-2 text-sm text-ink-soft sm:mx-auto">
          {NAV_COLUMN.map((link) => (
            <Link key={link.href} href={link.href} className="w-fit hover:text-forest-deep">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="text-sm text-ink-soft sm:justify-self-end">
          <p className="text-ink">Pointe-Noire · Brazzaville · Congo</p>
          <a href="mailto:contact@maisonfritz.com" className="mt-2 block text-forest-deep underline">
            contact@maisonfritz.com
          </a>
          <Link href="/about#sell-with-us" className="mt-4 block hover:text-forest-deep">
            Rejoindre le réseau
          </Link>
        </div>
      </div>
      <div className="hairline">
        <div className="wrap flex flex-col gap-2 py-6 text-xs text-ink-faint sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Maison Fritz. Tous droits réservés.</span>
          <span>Agence immobilière — Pointe-Noire &amp; Brazzaville</span>
        </div>
      </div>
    </footer>
  );
}
