import type { Metadata } from "next";
import Link from "next/link";
import { resendVerificationAction, verifyEmailAction } from "@/app/actions";
import { AuthShell } from "@/components/auth-shell";

export const metadata: Metadata = { title: "Verify your email", robots: { index: false } };

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token?: string; sent?: string; created?: string }> }) {
  const params = await searchParams;
  return (
    <AuthShell title="Verify your email" eyebrow="Security" intro={params.token ? "Your account is created. Confirm your email to continue." : "We sent a verification link to your inbox. Open it, or paste the token below."}>
      {params.sent && !params.token && <p className="status-pill success" role="status">Check your inbox for the verification link</p>}
      <form className="form-stack" action={verifyEmailAction}>
        <label>Verification token<input name="token" required defaultValue={params.token ?? ""} autoComplete="one-time-code" /></label>
        <button className="primary-button wide-button" type="submit">Verify email</button>
      </form>
      <details className="disclosure">
        <summary>Did not get an email?</summary>
        <form className="form-stack" action={resendVerificationAction}>
          <label>Email<input name="email" type="email" required autoComplete="email" /></label>
          <button className="secondary-button" type="submit">Resend verification link</button>
        </form>
      </details>
      <p className="auth-links"><Link href="/login">Back to log in</Link></p>
    </AuthShell>
  );
}
