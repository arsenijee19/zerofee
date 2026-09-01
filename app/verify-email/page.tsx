import { PublicHeader, Panel } from "@/components/route-ui";
import { verifyEmailAction } from "@/app/actions";

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const params = await searchParams;
  return (
    <>
      <PublicHeader />
      <main className="workspace">
        <Panel title="Verify email" eyebrow="Security">
          <form className="form-stack" action={verifyEmailAction}>
            <label>Verification token<input name="token" required defaultValue={params.token ?? ""} /></label>
            <button className="primary-button" type="submit">Verify email</button>
          </form>
        </Panel>
      </main>
    </>
  );
}
