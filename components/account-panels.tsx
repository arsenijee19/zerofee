import { changePasswordAction, signOutEverywhereAction, updateAccountNameAction } from "@/app/actions";
import { Panel } from "@/components/route-ui";
import { activeSessionCount, type AuthUser } from "@/lib/server/auth";

export async function AccountPanels({ user }: { user: AuthUser }) {
  const sessions = await activeSessionCount(user);
  return (
    <>
      <Panel title="Account details">
        <div className="detail-list"><div><span>Email</span><strong>{user.email}</strong></div><div><span>Active sessions</span><strong>{sessions}</strong></div></div>
        <form className="form-stack space-top" action={updateAccountNameAction}>
          <label>Name<input name="name" required minLength={2} maxLength={80} defaultValue={user.name} autoComplete="name" /></label>
          <button className="secondary-button" type="submit">Save name</button>
        </form>
      </Panel>
      <Panel title="Change password" eyebrow="Security">
        <form className="form-stack" action={changePasswordAction}>
          <label>Current password<input name="currentPassword" type="password" required autoComplete="current-password" /></label>
          <label>New password<input name="newPassword" type="password" required minLength={10} maxLength={128} autoComplete="new-password" /></label>
          <button className="primary-button" type="submit">Change password</button>
        </form>
        <form action={signOutEverywhereAction} className="space-top"><button className="secondary-button" type="submit">Sign out on all devices</button></form>
      </Panel>
    </>
  );
}
