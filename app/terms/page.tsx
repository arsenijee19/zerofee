import type { Metadata } from "next";
import { LegalPage } from "@/components/legal";

export const metadata: Metadata = { title: "Terms of service" };

export default function Page() {
  return (
    <LegalPage title="Terms of service">
      <h2>1. The service</h2><p>ZeroFee provides software that lets creators publish membership content, set prices and manage members. Payments are processed by third-party payment providers on the creator's connected account.</p><h2>2. Accounts</h2><p>You must provide accurate information, keep your credentials secure and be old enough to enter a binding contract in your country. You are responsible for activity under your account.</p><h2>3. Creators</h2><p>Creators confirm that they own or license the content they publish, comply with the acceptable use policy and complete payment-provider verification. Creators are responsible for taxes on their income unless otherwise stated at checkout.</p><h2>4. Platform fee</h2><p>ZeroFee charges a fixed monthly plan fee. ZeroFee charges 0% of membership revenue. Payment-provider and tax amounts are shown separately.</p><h2>5. Guaranteed Earnings</h2><p>Guaranteed Earnings is a pricing method based on verified provider pricing rules. Its scope, limits and remedies must be defined in the final creator agreement.</p><h2>6. Suspension</h2><p>We may suspend accounts or unpublish content that breaks these terms, the acceptable use policy or applicable law.</p><h2>7. Changes and contact</h2><p>We may update these terms and will give notice of material changes. Contact details are provided in your support page.</p>
    </LegalPage>
  );
}
