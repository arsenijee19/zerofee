import Stripe from "stripe";
import { getEnv } from "@/lib/server/env";
import { randomToken } from "@/lib/server/crypto";

export type ConnectedAccountState = {
  provider: "mock" | "stripe";
  externalAccountId: string;
  onboardingUrl: string;
  onboardingState: "REQUIREMENTS_DUE" | "READY";
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  dashboardUrl?: string;
};

export interface CreatorPaymentsProvider {
  createOrRetrieveConnectedAccount(input: { creatorId: string; email: string; country: string; existingStripeAccount?: boolean }): Promise<ConnectedAccountState>;
  createDirectChargeSubscription(input: { connectedAccountId: string; customerEmail: string; amountMinor: number; currency: string; applicationFeeMinor: 0; quoteId: string }): Promise<{ providerSubscriptionId: string; providerPaymentId: string }>;
  refundPayment(input: { connectedAccountId: string; providerPaymentId: string; amountMinor?: number; idempotencyKey: string }): Promise<{ refundId: string; status: string }>;
  getBalances(input: { connectedAccountId: string }): Promise<{ availableMinor: number; pendingMinor: number; currency: string }>;
}

export class MockCreatorPaymentsProvider implements CreatorPaymentsProvider {
  async createOrRetrieveConnectedAccount(input: { creatorId: string; email: string; country: string }) {
    return {
      provider: "mock" as const,
      externalAccountId: `acct_mock_${input.creatorId.slice(0, 8)}`,
      onboardingUrl: `/api/mock/connect/onboarding/${input.creatorId}`,
      onboardingState: "READY" as const,
      chargesEnabled: true,
      payoutsEnabled: true,
      dashboardUrl: `/api/mock/connect/dashboard/${input.creatorId}`
    };
  }

  async createDirectChargeSubscription(input: { connectedAccountId: string; customerEmail: string; amountMinor: number; currency: string; applicationFeeMinor: 0; quoteId: string }) {
    if (input.applicationFeeMinor !== 0) throw new Error("ZeroFee application fee must be 0");
    return {
      providerSubscriptionId: `sub_mock_${randomToken("sub").slice(4, 14)}`,
      providerPaymentId: `pay_mock_${input.quoteId.slice(0, 8)}`
    };
  }

  async refundPayment(_input: { connectedAccountId: string; providerPaymentId: string; amountMinor?: number; idempotencyKey: string }) {
    return { refundId: `refund_mock_${randomToken("r").slice(2, 12)}`, status: "succeeded" };
  }

  async getBalances() {
    return { availableMinor: 241030, pendingMinor: 31870, currency: "EUR" };
  }
}

export class StripeCreatorPaymentsProvider implements CreatorPaymentsProvider {
  private stripe: Stripe;

  constructor(secret = getEnv().STRIPE_SECRET_KEY) {
    if (!secret) throw new Error("STRIPE_SECRET_KEY is required for Stripe provider");
    this.stripe = new Stripe(secret);
  }

  async createOrRetrieveConnectedAccount(input: { creatorId: string; email: string; country: string; existingStripeAccount?: boolean }) {
    const account = await this.stripe.accounts.create({
      type: "express",
      country: input.country,
      email: input.email,
      capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
      metadata: { creatorId: input.creatorId, existingStripeRequested: String(Boolean(input.existingStripeAccount)) }
    });
    const link = await this.stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${getEnv().APP_URL}/creator/payments/onboarding/refresh`,
      return_url: `${getEnv().APP_URL}/creator/payments/onboarding/return`,
      type: "account_onboarding"
    });
    return {
      provider: "stripe" as const,
      externalAccountId: account.id,
      onboardingUrl: link.url,
      onboardingState: account.charges_enabled && account.payouts_enabled ? "READY" as const : "REQUIREMENTS_DUE" as const,
      chargesEnabled: Boolean(account.charges_enabled),
      payoutsEnabled: Boolean(account.payouts_enabled),
      dashboardUrl: undefined
    };
  }

  async createDirectChargeSubscription(input: { connectedAccountId: string; customerEmail: string; amountMinor: number; currency: string; applicationFeeMinor: 0; quoteId: string }) {
    if (input.applicationFeeMinor !== 0) throw new Error("ZeroFee application fee must be 0");
    const customer = await this.stripe.customers.create({ email: input.customerEmail, metadata: { quoteId: input.quoteId } }, { stripeAccount: input.connectedAccountId });
    const paymentIntent = await this.stripe.paymentIntents.create(
      {
        amount: input.amountMinor,
        currency: input.currency.toLowerCase(),
        customer: customer.id,
        confirm: false,
        automatic_payment_methods: { enabled: true },
        application_fee_amount: 0,
        metadata: { quoteId: input.quoteId }
      },
      { stripeAccount: input.connectedAccountId }
    );
    return { providerSubscriptionId: `pi_subscription_context_${paymentIntent.id}`, providerPaymentId: paymentIntent.id };
  }

  async refundPayment(input: { connectedAccountId: string; providerPaymentId: string; amountMinor?: number; idempotencyKey: string }) {
    const refund = await this.stripe.refunds.create(
      { payment_intent: input.providerPaymentId, amount: input.amountMinor },
      { stripeAccount: input.connectedAccountId, idempotencyKey: input.idempotencyKey }
    );
    return { refundId: refund.id, status: refund.status ?? "pending" };
  }

  async getBalances(input: { connectedAccountId: string }) {
    const balance = await this.stripe.balance.retrieve({ stripeAccount: input.connectedAccountId });
    const available = balance.available[0];
    const pending = balance.pending[0];
    return { availableMinor: available?.amount ?? 0, pendingMinor: pending?.amount ?? 0, currency: (available?.currency ?? pending?.currency ?? "eur").toUpperCase() };
  }
}

export function getCreatorPaymentsProvider(): CreatorPaymentsProvider {
  return getEnv().CREATOR_PAYMENTS_PROVIDER === "stripe" ? new StripeCreatorPaymentsProvider() : new MockCreatorPaymentsProvider();
}
