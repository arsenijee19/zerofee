import type { Metadata } from "next";
import Link from "next/link";
import { loginAction } from "@/app/actions";
import { AuthShell, DemoAccounts } from "@/components/auth-shell";
import { safeRedirectPath } from "@/lib/server/validation";

export const metadata: Metadata = { title: "Log in", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; verified?: string; reset?: string; error?: string; loggedOut?: string }> }) {
  const params = await searchParams;
  const next = safeRedirectPath(params.next, "");
  return (
    <AuthShell title="Log in" eyebrow="Account" aside={<DemoAccounts />}>
      {params.verified && <p className="status-pill success" role="status">Email verified</p>}
      {params.reset && <p className="status-pill success" role="status">Password reset</p>}
      {params.loggedOut && <p className="status-pill" role="status">You are logged out</p>}
      {params.error && <p className="status-pill danger" role="alert">Access requires the correct role</p>}
      <form className="form-stack" action={loginAction}>
        <input type="hidden" name="next" value={next} />
        <label>Email<input name="email" required type="email" autoComplete="email" autoFocus /></label>
        <label>Password<input name="password" required type="password" autoComplete="current-password" /></label>
        <button className="primary-button wide-button" type="submit">Log in</button>
      </form>
      <p className="auth-links"><Link href="/forgot-password">Forgot your password?</Link><span>New here? <Link href="/signup">Create an account</Link> or <Link href="/signup?role=creator">start as a creator</Link></span></p>
    </AuthShell>
  );
}
