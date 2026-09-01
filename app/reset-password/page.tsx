import { resetPasswordAction } from "@/app/actions";
import { PublicHeader, Panel } from "@/components/route-ui";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const params = await searchParams;
  return (
    <>
      <PublicHeader />
      <main className="workspace">
        <Panel title="Reset password" eyebrow="Security">
          <form className="form-stack" action={resetPasswordAction}>
            <label>Reset token<input name="token" required defaultValue={params.token ?? ""} /></label>
            <label>New password<input name="password" required type="password" minLength={8} /></label>
            <button className="primary-button" type="submit">Reset password</button>
          </form>
        </Panel>
      </main>
    </>
  );
}
