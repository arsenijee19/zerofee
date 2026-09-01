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
  createRecurringDirectChargeSubscription(input: { connectedAccountId: string; customerEmail: string; amountMinor: number; currency: string; interval: "month" | "year"; applicationFeeMinor: 0; quoteId: string; tierName: string }): Promise<{ providerCustomerId: string; providerPriceId: string; providerSubscriptionId: string; providerInvoiceId: string; providerPaymentId: string }>;
  refundPayment(input: { connectedAccountId: string; providerPaymentId: string; amountMinor?: number; idempotencyKey: string }): Promise<{ refundId: string; status: string }>;
  getActualProviderFee(input: { connectedAccountId: string; providerPaymentId: string }): Promise<{ actualProviderFeeMinor: number; providerTransactionReference: string }>;
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

  async createRecurringDirectChargeSubscription(input: { connectedAccountId: string; customerEmail: string; amountMinor: number; currency: string; interval: "month" | "year"; applicationFeeMinor: 0; quoteId: string; tierName: string }) {
    if (input.applicationFeeMinor !== 0) throw new Error("ZeroFee application fee must be 0");
    return {
      providerCustomerId: `cus_mock_${randomToken("cus").slice(4, 14)}`,
      providerPriceId: `price_mock_${input.amountMinor}_${input.interval}`,
      providerSubscriptionId: `sub_mock_${randomToken("sub").slice(4, 14)}`,
      providerInvoiceId: `in_mock_${randomToken("in").slice(3, 13)}`,
      providerPaymentId: `pay_mock_${input.quoteId.slice(0, 8)}`
    };
  }

  async refundPayment(_input: { connectedAccountId: string; providerPaymentId: string; amountMinor?: number; idempotencyKey: string }) {
    return { refundId: `refund_mock_${randomToken("r").slice(2, 12)}`, status: "succeeded" };
  }

  async getActualProviderFee(input: { providerPaymentId: string }) {
    return { actualProviderFeeMinor: 0, providerTransactionReference: input.providerPaymentId };
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
      country: input.country,
      email: input.email,
      controller: {
        stripe_dashboard: { type: "full" },
        fees: { payer: "account" },
        losses: { payments: "stripe" },
        requirement_collection: "stripe"
      },
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

  async createRecurringDirectChargeSubscription(input: { connectedAccountId: string; customerEmail: string; amountMinor: number; currency: string; interval: "month" | "year"; applicationFeeMinor: 0; quoteId: string; tierName: string }) {
    if (input.applicationFeeMinor !== 0) throw new Error("ZeroFee application fee must be 0");
    const customer = await this.stripe.customers.create({ email: input.customerEmail, metadata: { quoteId: input.quoteId } }, { stripeAccount: input.connectedAccountId });
    const product = await this.stripe.products.create({ name: input.tierName, metadata: { quoteId: input.quoteId } }, { stripeAccount: input.connectedAccountId });
    const price = await this.stripe.prices.create(
      {
        unit_amount: input.amountMinor,
        currency: input.currency.toLowerCase(),
        recurring: { interval: input.interval },
        product: product.id,
        metadata: { quoteId: input.quoteId }
      },
      { stripeAccount: input.connectedAccountId }
    );
    const subscription = await this.stripe.subscriptions.create(
      {
        customer: customer.id,
        items: [{ price: price.id }],
        payment_behavior: "default_incomplete",
        application_fee_percent: 0,
        payment_settings: { save_default_payment_method: "on_subscription" },
        expand: ["latest_invoice.payment_intent"],
        metadata: { quoteId: input.quoteId }
      },
      { stripeAccount: input.connectedAccountId }
    );
    const invoice = subscription.latest_invoice as Stripe.Invoice | null;
    const paymentIntent = invoice?.payment_intent as Stripe.PaymentIntent | null;
    return {
      providerCustomerId: customer.id,
      providerPriceId: price.id,
      providerSubscriptionId: subscription.id,
      providerInvoiceId: invoice?.id ?? "",
      providerPaymentId: paymentIntent?.id ?? ""
    };
  }

  async refundPayment(input: { connectedAccountId: string; providerPaymentId: string; amountMinor?: number; idempotencyKey: string }) {
    const refund = await this.stripe.refunds.create(
      { payment_intent: input.providerPaymentId, amount: input.amountMinor },
      { stripeAccount: input.connectedAccountId, idempotencyKey: input.idempotencyKey }
    );
    return { refundId: refund.id, status: refund.status ?? "pending" };
  }

  async getActualProviderFee(input: { connectedAccountId: string; providerPaymentId: string }) {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(input.providerPaymentId, { expand: ["latest_charge.balance_transaction"] }, { stripeAccount: input.connectedAccountId });
    const charge = typeof paymentIntent.latest_charge === "object" && paymentIntent.latest_charge ? paymentIntent.latest_charge : null;
    if (!charge) throw new Error("Stripe charge is not available yet");
    const balanceTransaction = charge && typeof charge.balance_transaction === "object" && charge.balance_transaction ? charge.balance_transaction : null;
    if (!balanceTransaction || typeof balanceTransaction.fee !== "number") throw new Error("Stripe balance transaction fee is not available yet");
    return { actualProviderFeeMinor: balanceTransaction.fee, providerTransactionReference: charge.id };
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
