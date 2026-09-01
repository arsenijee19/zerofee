"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signup, verifyEmail, login, setSessionCookie, logout, createPasswordReset, resetPassword, currentUserFromCookies } from "@/lib/server/auth";
import { createCreatorProfile, reviewApplication, submitApplication } from "@/lib/server/application-service";
import { activateMockPlan } from "@/lib/server/billing-service";
import { createServerQuote, createTier, publishTier } from "@/lib/server/pricing-service";
import { acceptQuoteAndCreatePendingSubscription, activateFromProviderPayment, cancelSubscription, changeSubscriptionTier, markSubscriptionRenewal, refundMembershipPayment, requireMemberSubscription, resumeSubscription, simulateDispute, simulateFailedRenewal } from "@/lib/server/membership-service";
import { demoContexts } from "@/lib/domain/seed";
import { query } from "@/lib/server/db";
import { startCreatorPaymentsOnboarding } from "@/lib/server/creator-payments-service";
import { signPayload } from "@/lib/server/security";
import { createPost, createCourseWithLesson } from "@/lib/server/content-service";
import { importMigrationCsv } from "@/lib/server/migration-service";
import { createApiKey, createOutboundWebhook, revokeApiKey } from "@/lib/server/integration-service";
import { randomToken } from "@/lib/server/crypto";
import { assertAdmin, requireCreatorOwner } from "@/lib/server/policies";
import { uploadMedia } from "@/lib/server/media-service";

