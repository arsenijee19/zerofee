import { PublicHeader, Panel } from "@/components/route-ui";
import { loginAction } from "@/app/actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; verified?: string; reset?: string; error?: string }> }) {
  const params = await searchParams;
  return (
    <>
      <PublicHeader />
      <main className="workspace">
        <Panel title="Log in" eyebrow="Account">
          {params.verified && <p className="status-pill success">Email verified</p>}
          {params.reset && <p className="status-pill success">Password reset</p>}
          {params.error && <p className="status-pill danger">Access requires the correct role</p>}
          <form className="form-stack" action={loginAction}>
            <input type="hidden" name="next" value={params.next ?? "/member"} />
            <label>Email<input name="email" required type="email" defaultValue="ana@example.test" /></label>
            <label>Password<input name="password" required type="password" defaultValue="Password123!" /></label>
            <button className="primary-button" type="submit">Log in</button>
          </form>
        </Panel>
      </main>
    </>
  );
}
