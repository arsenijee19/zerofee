import type { Metadata } from "next";
import { AccountPanels } from "@/components/account-panels";
import { ProductShell } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";

export const metadata: Metadata = { title: "Account" };

export default async function MemberAccountPage() {
  const user = await requireRole("MEMBER");
  return <ProductShell kind="member" title="Account" user={user}><AccountPanels user={user} /></ProductShell>;
}
