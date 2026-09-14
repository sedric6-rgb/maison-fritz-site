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
import { formatDate } from "@/lib/format";

export const revalidate = 0;

const COLLECTIONS = [
  {
    tag: "exclusive",
    title: "Exclusives",
    text: "Des biens confiés en exclusivité à Maison Fritz, disponibles nulle part ailleurs.",
  },
  {
    tag: "newly_built",
    title: "Newly Built",
    text: "Constructions neuves ou récemment livrées, prêtes à habiter ou à mettre en location.",
  },
  {
    tag: "frontline_beach",
    title: "Frontline Beach",
    text: "Un accès direct à l'océan, sur le littoral de Pointe-Noire.",
  },
] as const;

const ADVANTAGES = [
  {
    title: "Expertise locale",
    text: "Une connaissance précise du marché de Pointe-Noire et Brazzaville, quartier par quartier.",
  },
  {
    title: "Sécurité",
    text: "Des procédures rigoureuses et un accompagnement juridique à chaque étape de la transaction.",
  },
  {
    title: "Gestion à distance",
    text: "Une solution pensée pour les propriétaires qui vivent à l'étranger.",
  },
  {
    title: "Accompagnement",
    text: "Un interlocuteur unique et dédié, du premier échange jusqu'à la remise des clés.",
  },
];

