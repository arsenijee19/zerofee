import { ProductShell, Panel } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";

export default async function AdminSupportPage() {
  const user = await requireRole("ADMIN");
  return <ProductShell kind="admin" title="Support" user={user}><Panel title="Support queue"><p>Support intake is ready for ticket storage and provider references. The seeded email channel is test-only.</p><a className="primary-button" href="mailto:support@example.test">Open mailbox</a></Panel></ProductShell>;
}
