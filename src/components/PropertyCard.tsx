import Link from "next/link";
import type { Property } from "@/lib/queries/properties";
import { formatPrice } from "@/lib/format";

export function PropertyCard({
  property,
  coverUrl,
}: {
  property: Property;
  coverUrl?: string;
}) {
  const tags: string[] = [];
  if (property.is_exclusive) tags.push("Exclusive");
  if (property.is_newly_built) tags.push("Newly Built");
  if (property.is_frontline_beach) tags.push("Frontline Beach");
  if (property.status !== "disponible") tags.push(property.status === "vendu" ? "Vendu" : "Loué");

  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group block overflow-hidden rounded-sm border border-line bg-paper"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-bg-alt">
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt={property.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-ink-soft">
            Pas de photo
          </div>
        )}
      </div>
      <div className="p-5">
        {tags.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-ochre/40 px-2.5 py-0.5 text-xs text-ochre"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <h3 className="text-lg font-semibold">{property.title}</h3>
        <p className="mt-1 text-sm text-ink-soft">
          {property.neighborhood ? `${property.neighborhood}, ` : ""}
          {property.city}
        </p>
        <p className="mt-3 font-display text-lg text-forest-deep">
          {formatPrice(Number(property.price), property.listing_type)}
        </p>
      </div>
    </Link>
  );
}
