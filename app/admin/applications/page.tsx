import { reviewApplicationAction } from "@/app/actions";
import { ProductShell, Panel, DataTable } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { listCreatorApplications } from "@/lib/server/route-data";

export default async function AdminApplicationsPage() {
  const user = await requireRole("ADMIN");
  const applications = await listCreatorApplications();
  return <ProductShell kind="admin" title="Creator applications" user={user}><Panel title="Review queue"><DataTable headings={["Creator", "Country", "State", "Offering", "Decision"]} rows={applications.map((application) => [application.display_name, application.country_code, application.state, application.offering, ["SUBMITTED", "UNDER_REVIEW", "NEEDS_INFORMATION"].includes(application.state) ? <form className="inline-form" action={reviewApplicationAction} key={application.id}><input type="hidden" name="applicationId" value={application.id} /><input type="hidden" name="decision" value="APPROVED_FOR_PAYOUT_ONBOARDING" /><input name="note" required defaultValue="Approved after test review" /><button className="primary-button">Approve</button></form> : "No action"] )} /></Panel></ProductShell>;
}
