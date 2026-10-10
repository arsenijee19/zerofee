import type { Metadata } from "next";
import { logoutAction } from "@/app/actions";
import { AuthShell } from "@/components/auth-shell";

export const metadata: Metadata = { title: "Log out", robots: { index: false } };

export default function LogoutPage() {
  return (
    <AuthShell title="Log out" eyebrow="Account" intro="You will need to log in again to manage your memberships.">
      <form action={logoutAction}><button className="primary-button wide-button" type="submit">Log out</button></form>
    </AuthShell>
  );
}
