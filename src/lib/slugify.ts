export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // enlève les accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Ajoute un suffixe numérique si le slug de base existe déjà. */
export async function uniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>
): Promise<string> {
  const baseSlug = slugify(base) || "item";
  let slug = baseSlug;
  let counter = 2;
  while (await exists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
  return slug;
}