export default async function HomePage() {
  const [featured, allAvailable, sold, agents, posts, testimonials] = await Promise.all([
    getFeaturedProperty(),
    listProperties({}),
    listSoldProperties(3),
    listAgents(),
    listBlogPosts(3),
    listPublishedTestimonials(3),
  ]);

  const featuredPhotos = featured ? await getPropertyPhotos(featured.id) : [];
  const showcase = allAvailable.filter((p) => p.id !== featured?.id).slice(0, 5);
  const showcasePhotos = await Promise.all(showcase.map((p) => getPropertyPhotos(p.id)));
  const soldPhotos = await Promise.all(sold.map((p) => getPropertyPhotos(p.id)));

  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[88vh] items-end overflow-hidden bg-forest-deep">
        {featuredPhotos[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={featuredPhotos[0].url}
            alt={featured?.title ?? "Propriété Maison Fritz"}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(14,33,28,0.55) 0%, rgba(14,33,28,0.35) 40%, rgba(14,33,28,0.92) 100%)",
          }}
        />
        <div className="wrap relative z-10 w-full pb-16 pt-40 text-paper sm:pb-24">
          <p className="text-sm text-paper/70">Pointe-Noire · Brazzaville · Congo</p>
          <h1 className="mt-5 max-w-3xl text-paper">L&apos;immobilier d&apos;exception au Congo</h1>
          <p className="mt-6 max-w-lg text-lg text-paper/85">
            Des propriétés sélectionnées. Un accompagnement exigeant, depuis le pays comme
            depuis la diaspora.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/properties" className="btn btn-primary">
              Découvrir les propriétés
            </Link>
            <Link href="/about#sell-with-us" className="btn btn-line">
              Confier mon bien
            </Link>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="py-24 sm:py-32">
        <div className="wrap grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <p className="eyebrow">Notre approche</p>
            <h2 className="mt-4">L&apos;immobilier, autrement.</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            <p className="text-ink-soft">
              Maison Fritz réunit la connaissance fine du marché local et un accompagnement
              personnalisé, pensé pour des transactions qui se déroulent sans mauvaise
              surprise.
            </p>
            <p className="text-ink-soft">
              De la gestion locative au quotidien à l&apos;accompagnement de la diaspora,
              chaque mandat est suivi par un seul interlocuteur, du premier échange à la
              remise des clés.
            </p>
          </div>
        </div>
      </section>

      {/* PROPRIÉTÉS */}
      {showcase.length > 0 && (
        <section className="hairline py-24 sm:py-32">
          <div className="wrap">
            <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow">Sélection</p>
                <h2 className="mt-4">Nos propriétés</h2>
              </div>
              <Link href="/properties" className="text-sm text-forest-deep underline underline-offset-4">
                Voir toutes les propriétés →
              </Link>
            </div>
            <div className="grid gap-x-8 gap-y-14 lg:grid-cols-2">
              <PropertyCard property={showcase[0]} coverUrl={showcasePhotos[0]?.[0]?.url} size="large" />
              <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-1">
                {showcase.slice(1, 3).map((property, i) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    coverUrl={showcasePhotos[i + 1]?.[0]?.url}
                  />
                ))}
              </div>
            </div>
            {showcase.length > 3 && (
              <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {showcase.slice(3).map((property, i) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    coverUrl={showcasePhotos[i + 3]?.[0]?.url}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* COLLECTIONS */}
      <section className="bg-paper py-24 sm:py-32">
        <div className="wrap">
          <p className="eyebrow">Catégories</p>
          <h2 className="mt-4">Nos collections</h2>
          <div className="mt-14 grid gap-px overflow-hidden bg-line sm:grid-cols-3">
            {COLLECTIONS.map((c) => (
              <Link
                key={c.tag}
                href={`/properties?tag=${c.tag}`}
                className="group flex flex-col justify-between gap-10 bg-paper p-8 transition-colors hover:bg-forest-deep sm:p-10"
              >
                <h3 className="text-forest-deep transition-colors group-hover:text-paper">
                  {c.title}
                </h3>
                <div>
                  <p className="text-sm text-ink-soft transition-colors group-hover:text-paper/75">
                    {c.text}
                  </p>
                  <span className="mt-5 inline-block text-sm text-ochre transition-colors group-hover:text-ochre-soft">
                    Explorer →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* POURQUOI MAISON FRITZ */}
      <section className="py-24 sm:py-32">
        <div className="wrap">
          <p className="eyebrow">Pourquoi Maison Fritz</p>
          <h2 className="mt-4 max-w-xl">Une autre manière de vivre l&apos;immobilier au Congo.</h2>
          <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {ADVANTAGES.map((a) => (
              <div key={a.title} className="border-t border-forest pt-6">
                <h3>{a.title}</h3>
                <p className="mt-3 text-sm text-ink-soft">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ÉQUIPE */}
      {agents.length > 0 && (
        <section className="hairline bg-paper py-24 sm:py-32">
          <div className="wrap">
            <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow">L&apos;équipe</p>
                <h2 className="mt-4">Notre équipe</h2>
              </div>
              <Link href="/team" className="text-sm text-forest-deep underline underline-offset-4">
                Découvrir notre équipe →
              </Link>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {agents.slice(0, 4).map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* VENDU / LOUÉ */}
      {sold.length > 0 && (
        <section className="bg-forest-deep py-24 text-paper sm:py-32">
          <div className="wrap">
            <p className="eyebrow text-ochre-soft">Confiance</p>
            <h2 className="mt-4 text-paper">Ils nous ont fait confiance</h2>
            <div className="mt-14 grid gap-10 sm:grid-cols-3">
              {sold.map((property, i) => (
                <div key={property.id}>
                  <div className="aspect-[4/3] w-full overflow-hidden bg-white/5">
                    {soldPhotos[i]?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={soldPhotos[i][0].url} alt={property.title} className="img-cover opacity-90" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-paper/50">
                        Photo à venir
                      </div>
                    )}
                  </div>
                  <p className="mt-4 text-sm text-ochre-soft">
                    {property.status === "vendu" ? "Vendu" : "Loué"}
                  </p>
                  <h3 className="mt-1 text-paper">{property.title}</h3>
                  <p className="mt-1 text-sm text-paper/65">
                    {property.neighborhood ? `${property.neighborhood}, ` : ""}
                    {property.city}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TÉMOIGNAGES */}
      {testimonials.length > 0 && (
        <section className="py-24 sm:py-32">
          <div className="wrap">
            <p className="eyebrow">Avis</p>
            <h2 className="mt-4">Ce que disent nos clients</h2>
            <div className="mt-14 grid gap-12 sm:grid-cols-3">
              {testimonials.map((t) => (
                <div key={t.id} className="border-t border-line pt-6">
                  <p className="text-ink-soft">&laquo; {t.message} &raquo;</p>
                  <p className="mt-5 font-display text-forest-deep">{t.author_name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BLOG */}
      {posts.length > 0 && (
        <section className="hairline bg-paper py-24 sm:py-32">
          <div className="wrap">
            <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow">Actualités</p>
                <h2 className="mt-4">Nos dernières actualités</h2>
              </div>
              <Link href="/blog" className="text-sm text-forest-deep underline underline-offset-4">
                Voir toutes les actualités →
              </Link>
            </div>
            <div className="grid gap-10 sm:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <div className="aspect-[4/3] w-full overflow-hidden bg-bg-alt">
                    {post.cover_image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.cover_image_url} alt={post.title} className="img-cover img-zoom" />
                    )}
                  </div>
                  <p className="mt-4 text-xs text-ink-faint">{formatDate(post.published_at)}</p>
                  <h3 className="mt-1">{post.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA FINAL */}
      <section className="bg-forest-deep py-24 text-paper sm:py-32">
        <div className="wrap text-center">
          <h2 className="mx-auto max-w-2xl text-paper">
            Vous avez un projet immobilier au Congo ?
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-paper/80">
            Vendre, acheter, louer ou confier la gestion de votre bien : notre équipe vous
            accompagne à chaque étape.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn btn-primary">
              Nous contacter
            </Link>
            <Link href="/about#sell-with-us" className="btn btn-line">
              Confier mon bien
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
