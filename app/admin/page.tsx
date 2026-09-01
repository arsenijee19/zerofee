import { ProductShell, Panel, Metric, DataTable } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { query } from "@/lib/server/db";

export default async function AdminDashboardPage() {
  const user = await requireRole("ADMIN");
  const [users, creators, payments, incidents] = await Promise.all([query<{ count: string }>("SELECT COUNT(*) FROM users"), query<{ count: string }>("SELECT COUNT(*) FROM creator_profiles"), query<{ count: string }>("SELECT COUNT(*) FROM membership_payments"), query<{ count: string }>("SELECT COUNT(*) FROM guarantee_incidents WHERE status='OPEN'")]);
  return <ProductShell kind="admin" title="Platform dashboard" user={user}><section className="metric-grid"><Metric title="Users" value={users.rows[0].count} /><Metric title="Creators" value={creators.rows[0].count} /><Metric title="Payments" value={payments.rows[0].count} /><Metric title="Open guarantee incidents" value={incidents.rows[0].count} tone={incidents.rows[0].count === "0" ? "success" : "danger"} /></section><Panel title="Operational posture"><DataTable headings={["Area", "Source of truth", "State"]} rows={[["Creator payments", "Connected account provider", "Mock provider active"],["Guarantee pricing", "Versioned catalog", "Auditable"],["SaaS billing", "Platform subscriptions", "Mock test mode"]]} /></Panel></ProductShell>;
}
