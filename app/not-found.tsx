import Link from "next/link";
import { PublicHeader, SiteFooter } from "@/components/route-ui";

export default function NotFound() {
  return (
    <>
      <PublicHeader />
      <main id="main-content" className="state-page">
        <p className="eyebrow">Error 404</p>
        <h1>We could not find that page.</h1>
        <p className="hero-text">The link may be old, or the page may have been unpublished by its creator.</p>
        <div className="cta-row"><Link className="primary-button" href="/">Go home</Link><Link className="secondary-button" href="/creators">Browse creators</Link></div>
      </main>
      <SiteFooter />
    </>
  );
}
