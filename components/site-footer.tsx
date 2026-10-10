import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <Link className="brand" href="/"><span className="brand-mark">Z</span><span>ZeroFee</span></Link>
          <p>Creators choose what they earn. ZeroFee takes 0% of membership revenue.</p>
          <span className="test-badge">TEST MODE</span>
        </div>
        <nav aria-label="Product">
          <h2>Product</h2>
          <Link href="/how-it-works">How it works</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/migration">Migration from Patreon</Link>
          <Link href="/creators">Browse creators</Link>
        </nav>
        <nav aria-label="Trust">
          <h2>Trust</h2>
          <Link href="/safety">Safety and verification</Link>
          <Link href="/acceptable-use">Acceptable use</Link>
          <Link href="/refunds">Refunds</Link>
        </nav>
        <nav aria-label="Legal">
          <h2>Legal</h2>
          <Link href="/terms">Terms of service</Link>
          <Link href="/privacy">Privacy policy</Link>
          <Link href="/login">Log in</Link>
          <Link href="/signup?role=creator">Start as a creator</Link>
        </nav>
      </div>
      <p className="footer-note">© {new Date().getFullYear()} ZeroFee. Test mode: no live charges are created.</p>
    </footer>
  );
}
