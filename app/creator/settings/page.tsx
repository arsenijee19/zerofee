import { ProductShell, Panel } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { getCreatorForUser } from "@/lib/server/route-data";

export default async function CreatorSettingsPage() {
  const user = await requireRole("CREATOR");
  const creator = await getCreatorForUser(user);
  return <ProductShell kind="creator" title="Settings" user={user}><Panel title="Creator profile"><div className="detail-list"><div><span>Display name</span><strong>{creator?.display_name ?? "Not created"}</strong></div><div><span>Country</span><strong>{creator?.country_code ?? "Not selected"}</strong></div><div><span>Public page</span><a href={creator ? `/c/${creator.slug}` : "/creator/application"}>{creator ? `/c/${creator.slug}` : "Start application"}</a></div></div></Panel></ProductShell>;
}
