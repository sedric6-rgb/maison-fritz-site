import { notFound } from "next/navigation";
import { getPropertyById, getPropertyPhotos } from "@/lib/queries/properties";
import { listAgents } from "@/lib/queries/agents";
import { updatePropertyAction } from "@/lib/actions/admin-properties";
import { PropertyForm } from "@/components/admin/PropertyForm";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getPropertyById(Number(id));
  if (!property) notFound();

  const [agents, photos] = await Promise.all([listAgents(), getPropertyPhotos(property.id)]);

  return (
    <div>
      <h1 className="text-3xl">Modifier : {property.title}</h1>
      <PropertyForm
        action={updatePropertyAction}
        property={property}
        photoUrls={photos.map((p) => p.url)}
        agents={agents}
      />
    </div>
  );
}
