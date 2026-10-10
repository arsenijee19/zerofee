import type { Metadata } from "next";
import { LegalPage } from "@/components/legal";

export const metadata: Metadata = { title: "Privacy policy" };

export default function Page() {
  return (
    <LegalPage title="Privacy policy">
      <h2>What we collect</h2><p>Account details (name, email, hashed password), creator profile and content, membership and payment references, support messages and security events such as logins.</p><h2>How we use it</h2><p>To run the service, process memberships, prevent fraud and abuse, provide support and meet legal obligations.</p><h2>Who we share it with</h2><p>Payment providers, email delivery and storage providers acting on our behalf, and creators for the members who subscribe to them. Payment card numbers are handled by the payment provider and never stored by ZeroFee.</p><h2>Retention</h2><p>We keep account and financial records as long as needed for the service and legal requirements, then delete or anonymise them.</p><h2>Your rights</h2><p>Depending on where you live, you can request access, correction, export or deletion of your data by contacting support.</p><h2>Cookies</h2><p>ZeroFee uses essential cookies only: a session cookie to keep you logged in and a short-lived notice cookie. No advertising trackers are used.</p>
    </LegalPage>
  );
}