function value(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

async function requireCurrentUser() {
  const user = await currentUserFromCookies();
  if (!user) redirect("/login");
  return user;
}

export async function signupAction(form: FormData) {
  const role = value(form, "role") === "CREATOR" ? "CREATOR" : "MEMBER";
  const created = await signup(value(form, "email"), value(form, "password"), value(form, "name"), role);
  redirect(`/verify-email?token=${encodeURIComponent(created.verificationToken)}&created=1`);
}

export async function verifyEmailAction(form: FormData) {
  await verifyEmail(value(form, "token"));
  redirect("/login?verified=1");
}

export async function loginAction(form: FormData) {
  const session = await login(value(form, "email"), value(form, "password"));
  await setSessionCookie(session.token);
  const next = value(form, "next") || "/member";
  redirect(next);
}

export async function logoutAction() {
  const jar = await cookies();
  const token = jar.get("zf_session")?.value;
  if (token) await logout(token);
  jar.delete("zf_session");
  redirect("/login?loggedOut=1");
}

export async function forgotPasswordAction(form: FormData) {
  await createPasswordReset(value(form, "email"));
  redirect("/forgot-password?sent=1");
}

export async function resetPasswordAction(form: FormData) {
  await resetPassword(value(form, "token"), value(form, "password"));
  redirect("/login?reset=1");
}

export async function submitCreatorApplicationAction(form: FormData) {
  const user = await requireCurrentUser();
  const profile = await createCreatorProfile(user, {
    slug: value(form, "slug"),
    displayName: value(form, "displayName"),
    countryCode: value(form, "countryCode"),
    category: value(form, "category")
  });
  await submitApplication(user, profile.id, {
    businessType: value(form, "businessType") === "company" ? "company" : "individual",
    offering: value(form, "offering"),
    rightsAttested: form.get("rightsAttested") === "on",
    aupAccepted: form.get("aupAccepted") === "on"
  });
  redirect("/creator/application?submitted=1");
}

export async function reviewApplicationAction(form: FormData) {
  const user = await requireCurrentUser();
  await reviewApplication(user, value(form, "applicationId"), value(form, "decision") as "APPROVED_FOR_PAYOUT_ONBOARDING" | "NEEDS_INFORMATION" | "REJECTED", value(form, "note") || "Admin review");
  redirect("/admin/applications?reviewed=1");
}

export async function connectPaymentsAction(form: FormData) {
  const user = await requireCurrentUser();
  const state = await startCreatorPaymentsOnboarding(user, value(form, "creatorId"), form.get("existingStripe") === "on");
  redirect(`/creator/payments?connected=1&state=${state.onboardingState}`);
}

export async function activatePlanAction(form: FormData) {
  const user = await requireCurrentUser();
  await activateMockPlan(user, value(form, "creatorId"), value(form, "planCode") || "creator");
  redirect("/creator/billing?activated=1");
}

export async function createTierAction(form: FormData) {
  const user = await requireCurrentUser();
  const creatorId = value(form, "creatorId");
  const tier = await createTier(user, creatorId, {
    name: value(form, "name"),
    description: value(form, "description"),
    benefits: value(form, "benefits"),
    pricingMode: value(form, "pricingMode") === "SIMPLE_PRICE" ? "SIMPLE_PRICE" : "GUARANTEED_EARNINGS",
    targetMinor: Math.round(Number(value(form, "amount")) * 100),
    currency: value(form, "currency") === "USD" ? "USD" : "EUR",
    interval: value(form, "interval") === "annual" ? "annual" : "monthly"
  });
  if (form.get("publish") === "on") await publishTier(user, creatorId, tier.tierId);
  redirect(`/creator/tiers?created=${tier.tierId}`);
}

export async function createPostAction(form: FormData) {
  const user = await requireCurrentUser();
  await createPost(user, value(form, "creatorId"), {
    title: value(form, "title"),
    slug: value(form, "slug"),
    body: value(form, "body"),
    visibility: value(form, "visibility") === "PUBLIC" ? "PUBLIC" : value(form, "visibility") === "SELECTED_TIERS" ? "SELECTED_TIERS" : "ALL_PAID",
    tierIds: value(form, "tierId") ? [value(form, "tierId")] : [],
    youtubeUrl: value(form, "youtubeUrl") || undefined
  });
  redirect("/creator/content?post=created");
}

export async function createCourseAction(form: FormData) {
  const user = await requireCurrentUser();
  await createCourseWithLesson(user, value(form, "creatorId"), {
    courseTitle: value(form, "courseTitle"),
    lessonTitle: value(form, "lessonTitle"),
    body: value(form, "body"),
    youtubeUrl: value(form, "youtubeUrl")
  });
  redirect("/creator/content?course=created");
}

export async function uploadMediaAction(form: FormData) {
  const user = await requireCurrentUser();
  const file = form.get("file");
  if (!(file instanceof File) || !file.size) throw new Error("Media file is required");
  await uploadMedia(user, value(form, "creatorId"), file);
  redirect("/creator/content?uploaded=1");
}

export async function createCheckoutQuoteAction(form: FormData) {
  const tier = await query<{ creator_id: string }>("SELECT creator_id FROM creator_tiers WHERE id = $1 AND state = 'PUBLISHED'", [value(form, "tierId")]);
  if (!tier.rowCount) throw new Error("Tier not found");
  const quote = await createServerQuote({ user: await currentUserFromCookies(), creatorId: tier.rows[0].creator_id, tierId: value(form, "tierId"), context: demoContexts.euConsumer, taxBps: 1900, taxInclusive: true });
  redirect(`/checkout/review/${quote.id}`);
}

export async function confirmMockCheckoutAction(form: FormData) {
  const user = await requireCurrentUser();
  const pending = await acceptQuoteAndCreatePendingSubscription(user, value(form, "quoteId"));
  const quote = await query<{ provider_cost_minor: string }>("SELECT provider_cost_minor FROM membership_price_quotes WHERE id = $1", [value(form, "quoteId")]);
  const payload = JSON.stringify({ id: `evt_browser_${Date.now()}`, type: "payment.succeeded", data: { quoteId: value(form, "quoteId"), providerPaymentId: pending.providerPaymentId, actualProviderFeeMinor: Number(quote.rows[0].provider_cost_minor) } });
  await import("@/lib/server/webhook-service").then((mod) => mod.processMockWebhook(payload, signPayload(payload, "mock_webhook_secret"), "mock_webhook_secret"));
  redirect("/member/memberships?activated=1");
}

export async function subscriptionLifecycleAction(form: FormData) {
  const user = await requireCurrentUser();
  const action = value(form, "lifecycle");
  const subscriptionId = value(form, "subscriptionId");
  await requireMemberSubscription(user, subscriptionId);
  if (action === "renew") await markSubscriptionRenewal(subscriptionId, true);
  if (action === "fail") await simulateFailedRenewal(subscriptionId);
  if (action === "recover") await markSubscriptionRenewal(subscriptionId, true);
  if (action === "cancel") await cancelSubscription(subscriptionId, true);
  if (action === "resume") await resumeSubscription(subscriptionId);
  redirect("/member/billing?updated=1");
}

export async function changeTierAction(form: FormData) {
  const user = await requireCurrentUser();
  await requireMemberSubscription(user, value(form, "subscriptionId"));
  await changeSubscriptionTier(value(form, "subscriptionId"), value(form, "tierId"));
  redirect("/member/billing?tierChanged=1");
}

export async function refundPaymentAction(form: FormData) {
  const user = await requireCurrentUser();
  await refundMembershipPayment(user, value(form, "paymentId"));
  redirect("/creator/financial-verification?refunded=1");
}

export async function disputePaymentAction(form: FormData) {
  const user = await requireCurrentUser();
  assertAdmin(user);
  await simulateDispute(value(form, "paymentId"));
  redirect("/admin/guarantee?dispute=1");
}

export async function importMigrationAction(form: FormData) {
  const user = await requireCurrentUser();
  const result = await importMigrationCsv(user, value(form, "creatorId"), value(form, "tierId"), value(form, "csv"));
  redirect("/creator/migration?imported=" + result.imported + (result.inviteTokens[0] ? "&invite=" + encodeURIComponent(result.inviteTokens[0]) : ""));
}

export async function createApiKeyAction(form: FormData) {
  const user = await requireCurrentUser();
  await requireCreatorOwner(user, value(form, "creatorId"));
  const result = await createApiKey(value(form, "creatorId"), [value(form, "scope") || "entitlements:read"]);
  redirect(`/creator/api?created=${encodeURIComponent(result.secret)}`);
}

export async function revokeApiKeyAction(form: FormData) {
  const user = await requireCurrentUser();
  await requireCreatorOwner(user, value(form, "creatorId"));
  await revokeApiKey(value(form, "keyId"), value(form, "creatorId"));
  redirect("/creator/api?revoked=1");
}

export async function createWebhookEndpointAction(form: FormData) {
  const user = await requireCurrentUser();
  await requireCreatorOwner(user, value(form, "creatorId"));
  await createOutboundWebhook(value(form, "creatorId"), value(form, "url"), randomToken("zfwh"));
  redirect("/creator/api?webhook=created");
}
