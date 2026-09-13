import Link from "next/link";
import { listProperties, listDistinctCities, getPropertyPhotos } from "@/lib/queries/properties";
import { PropertyCard } from "@/components/PropertyCard";

export const revalidate = 0;

const TABS: { key: string; label: string }[] = [
  { key: "", label: "Toutes les propriétés" },
  { key: "exclusive", label: "Exclusives" },
  { key: "newly_built", label: "Newly Built" },
  { key: "frontline_beach", label: "Frontline Beach" },
];

type SearchParams = {
  tag?: string;
  city?: string;
  listingType?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
};

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const tag = (["exclusive", "newly_built", "frontline_beach"] as const).includes(
    params.tag as "exclusive" | "newly_built" | "frontline_beach"
  )
    ? (params.tag as "exclusive" | "newly_built" | "frontline_beach")
    : undefined;

  const [properties, cities] = await Promise.all([
    listProperties({
      tag,
      city: params.city || undefined,
      listingType: params.listingType === "vente" || params.listingType === "location"
        ? params.listingType
        : undefined,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
      bedrooms: params.bedrooms ? Number(params.bedrooms) : undefined,
    }),
    listDistinctCities(),
  ]);

  const photosByProperty = await Promise.all(
    properties.map((p) => getPropertyPhotos(p.id))
  );

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <h1 className="text-4xl">Nos propriétés</h1>

        <div className="mt-8 flex flex-wrap gap-2 border-b border-line pb-6">
          {TABS.map((t) => {
            const active = (params.tag || "") === t.key;
            return (
              <Link
                key={t.key}
                href={t.key ? `/properties?tag=${t.key}` : "/properties"}
                className={`rounded-full px-4 py-2 text-sm ${
                  active ? "bg-forest text-paper" : "border border-line text-ink-soft"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </div>

        <form className="mt-8 grid gap-4 rounded-sm border border-line bg-paper p-6 sm:grid-cols-2 lg:grid-cols-5" method="get">
          {tag && <input type="hidden" name="tag" value={tag} />}
          <div>
            <label className="field-label" htmlFor="city">Ville</label>
            <select id="city" name="city" defaultValue={params.city || ""} className="field-input">
              <option value="">Toutes</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="listingType">Type</label>
            <select id="listingType" name="listingType" defaultValue={params.listingType || ""} className="field-input">
              <option value="">Vente ou location</option>
              <option value="vente">Vente</option>
              <option value="location">Location</option>
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="minPrice">Prix min (FCFA)</label>
            <input id="minPrice" type="number" name="minPrice" defaultValue={params.minPrice || ""} className="field-input" />
          </div>
          <div>
            <label className="field-label" htmlFor="maxPrice">Prix max (FCFA)</label>
            <input id="maxPrice" type="number" name="maxPrice" defaultValue={params.maxPrice || ""} className="field-input" />
          </div>
          <div>
            <label className="field-label" htmlFor="bedrooms">Chambres min.</label>
            <input id="bedrooms" type="number" name="bedrooms" defaultValue={params.bedrooms || ""} className="field-input" />
          </div>
          <div className="lg:col-span-5">
            <button type="submit" className="btn btn-primary">Filtrer</button>
          </div>
        </form>

        {properties.length === 0 ? (
          <p className="mt-16 text-center text-ink-soft">
            Aucune propriété ne correspond à ces critères pour le moment.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property, i) => (
              <PropertyCard key={property.id} property={property} coverUrl={photosByProperty[i][0]?.url} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
