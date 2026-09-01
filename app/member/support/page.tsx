import { ProductShell, Panel } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";

export default async function MemberSupportPage() {
  const user = await requireRole("MEMBER");
  return <ProductShell kind="member" title="Support" user={user}><Panel title="Contact support"><p>Tell us what happened and include the membership or payment reference.</p><a className="primary-button" href="mailto:support@example.test">Email support</a></Panel></ProductShell>;
}
