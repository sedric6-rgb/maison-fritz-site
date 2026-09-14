import Link from "next/link";
import Image from "next/image";

const NAV_COLUMN: { href: string; label: string }[] = [
  { href: "/properties", label: "Propriétés" },
  { href: "/#collections", label: "Collections" },
  { href: "/team", label: "Équipe" },
  { href: "/about", label: "À propos" },
  { href: "/guides", label: "Guides" },
  { href: "/blog", label: "Blog" },
  { href: "/careers", label: "Carrières" },
  { href: "/contact", label: "Contact" },
  { href: "/about#sell-with-us", label: "Confier un bien" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="wrap grid gap-12 py-16 sm:grid-cols-3">
        <div>
          <Image
            src="/logo/maison-fritz-logo.png"
            alt="Maison Fritz — Agence immobilière"
            width={293}
            height={100}
            className="h-10 w-auto"
          />
          <p className="mt-4 max-w-xs text-sm text-ink-soft">
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
          <a href="tel:+242060000000" className="mt-2 block hover:text-forest-deep">+242 06 000 00 00</a>
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
