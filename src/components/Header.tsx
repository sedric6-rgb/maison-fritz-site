import Link from "next/link";

const NAV_LINKS = [
  { href: "/properties", label: "Properties" },
  { href: "/team", label: "Team" },
  { href: "/about", label: "About" },
  { href: "/guides", label: "Guides" },
  { href: "/blog", label: "Blog" },
  { href: "/careers", label: "Careers" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
        <Link href="/" className="font-display text-xl font-semibold text-forest-deep">
          Maison <span className="text-ochre">Fritz</span>
        </Link>
        <nav className="hidden gap-7 text-sm text-ink-soft lg:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-forest-deep">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/contact" className="btn btn-primary">
          Nous contacter
        </Link>
      </div>
    </header>
  );
}
