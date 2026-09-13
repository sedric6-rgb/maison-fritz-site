import Link from "next/link";
import {
  getFeaturedProperty,
  listProperties,
  listSoldProperties,
  getPropertyPhotos,
} from "@/lib/queries/properties";
import { listAgents } from "@/lib/queries/agents";
import { listBlogPosts } from "@/lib/queries/blog";
import { listPublishedTestimonials } from "@/lib/queries/testimonials";
import { PropertyCard } from "@/components/PropertyCard";
import { AgentCard } from "@/components/AgentCard";
import { formatPrice, formatDate } from "@/lib/format";

export const revalidate = 0;

export default async function HomePage() {
  const [featured, exclusives, sold, agents, posts, testimonials] = await Promise.all([
    getFeaturedProperty(),
    listProperties({ tag: "exclusive" }),
    listSoldProperties(3),
    listAgents(),
    listBlogPosts(3),
    listPublishedTestimonials(3),
  ]);

  const featuredPhotos = featured ? await getPropertyPhotos(featured.id) : [];

  return (
    <>
      {/* Présentation */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 sm:px-8 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-4 font-display text-base italic text-terracotta">
              Immobilier — Pointe-Noire &amp; Brazzaville
            </div>
            <h1 className="max-w-xl text-4xl sm:text-5xl">
              Votre bien, géré comme si vous étiez sur place.
            </h1>
            <p className="mt-6 max-w-md text-lg text-ink-soft">
              Maison Fritz sécurise juridiquement vos mandats, gère vos locations au quotidien et
              rend compte à chaque étape — depuis la diaspora ou depuis le Congo.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/properties" className="btn btn-primary">
                Voir les propriétés
              </Link>
              <Link href="/about#sell-with-us" className="btn btn-ghost">
                Devenir agent franchisé
              </Link>
            </div>
          </div>
          {featured && (
            <Link
              href={`/properties/${featured.slug}`}
              className="block overflow-hidden rounded-sm border border-line bg-paper"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-bg-alt">
                {featuredPhotos[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={featuredPhotos[0].url}
                    alt={featured.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-ink-soft">
                    Propriété vedette
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="font-display text-sm italic text-ochre">Propriété vedette</div>
                <h3 className="mt-1 text-xl font-semibold">{featured.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">
                  {featured.neighborhood ? `${featured.neighborhood}, ` : ""}
                  {featured.city}
                </p>
                <p className="mt-3 font-display text-lg text-forest-deep">
                  {formatPrice(Number(featured.price), featured.listing_type)}
                </p>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* Exclusives */}
      {exclusives.length > 0 && (
        <section className="border-t border-line bg-paper py-20">
          <div className="mx-auto max-w-6xl px-6 sm:px-8">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="text-3xl">Nos exclusivités</h2>
              <Link href="/properties?tag=exclusive" className="text-sm text-forest-deep underline">
                Voir tout
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {exclusives.slice(0, 3).map((property) => (
                <PropertyCardWithPhoto key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Équipe */}
      {agents.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6 sm:px-8">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="text-3xl">Notre équipe</h2>
              <Link href="/team" className="text-sm text-forest-deep underline">
                Tous les agents
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {agents.slice(0, 4).map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Propriétés vendues */}
      {sold.length > 0 && (
        <section className="border-t border-line bg-forest-deep py-20 text-paper">
          <div className="mx-auto max-w-6xl px-6 sm:px-8">
            <h2 className="mb-10 text-3xl text-paper">Récemment vendues / louées</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {sold.map((property) => (
                <div key={property.id} className="border border-white/15 p-5">
                  <div className="font-display text-sm italic text-ochre">
                    {property.status === "vendu" ? "Vendu" : "Loué"}
                  </div>
                  <h3 className="mt-1 text-lg font-semibold text-paper">{property.title}</h3>
                  <p className="mt-1 text-sm text-white/70">
                    {property.neighborhood ? `${property.neighborhood}, ` : ""}
                    {property.city}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Avis clients */}
      {testimonials.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6 sm:px-8">
            <h2 className="mb-10 text-3xl">Avis clients</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {testimonials.map((t) => (
                <div key={t.id} className="border border-line bg-paper p-6">
                  <div className="text-ochre">{"★".repeat(t.rating)}</div>
                  <p className="mt-3 text-sm text-ink-soft">{t.message}</p>
                  <p className="mt-4 font-display text-sm text-forest-deep">— {t.author_name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog */}
      {posts.length > 0 && (
        <section className="border-t border-line bg-paper py-20">
          <div className="mx-auto max-w-6xl px-6 sm:px-8">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="text-3xl">Sur le blog</h2>
              <Link href="/blog" className="text-sm text-forest-deep underline">
                Tous les articles
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="block">
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-sm bg-bg-alt">
                    {post.cover_image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <p className="mt-3 text-xs text-ink-soft">{formatDate(post.published_at)}</p>
                  <h3 className="mt-1 text-lg font-semibold">{post.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

async function PropertyCardWithPhoto({ property }: { property: Awaited<ReturnType<typeof listProperties>>[number] }) {
  const photos = await getPropertyPhotos(property.id);
  return <PropertyCard property={property} coverUrl={photos[0]?.url} />;
}
