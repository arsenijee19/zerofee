import { submitCreatorApplicationAction } from "@/app/actions";
import { ProductShell, Panel, DataTable } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { getCreatorForUser } from "@/lib/server/route-data";
import { query } from "@/lib/server/db";

export default async function CreatorApplicationPage() {
  const user = await requireRole("CREATOR");
  const creator = await getCreatorForUser(user);
  const apps = creator ? (await query<{ id: string; state: string; offering: string; country_code: string }>("SELECT id,state,offering,country_code FROM creator_applications WHERE creator_id = $1 ORDER BY created_at DESC", [creator.id])).rows : [];
  return (
    <ProductShell kind="creator" title="Creator Application" user={user}>
      <Panel title="Submit creator application" eyebrow="Compliance">
        <form className="form-stack" action={submitCreatorApplicationAction}>
          <label>Public slug<input name="slug" required defaultValue={creator?.slug ?? `creator-${Date.now()}`} /></label>
          <label>Display name<input name="displayName" required defaultValue={creator?.display_name ?? user.name} /></label>
          <label>Country<select name="countryCode" defaultValue={creator?.country_code ?? "IE"}><option>IE</option><option>US</option><option>GB</option><option>BR</option></select></label>
          <label>Business type<select name="businessType"><option value="individual">Individual</option><option value="company">Company</option></select></label>
          <label>Category<input name="category" required defaultValue="education" /></label>
          <label>Offering<textarea name="offering" required defaultValue="Paid briefings, templates and member community." /></label>
          <label><span><input name="rightsAttested" type="checkbox" defaultChecked /> Rights attested</span></label>
          <label><span><input name="aupAccepted" type="checkbox" defaultChecked /> Acceptable use accepted</span></label>
          <button className="primary-button" type="submit">Submit application</button>
        </form>
      </Panel>
      {apps.length > 0 && <Panel title="Application history"><DataTable headings={["ID", "Country", "State", "Offering"]} rows={apps.map((app) => [app.id, app.country_code, app.state, app.offering])} /></Panel>}
    </ProductShell>
  );
}
