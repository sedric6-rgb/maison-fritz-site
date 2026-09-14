import Link from "next/link";
import type { Property } from "@/lib/queries/properties";
import { formatPrice } from "@/lib/format";

export function PropertyCard({
  property,
  coverUrl,
  size = "default",
}: {
  property: Property;
  coverUrl?: string;
  size?: "default" | "large";
}) {
  const tags: string[] = [];
  if (property.is_exclusive) tags.push("Exclusive");
  if (property.is_newly_built) tags.push("Newly Built");
  if (property.is_frontline_beach) tags.push("Frontline Beach");
  if (property.status !== "disponible") tags.push(property.status === "vendu" ? "Vendu" : "Loué");

  return (
    <Link href={`/properties/${property.slug}`} className="group block">
      <div
        className={`w-full overflow-hidden bg-bg-alt ${
          size === "large" ? "aspect-[16/11]" : "aspect-[4/3]"
        }`}
      >
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverUrl} alt={property.title} className="img-cover img-zoom" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-ink-faint">
            Photo à venir
          </div>
        )}
      </div>
      <div className="pt-4">
        {tags.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
        <h3 className={size === "large" ? "text-2xl" : "text-lg"}>{property.title}</h3>
        <p className="mt-1 text-sm text-ink-soft">
          {property.neighborhood ? `${property.neighborhood}, ` : ""}
          {property.city}
        </p>
        <p className="mt-2 font-display text-lg text-forest-deep">
          {formatPrice(Number(property.price), property.listing_type)}
        </p>
      </div>
    </Link>
  );
}
