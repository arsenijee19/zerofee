import type { Metadata } from "next";
import { LegalPage } from "@/components/legal";

export const metadata: Metadata = { title: "Refund policy" };

export default function Page() {
  return (
    <LegalPage title="Refund policy">
      <h2>Member refunds</h2><p>Memberships are recurring. You can cancel at any time and keep access until the end of the paid period. Refund eligibility for a payment is decided by the creator within the limits required by consumer law and the payment provider.</p><h2>How to request one</h2><p>Open a support ticket from your member account with the payment details. The creator is notified and can issue a refund from their financial verification page.</p><h2>Disputes</h2><p>Chargebacks are handled with the payment provider. Disputed payments may pause access to paid content.</p><h2>Platform plans</h2><p>Creator plan fees are billed monthly and can be cancelled at the end of the current period.</p>
    </LegalPage>
  );
}
