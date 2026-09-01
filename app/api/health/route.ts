import { NextResponse } from "next/server";
import { query } from "@/lib/server/db";
import { getEnv } from "@/lib/server/env";

export async function GET() {
  const db = await query("SELECT 1 AS ok");
  const env = getEnv();
  return NextResponse.json({
    app: "ok",
    db: db.rows[0].ok === 1 ? "reachable" : "unknown",
    creatorPaymentsProvider: env.CREATOR_PAYMENTS_PROVIDER,
    platformBillingProvider: env.PLATFORM_BILLING_PROVIDER,
    taxProvider: env.TAX_PROVIDER,
    stripeLiveConfigured: Boolean(env.STRIPE_SECRET_KEY),
    mode: env.CREATOR_PAYMENTS_PROVIDER === "mock" ? "TEST_MODE" : "PROVIDER_MODE"
  });
}
