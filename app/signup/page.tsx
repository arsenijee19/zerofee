import { PublicHeader, Panel } from "@/components/route-ui";
import { signupAction } from "@/app/actions";

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const params = await searchParams;
  return (
    <>
      <PublicHeader />
      <main className="workspace">
        <Panel title="Create your ZeroFee account" eyebrow="Signup">
          <form className="form-stack" action={signupAction}>
            <input type="hidden" name="role" value={params.role === "creator" ? "CREATOR" : "MEMBER"} />
            <label>Name<input name="name" required defaultValue={params.role === "creator" ? "New Creator" : "New Member"} /></label>
            <label>Email<input name="email" required type="email" /></label>
            <label>Password<input name="password" required type="password" minLength={8} /></label>
            <button className="primary-button" type="submit">Create account</button>
          </form>
        </Panel>
      </main>
    </>
  );
}
