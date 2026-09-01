import { logoutAction } from "@/app/actions";

export default function LogoutPage() {
  return <form action={logoutAction}><button className="primary-button" type="submit">Log out</button></form>;
}
