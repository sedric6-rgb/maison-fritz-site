import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth";

// Empêche Next.js de tenter de pré-générer les pages admin au moment du
// build (elles nécessitent une session valide et des données à jour).
export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/crm-hub", label: "CRM Hub", accent: true },
  { href: "/admin/properties", label: "Propriétés" },
  { href: "/admin/agents", label: "Agents" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/careers", label: "Offres d'emploi" },
  { href: "/admin/leads", label: "Demandes reçues" },
  { href: "/admin/clients", label: "Clients (CRM)" },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-8 md:flex-row md:gap-10 md:py-10">
      <aside className="w-full shrink-0 md:w-56">
        <div className="font-display text-lg font-semibold text-forest-deep">
          Maison <span className="text-ochre">Fritz</span>
        </div>
        <p className="mb-6 text-xs text-ink-soft">Espace admin</p>
        <nav className="flex flex-wrap gap-1 text-sm md:flex-col">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-sm px-3 py-2 ${
                "accent" in item && item.accent
                  ? "font-semibold text-ochre hover:bg-paper hover:text-ochre"
                  : "text-ink-soft hover:bg-paper hover:text-forest-deep"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction} className="mt-5">
          <button type="submit" className="text-sm text-terracotta underline">
            Se déconnecter
          </button>
        </form>
        <Link href="/" className="mt-3 block text-sm text-ink-soft underline">
          ← Retour au site
        </Link>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
