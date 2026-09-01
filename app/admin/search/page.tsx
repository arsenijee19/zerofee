import { ProductShell, Panel, DataTable } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { search } from "@/lib/server/search-service";

export default async function AdminSearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const user = await requireRole("ADMIN");
  const { q = "" } = await searchParams;
  const rows = q ? await search(user, q) : [];
  return <ProductShell kind="admin" title="Search" user={user}><Panel title="Search operations"><form className="inline-form"><input name="q" defaultValue={q} placeholder="Users, creators, events" /><button className="primary-button">Search</button></form>{rows.length ? <DataTable headings={["Group", "Result", "State"]} rows={rows.map((row) => [String(row.grp), String(row.label), String(row.meta)])} /> : <p className="muted">Enter a term to search permitted operational records.</p>}</Panel></ProductShell>;
}
