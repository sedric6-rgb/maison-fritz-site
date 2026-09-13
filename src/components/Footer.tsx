import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line py-12">
      <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-8 px-6 sm:px-8">
        <div>
          <div className="font-display text-lg font-semibold text-forest-deep">
            Maison <span className="text-ochre">Fritz</span>
          </div>
          <p className="mt-2 max-w-sm text-sm text-ink-soft">
            Franchise d&apos;agences immobilières — Pointe-Noire &amp; Brazzaville, Congo.
          </p>
        </div>
        <nav className="flex flex-col gap-2 text-sm text-ink-soft">
          <Link href="/properties" className="hover:text-forest-deep">Properties</Link>
          <Link href="/team" className="hover:text-forest-deep">Team</Link>
          <Link href="/about" className="hover:text-forest-deep">About</Link>
          <Link href="/careers" className="hover:text-forest-deep">Careers</Link>
        </nav>
        <div className="text-sm text-ink-soft">
          <p>Pour confier un bien ou rejoindre le réseau :</p>
          <a href="mailto:contact@maisonfritz.com" className="text-forest-deep underline">
            contact@maisonfritz.com
          </a>
        </div>
      </div>
    </footer>
  );
}
