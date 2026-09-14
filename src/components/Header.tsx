"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/properties", label: "Propriétés" },
  { href: "/#collections", label: "Collections" },
  { href: "/guides", label: "Guides" },
  { href: "/team", label: "Équipe" },
  { href: "/blog", label: "Blog" },
  { href: "/careers", label: "Carrières" },
  { href: "/about#sell-with-us", label: "Confier un bien" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/95 backdrop-blur">
      <div className="wrap flex items-center justify-between py-4">
        <Link href="/" className="shrink-0">
          <Image
            src="/logo/maison-fritz-logo.png"
            alt="Maison Fritz — Agence immobilière"
            width={293}
            height={100}
            priority
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        <nav className="hidden items-center gap-8 text-[0.95rem] text-ink-soft lg:flex">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={`${link.href}-${i}`}
              href={link.href}
              className="transition-colors hover:text-forest-deep"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link href="/contact" className="btn btn-primary">
            Nous contacter
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
        >
          <span
            className={`h-px w-6 bg-forest-deep transition-transform ${open ? "translate-y-[6px] rotate-45" : ""}`}
          />
          <span className={`h-px w-6 bg-forest-deep transition-opacity ${open ? "opacity-0" : ""}`} />
          <span
            className={`h-px w-6 bg-forest-deep transition-transform ${open ? "-translate-y-[6px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-bg lg:hidden">
          <nav className="wrap flex flex-col gap-1 py-6 text-lg">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={`${link.href}-${i}`}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-line-soft py-3 font-display text-forest-deep"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="btn btn-primary mt-6 w-full justify-center"
            >
              Nous contacter
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
