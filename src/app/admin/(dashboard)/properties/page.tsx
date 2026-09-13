import Link from "next/link";
import { listProperties } from "@/lib/queries/properties";
import { deletePropertyAction } from "@/lib/actions/admin-properties";
import { formatPrice } from "@/lib/format";

export const revalidate = 0;

export default async function AdminPropertiesPage() {
  const properties = await listProperties({ includeSold: true });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Propriétés</h1>
        <Link href="/admin/properties/new" className="btn btn-primary">
          + Nouvelle propriété
        </Link>
      </div>

      <div className="mt-8 divide-y divide-line border-y border-line">
        {properties.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="font-semibold">{p.title}</p>
              <p className="text-sm text-ink-soft">
                {p.city} · {formatPrice(Number(p.price), p.listing_type)} · {p.status}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-4 text-sm">
              <Link href={`/admin/properties/${p.id}/edit`} className="text-forest-deep underline">
                Modifier
              </Link>
              <form action={deletePropertyAction}>
                <input type="hidden" name="id" value={p.id} />
                <button type="submit" className="text-terracotta underline">
                  Supprimer
                </button>
              </form>
            </div>
          </div>
        ))}
        {properties.length === 0 && (
          <p className="py-8 text-center text-ink-soft">Aucune propriété pour le moment.</p>
        )}
      </div>
    </div>
  );
}
