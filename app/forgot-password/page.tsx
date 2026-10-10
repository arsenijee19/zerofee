import type { Metadata } from "next";
import Link from "next/link";
import { forgotPasswordAction } from "@/app/actions";
import { AuthShell } from "@/components/auth-shell";

export const metadata: Metadata = { title: "Forgot password", robots: { index: false } };

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ sent?: string }> }) {
  const params = await searchParams;
  return (
    <AuthShell title="Forgot password" eyebrow="Security" intro="Enter your email and we will send a reset link if an account exists.">
      {params.sent && <p className="status-pill success" role="status">If that address has an account, a reset link is on its way.</p>}
      <form className="form-stack" action={forgotPasswordAction}>
        <label>Email<input name="email" required type="email" autoComplete="email" /></label>
        <button className="primary-button wide-button" type="submit">Send reset link</button>
      </form>
      <p className="auth-links"><Link href="/login">Back to log in</Link></p>
    </AuthShell>
  );
}
