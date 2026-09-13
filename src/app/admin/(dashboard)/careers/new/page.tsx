import { createJobListingAction } from "@/lib/actions/admin-careers";
import { JobListingForm } from "@/components/admin/JobListingForm";

export default function NewJobListingPage() {
  return (
    <div>
      <h1 className="text-3xl">Nouvelle offre d&apos;emploi</h1>
      <JobListingForm action={createJobListingAction} />
    </div>
  );
}
