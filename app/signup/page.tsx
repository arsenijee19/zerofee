import type { Metadata } from "next";
import Link from "next/link";
import { signupAction } from "@/app/actions";
import { AuthShell } from "@/components/auth-shell";

export const metadata: Metadata = { title: "Create your account", robots: { index: false } };

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const params = await searchParams;
  const creator = params.role === "creator";
  return (
    <AuthShell title="Create your ZeroFee account" eyebrow={creator ? "Creator signup" : "Signup"} intro={creator ? "Set up your seller profile and apply to start earning with 0% platform fee." : "Join to subscribe to creators and manage your memberships."}>
      <form className="form-stack" action={signupAction}>
        <input type="hidden" name="role" value={creator ? "CREATOR" : "MEMBER"} />
        <label>Name<input name="name" required minLength={2} maxLength={80} autoComplete="name" /></label>
        <label>Email<input name="email" required type="email" autoComplete="email" /></label>
        <label>Password<input name="password" required type="password" minLength={10} maxLength={128} autoComplete="new-password" aria-describedby="pw-help" /><small id="pw-help">At least 10 characters, with letters and a number.</small></label>
        <p className="muted tiny">By creating an account you agree to the <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy policy</Link>.</p>
        <button className="primary-button wide-button" type="submit">Create account</button>
      </form>
      <p className="auth-links"><span>Already have an account? <Link href="/login">Log in</Link></span></p>
    </AuthShell>
  );
}
