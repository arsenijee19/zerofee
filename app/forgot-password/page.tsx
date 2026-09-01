import { forgotPasswordAction } from "@/app/actions";
import { PublicHeader, Panel } from "@/components/route-ui";

export default function ForgotPasswordPage() {
  return (
    <>
      <PublicHeader />
      <main className="workspace">
        <Panel title="Forgot password" eyebrow="Security">
          <form className="form-stack" action={forgotPasswordAction}>
            <label>Email<input name="email" required type="email" /></label>
            <button className="primary-button" type="submit">Send reset token</button>
          </form>
        </Panel>
      </main>
    </>
  );
}
