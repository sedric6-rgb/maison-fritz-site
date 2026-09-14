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

/** Compare une date (string ou Date, telle que renvoyée par MySQL) au jour présent. */
export function isOverdue(value: string | Date): boolean {
  const date = typeof value === "string" ? new Date(value) : value;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  return date.getTime() < startOfToday.getTime();
}
