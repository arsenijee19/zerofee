import type { Metadata } from "next";
import { resetPasswordAction } from "@/app/actions";
import { AuthShell } from "@/components/auth-shell";

export const metadata: Metadata = { title: "Reset password", robots: { index: false } };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const params = await searchParams;
  return (
    <AuthShell title="Reset password" eyebrow="Security" intro="Choose a new password. All other devices will be signed out.">
      <form className="form-stack" action={resetPasswordAction}>
        <label>Reset token<input name="token" required defaultValue={params.token ?? ""} autoComplete="one-time-code" /></label>
        <label>New password<input name="password" required type="password" minLength={10} maxLength={128} autoComplete="new-password" /></label>
        <button className="primary-button wide-button" type="submit">Reset password</button>
      </form>
    </AuthShell>
  );
}
