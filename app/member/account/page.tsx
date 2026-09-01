import { ProductShell, Panel } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";

export default async function MemberAccountPage() {
  const user = await requireRole("MEMBER");
  return <ProductShell kind="member" title="Account" user={user}><Panel title="Account details"><div className="detail-list"><div><span>Name</span><strong>{user.name}</strong></div><div><span>Email</span><strong>{user.email}</strong></div><div><span>Security</span><a href="/forgot-password">Reset password</a></div></div></Panel></ProductShell>;
}
