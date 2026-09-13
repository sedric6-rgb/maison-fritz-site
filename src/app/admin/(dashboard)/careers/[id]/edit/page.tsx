import { notFound } from "next/navigation";
import { getJobListingById } from "@/lib/queries/careers";
import { updateJobListingAction } from "@/lib/actions/admin-careers";
import { JobListingForm } from "@/components/admin/JobListingForm";

export default async function EditJobListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await getJobListingById(Number(id));
  if (!job) notFound();

  return (
    <div>
      <h1 className="text-3xl">Modifier : {job.title}</h1>
      <JobListingForm action={updateJobListingAction} job={job} />
    </div>
  );
}
