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
    <section className="py-16 sm:py-20">
      <div className="wrap">
        <div className="grid gap-12 sm:grid-cols-3 sm:gap-14">
          <div className="aspect-[4/5] overflow-hidden bg-bg-alt">
            {agent.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={agent.photo_url} alt={agent.full_name} className="img-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-ink-faint">Pas de photo</div>
            )}
          </div>
          <div className="sm:col-span-2">
            <h1>{agent.full_name}</h1>
            <p className="mt-2 text-ochre">{agent.role}</p>
            <div className="mt-5 space-y-1 text-sm text-ink-soft">
              {agent.city && <p>{agent.city}</p>}
              {agent.phone && <p>{agent.phone}</p>}
              {agent.email && <p>{agent.email}</p>}
            </div>
            {agent.bio && <p className="mt-7 whitespace-pre-line text-ink-soft">{agent.bio}</p>}
          </div>
        </div>

        {properties.length > 0 && (
          <div className="mt-20">
            <h2>Biens gérés par {agent.full_name.split(" ")[0]}</h2>
            <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
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
