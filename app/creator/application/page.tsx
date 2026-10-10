import type { Metadata } from "next";
import { submitCreatorApplicationAction } from "@/app/actions";
import { ProductShell, Panel, DataTable, StateBadge } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { getCreatorForUser } from "@/lib/server/route-data";
import { query } from "@/lib/server/db";

export const metadata: Metadata = { title: "Creator application" };

export default async function CreatorApplicationPage() {
  const user = await requireRole("CREATOR");
  const creator = await getCreatorForUser(user);
  const apps = creator ? (await query<{ id: string; state: string; offering: string; country_code: string; created_at: Date }>("SELECT id,state,offering,country_code,created_at FROM creator_applications WHERE creator_id = $1 ORDER BY created_at DESC", [creator.id])).rows : [];
  const countries = (await query<{ code: string; launch_status: string }>("SELECT code, launch_status FROM country_capabilities WHERE launch_status IN ('BETA','AVAILABLE','WAITLIST') ORDER BY code")).rows;
  const underReview = apps.some((app) => ["SUBMITTED", "UNDER_REVIEW"].includes(app.state));
  const approved = apps.some((app) => app.state === "APPROVED_FOR_PAYOUT_ONBOARDING");
  return (
    <ProductShell kind="creator" title="Creator Application" user={user}>
      {approved && <Panel title="Application approved" eyebrow="Next step"><p>You can connect payouts and publish your page.</p></Panel>}
      {underReview && <Panel title="Under review" eyebrow="Submitted"><p>Thanks. An operator is reviewing your application. You will get a notification when there is a decision.</p></Panel>}
      {!underReview && !approved && (
        <Panel title="Submit creator application" eyebrow="Compliance">
          <form className="form-stack" action={submitCreatorApplicationAction}>
            <label>Public slug<input name="slug" required minLength={3} maxLength={40} pattern="[a-z0-9\-]+" defaultValue={creator?.slug ?? ""} placeholder="your-name" aria-describedby="slug-help" /><small id="slug-help">Your page will live at /c/your-name. Lowercase letters, numbers and hyphens.</small></label>
            <label>Display name<input name="displayName" required minLength={2} maxLength={80} defaultValue={creator?.display_name ?? user.name} /></label>
            <label>Country<select name="countryCode" defaultValue={creator?.country_code ?? countries[0]?.code}>{countries.map((country) => <option key={country.code} value={country.code}>{country.code}{country.launch_status === "WAITLIST" ? " (waitlist)" : ""}</option>)}</select></label>
            <label>Business type<select name="businessType"><option value="individual">Individual</option><option value="company">Company</option></select></label>
            <label>Category<input name="category" required minLength={2} maxLength={40} placeholder="education, research, music…" /></label>
            <label>Offering<textarea name="offering" required minLength={10} maxLength={1500} placeholder="What will members get? For example weekly briefings, templates and live sessions." /></label>
            <label className="check"><input name="rightsAttested" type="checkbox" required /> <span>Rights attested: I own or have licensed everything I will publish</span></label>
            <label className="check"><input name="aupAccepted" type="checkbox" required /> <span>Acceptable use accepted: I have read the <a href="/acceptable-use">acceptable use policy</a></span></label>
            <button className="primary-button" type="submit">Submit application</button>
          </form>
        </Panel>
      )}
      {apps.length > 0 && <Panel title="Application history"><DataTable headings={["Submitted", "Country", "State", "Offering"]} rows={apps.map((app) => [app.created_at.toLocaleDateString("en", { dateStyle: "medium" }), app.country_code, <StateBadge key={app.id} state={app.state} />, app.offering])} /></Panel>}
    </ProductShell>
  );
}
