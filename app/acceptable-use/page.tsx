import type { Metadata } from "next";
import { LegalPage } from "@/components/legal";

export const metadata: Metadata = { title: "Acceptable use policy" };

export default function Page() {
  return (
    <LegalPage title="Acceptable use policy">
      <h2>You may not publish</h2><ul><li>Content you do not own or have rights to use</li><li>Illegal content, or content that exploits or endangers minors</li><li>Harassment, hate speech or threats</li><li>Malware, phishing or deceptive offers</li><li>Content that infringes privacy or intellectual property rights</li></ul><h2>Reporting</h2><p>Members can report any post from its page. Operators review reports and may unpublish content or suspend accounts.</p><h2>Appeals</h2><p>If your content was removed, contact support with the post title and your reasoning. Decisions are recorded in the audit log.</p>
    </LegalPage>
  );
}
