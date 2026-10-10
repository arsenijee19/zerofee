import { PublicHeader, SiteFooter } from "@/components/route-ui";
import { currentUserFromCookies } from "@/lib/server/auth";

export async function AuthShell({ title, eyebrow, intro, children, aside }: { title: string; eyebrow: string; intro?: string; children: React.ReactNode; aside?: React.ReactNode }) {
  const user = await currentUserFromCookies();
  return (
    <>
      <PublicHeader user={user} />
      <main id="main-content" className="auth-main">
        <section className="auth-card" aria-labelledby="auth-title">
          <p className="eyebrow">{eyebrow}</p>
          <h1 id="auth-title" className="auth-title">{title}</h1>
          {intro && <p className="muted">{intro}</p>}
          {children}
        </section>
        {aside}
      </main>
      <SiteFooter />
    </>
  );
}

export function DemoAccounts() {
  if (process.env.NODE_ENV === "production") return null;
  return (
    <aside className="demo-accounts" aria-label="Test accounts">
      <strong>Test-mode accounts</strong>
      <ul>
        <li>Creator: <code>mila@example.test</code></li>
        <li>Member: <code>ana@example.test</code></li>
        <li>Admin: <code>ops@example.test</code></li>
      </ul>
      <p>Password for all: <code>Password123!</code></p>
    </aside>
  );
}
