export function formatPrice(value: number, listingType?: "vente" | "location"): string {
  const formatted = new Intl.NumberFormat("fr-FR").format(Math.round(value));
  const suffix = listingType === "location" ? " FCFA / mois" : " FCFA";
  return `${formatted}${suffix}`;
}

export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(
    date
  );
}
