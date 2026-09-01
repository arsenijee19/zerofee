import Link from "next/link";
import { confirmMockCheckoutAction } from "@/app/actions";
import { Panel, PublicHeader, Metric } from "@/components/route-ui";
import { query } from "@/lib/server/db";
import { currentUserFromCookies } from "@/lib/server/auth";
import { formatMoney, money } from "@/lib/money";

export default async function CheckoutReviewPage({ params }: { params: Promise<{ quoteId: string }> }) {
  const { quoteId } = await params;
  const quote = await query<{ retail_minor: string; tax_minor: string; provider_cost_minor: string; modeled_creator_proceeds_minor: string; currency: "EUR" | "USD"; status: string; creator_name: string; tier_name: string }>(
    `SELECT q.retail_minor,q.tax_minor,q.provider_cost_minor,q.modeled_creator_proceeds_minor,q.currency,q.status,cp.display_name AS creator_name,ct.name AS tier_name FROM membership_price_quotes q JOIN creator_profiles cp ON cp.id=q.creator_id JOIN creator_tiers ct ON ct.id=q.tier_id WHERE q.id=$1`, [quoteId]
  );
  const user = await currentUserFromCookies();
  if (!quote.rowCount) return <><PublicHeader user={user} /><main className="section"><Panel title="Quote unavailable"><p>The quote may have expired or already been used.</p></Panel></main></>;
  const row = quote.rows[0];
  return <><PublicHeader user={user} /><main className="section"><div className="checkout-card"><p className="eyebrow">Checkout review</p><h1>{row.tier_name}</h1><p>Membership from {row.creator_name}. This is the server-generated final quote.</p><div className="metric-grid"><Metric title="Customer pays" value={formatMoney(money(Number(row.retail_minor), row.currency))} tone="info" /><Metric title="Tax" value={formatMoney(money(Number(row.tax_minor), row.currency))} /><Metric title="Provider cost" value={formatMoney(money(Number(row.provider_cost_minor), row.currency))} /><Metric title="ZeroFee fee" value={formatMoney(money(0, row.currency))} tone="success" /></div>{user ? <form action={confirmMockCheckoutAction}><input type="hidden" name="quoteId" value={quoteId} /><button className="primary-button large">Confirm test subscription</button></form> : <Link className="primary-button large" href={`/login?next=/checkout/review/${quoteId}`}>Log in to continue</Link>}<p className="muted">TEST MODE: no live charge is created.</p></div></main></>;
}
