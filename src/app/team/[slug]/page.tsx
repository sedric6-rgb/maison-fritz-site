import { notFound } from "next/navigation";
import { getAgentBySlug } from "@/lib/queries/agents";
import { listPropertiesByAgent, getPropertyPhotos } from "@/lib/queries/properties";
import { PropertyCard } from "@/components/PropertyCard";

export const revalidate = 0;

export default async function AgentProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const agent = await getAgentBySlug(slug);
  if (!agent) notFound();

  const properties = await listPropertiesByAgent(agent.id);
  const photosByProperty = await Promise.all(properties.map((p) => getPropertyPhotos(p.id)));

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-3">
          <div className="aspect-square overflow-hidden rounded-sm bg-bg-alt">
            {agent.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={agent.photo_url} alt={agent.full_name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-ink-soft">Pas de photo</div>
            )}
          </div>
          <div className="sm:col-span-2">
            <h1 className="text-3xl">{agent.full_name}</h1>
            <p className="mt-1 text-ochre">{agent.role}</p>
            <div className="mt-4 space-y-1 text-sm text-ink-soft">
              {agent.city && <p>{agent.city}</p>}
              {agent.phone && <p>{agent.phone}</p>}
              {agent.email && <p>{agent.email}</p>}
            </div>
            {agent.bio && <p className="mt-6 whitespace-pre-line text-ink-soft">{agent.bio}</p>}
          </div>
        </div>

        {properties.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl">Biens gérés par {agent.full_name.split(" ")[0]}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property, i) => (
                <PropertyCard key={property.id} property={property} coverUrl={photosByProperty[i][0]?.url} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
