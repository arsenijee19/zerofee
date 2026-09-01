import { ProductShell, Panel } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";

export default async function CreatorSupportPage() {
  const user = await requireRole("CREATOR");
  return <ProductShell kind="creator" title="Support" user={user}><Panel title="Creator support"><p>Include a payment, quote, payout or migration reference when contacting the operations team.</p><a className="primary-button" href="mailto:support@example.test">Contact support</a></Panel></ProductShell>;
}
