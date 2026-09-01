import { ProductShell, Panel, DataTable } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { search } from "@/lib/server/search-service";

export default async function CreatorSearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const user = await requireRole("CREATOR");
  const { q = "" } = await searchParams;
  const rows = q ? await search(user, q) : [];
  return <ProductShell kind="creator" title="Search" user={user}><Panel title="Search your workspace"><form className="inline-form"><input name="q" defaultValue={q} placeholder="Members, posts or tiers" /><button className="primary-button">Search</button></form>{rows.length ? <DataTable headings={["Group", "Result", "State"]} rows={rows.map((row) => [String(row.grp), String(row.label), String(row.meta)])} /> : <p className="muted">Enter a term to search permitted creator records.</p>}</Panel></ProductShell>;
}
