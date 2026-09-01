import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getEnv } from "@/lib/server/env";
import { processStripeWebhook } from "@/lib/server/webhook-service";

export async function POST(request: Request) {
  const env = getEnv();
  if (!env.STRIPE_WEBHOOK_SECRET || !env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe webhook not configured" }, { status: 503 });
  }
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });

  try {
    const stripe = new Stripe(env.STRIPE_SECRET_KEY);
    const event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
    await processStripeWebhook(event);
    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid Stripe webhook" }, { status: 400 });
  }
}
