import { notFound } from "next/navigation";
import { getPropertyBySlug, getPropertyPhotos } from "@/lib/queries/properties";
import { getAgentById } from "@/lib/queries/agents";
import { formatPrice } from "@/lib/format";
import { submitPropertyInquiry } from "@/lib/actions/leads";

export const revalidate = 0;

function youtubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export default async function PropertyDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { slug } = await params;
  const { sent, error } = await searchParams;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const [photos, agent] = await Promise.all([
    getPropertyPhotos(property.id),
    property.agent_id ? getAgentById(property.agent_id) : Promise.resolve(null),
  ]);

  const embedUrl = property.video_url ? youtubeEmbedUrl(property.video_url) : null;

  const tags: string[] = [];
  if (property.is_exclusive) tags.push("Exclusive");
  if (property.is_newly_built) tags.push("Newly Built");
  if (property.is_frontline_beach) tags.push("Frontline Beach");

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        {/* Photos */}
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="aspect-[4/3] overflow-hidden rounded-sm bg-bg-alt sm:col-span-2 sm:row-span-2">
            {photos[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photos[0].url} alt={property.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-ink-soft">Pas de photo</div>
            )}
          </div>
          {photos.slice(1, 5).map((photo) => (
            <div key={photo.id} className="aspect-[4/3] overflow-hidden rounded-sm bg-bg-alt">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt={property.title} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-ochre/40 px-2.5 py-0.5 text-xs text-ochre">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl">{property.title}</h1>
            <p className="mt-2 text-ink-soft">
              {property.neighborhood ? `${property.neighborhood}, ` : ""}
              {property.city}
            </p>

            {/* Informations */}
            <div className="mt-8 grid grid-cols-3 gap-4 border-y border-line py-6 text-center">
              <div>
                <div className="font-display text-2xl text-forest-deep">{property.bedrooms}</div>
                <div className="text-sm text-ink-soft">Chambres</div>
              </div>
              <div>
                <div className="font-display text-2xl text-forest-deep">{property.bathrooms}</div>
                <div className="text-sm text-ink-soft">Salles de bain</div>
              </div>
              <div>
                <div className="font-display text-2xl text-forest-deep">{property.surface_m2} m²</div>
                <div className="text-sm text-ink-soft">Surface</div>
              </div>
            </div>

            {property.description && (
              <p className="mt-8 whitespace-pre-line text-ink-soft">{property.description}</p>
            )}

            {/* Vidéo */}
            {embedUrl && (
              <div className="mt-8 aspect-video overflow-hidden rounded-sm">
                <iframe
                  src={embedUrl}
                  title={`Vidéo — ${property.title}`}
                  className="h-full w-full"
                  allowFullScreen
                />
              </div>
            )}
          </div>

          {/* Prix + contact agent */}
          <div>
            <div className="rounded-sm border border-line bg-paper p-6">
              <p className="font-display text-2xl text-forest-deep">
                {formatPrice(Number(property.price), property.listing_type)}
              </p>
              {agent && (
                <div className="mt-4 border-t border-line pt-4">
                  <p className="text-sm text-ink-soft">Agent en charge</p>
                  <p className="font-semibold">{agent.full_name}</p>
                  {agent.phone && <p className="text-sm text-ink-soft">{agent.phone}</p>}
                </div>
              )}

              {sent ? (
                <p className="mt-6 rounded-sm bg-forest/10 p-4 text-sm text-forest-deep">
                  Votre demande a bien été envoyée. Un agent vous recontacte rapidement.
                </p>
              ) : (
                <form action={submitPropertyInquiry} className="mt-6 flex flex-col gap-4">
                  <input type="hidden" name="property_id" value={property.id} />
                  <input type="hidden" name="property_slug" value={property.slug} />
                  {error && (
                    <p className="text-sm text-terracotta">
                      Merci d&apos;indiquer votre nom et un téléphone ou un email.
                    </p>
                  )}
                  <div>
                    <label className="field-label" htmlFor="name">Nom</label>
                    <input id="name" name="name" required className="field-input" />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="phone">Téléphone</label>
                    <input id="phone" name="phone" className="field-input" />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" className="field-input" />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="message">Message</label>
                    <textarea id="message" name="message" rows={3} className="field-input" />
                  </div>
                  <button type="submit" className="btn btn-primary">Contacter l&apos;agent</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
