"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { ZodError } from "zod";
import { signup, verifyEmail, login, setSessionCookie, logout, createPasswordReset, resetPassword, currentUserFromCookies, changePassword, updateAccountName, signOutEverywhere, reissueVerificationToken } from "@/lib/server/auth";
import { createCreatorProfile, reviewApplication, submitApplication } from "@/lib/server/application-service";
import { activateMockPlan } from "@/lib/server/billing-service";
import { createServerQuote, createTier, publishTier } from "@/lib/server/pricing-service";
import { acceptQuoteAndCreatePendingSubscription, cancelSubscription, changeSubscriptionTier, markSubscriptionRenewal, refundMembershipPayment, requireMemberSubscription, resumeSubscription, simulateDispute, simulateFailedRenewal } from "@/lib/server/membership-service";
import { demoContexts } from "@/lib/domain/seed";
import { query } from "@/lib/server/db";
import { startCreatorPaymentsOnboarding } from "@/lib/server/creator-payments-service";
import { signPayload } from "@/lib/server/security";
import { createPost, createCourseWithLesson, deletePost, reportContent, setPostState, suggestSlug, updatePost } from "@/lib/server/content-service";
import { importMigrationCsv } from "@/lib/server/migration-service";
import { createApiKey, createOutboundWebhook, revokeApiKey } from "@/lib/server/integration-service";
import { randomToken } from "@/lib/server/crypto";
import { assertAdmin, requireCreatorOwner } from "@/lib/server/policies";
import { deleteMedia, uploadMedia, type MediaPurpose } from "@/lib/server/media-service";
import { setProfileImage, setProfilePublished, updateCreatorProfile } from "@/lib/server/profile-service";
import { getEnv } from "@/lib/server/env";
import { absoluteUrl, sendEmail } from "@/lib/server/email";
import { setFlash } from "@/lib/server/flash";
import { safeRedirectPath, UserError } from "@/lib/server/validation";

function value(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

function list(form: FormData, key: string) {
  return form.getAll(key).map((item) => String(item).trim()).filter(Boolean);
}

async function requireCurrentUser() {
  const user = await currentUserFromCookies();
  if (!user) redirect("/login");
  return user;
}

async function clientKey() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

async function backPath(fallback: string) {
  const h = await headers();
  const referer = h.get("referer");
  const host = h.get("host");
  if (!referer || !host) return fallback;
  try {
    const url = new URL(referer);
    if (url.host !== host) return fallback;
    return safeRedirectPath(url.pathname + url.search, fallback);
  } catch {
    return fallback;
  }
}

function errorMessage(error: unknown) {
  if (error instanceof UserError) return error.message;
  if (error instanceof ZodError) return error.issues[0]?.message ?? "Please check the form and try again.";
  if (error instanceof Error) {
    if (error.message === "FORBIDDEN") return "You do not have permission to do that.";
    if (error.message === "UNAUTHENTICATED") return "Please log in to continue.";
    const code = (error as { code?: string }).code;
    if (code === "23505") return "That value is already in use.";
    if (code === "22P02") return "That request was not valid.";
    if (!code && error.message.length <= 140 && !/\b(select|insert|update|delete|relation|column)\b/i.test(error.message)) return error.message;
  }
  return "Something went wrong. Please try again.";
}

/**
 * Runs a server action body. Success sets a one-shot notice and redirects; any failure
 * sets an error notice and returns the user to the form they came from (state preserved by the browser's back target).
 */
async function guarded(fallback: string, body: () => Promise<{ to: string; notice?: string }>) {
  let outcome: { to: string; notice?: string };
  try {
    outcome = await body();
  } catch (error) {
    if (isRedirectError(error)) throw error;
    if (!(error instanceof UserError) && !(error instanceof ZodError)) console.error("[action]", error);
    await setFlash({ type: "error", message: errorMessage(error) });
    redirect(await backPath(fallback));
  }
  if (outcome.notice) await setFlash({ type: "success", message: outcome.notice });
  redirect(outcome.to);
}

function assertMockMode() {
  if (getEnv().CREATOR_PAYMENTS_PROVIDER !== "mock") throw new UserError("This action is only available in test mode");
}

async function deliverToken(kind: "verify" | "reset", email: string, userId: string | null, token: string | null) {
  if (!token) return;
  const path = kind === "verify" ? `/verify-email?token=${encodeURIComponent(token)}` : `/reset-password?token=${encodeURIComponent(token)}`;
  await sendEmail({
    to: email,
    userId,
    subject: kind === "verify" ? "Verify your ZeroFee email" : "Reset your ZeroFee password",
    text: `${kind === "verify" ? "Confirm your email address" : "Choose a new password"}: ${absoluteUrl(path)}\n\nThis link expires soon. If you did not request it, ignore this message.`
  });
}

const devTokenShortcut = () => getEnv().EMAIL_PROVIDER === "mock" && process.env.NODE_ENV !== "production";

export async function signupAction(form: FormData) {
  const role = value(form, "role") === "CREATOR" ? "CREATOR" : "MEMBER";
  await guarded(`/signup?role=${role.toLowerCase()}`, async () => {
    const email = value(form, "email");
    const created = await signup(email, value(form, "password"), value(form, "name"), role, await clientKey());
    await deliverToken("verify", email.toLowerCase(), created.userId, created.verificationToken);
    return { to: devTokenShortcut() ? `/verify-email?token=${encodeURIComponent(created.verificationToken)}&created=1` : "/verify-email?sent=1" };
  });
}

export async function resendVerificationAction(form: FormData) {
  await guarded("/verify-email", async () => {
    const issued = await reissueVerificationToken(value(form, "email"), await clientKey());
    if (issued) await deliverToken("verify", issued.email, issued.userId, issued.token);
    return { to: "/verify-email?sent=1", notice: "If that address needs verification, a new link is on its way." };
  });
}

export async function verifyEmailAction(form: FormData) {
  await guarded("/verify-email", async () => {
    await verifyEmail(value(form, "token"));
    return { to: "/login?verified=1", notice: "Email verified. You can log in now." };
  });
}

export async function loginAction(form: FormData) {
  const next = safeRedirectPath(value(form, "next"), "");
  await guarded(`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`, async () => {
    const session = await login(value(form, "email"), value(form, "password"), await clientKey());
    await setSessionCookie(session.token);
    if (next) return { to: next };
    const user = await currentUserFromCookies();
    const roles = user?.roles ?? [];
    return { to: roles.includes("ADMIN") ? "/admin" : roles.includes("CREATOR") ? "/creator" : "/member" };
  });
}

export async function logoutAction() {
  const jar = await cookies();
  const token = jar.get("zf_session")?.value;
  if (token) await logout(token);
  jar.delete("zf_session");
  redirect("/login?loggedOut=1");
}

export async function forgotPasswordAction(form: FormData) {
  await guarded("/forgot-password", async () => {
    const result = await createPasswordReset(value(form, "email"), await clientKey());
    await deliverToken("reset", result.email, result.userId, result.token);
    return { to: devTokenShortcut() && result.token ? `/reset-password?token=${encodeURIComponent(result.token)}&sent=1` : "/forgot-password?sent=1" };
  });
}

export async function resetPasswordAction(form: FormData) {
  await guarded("/reset-password", async () => {
    await resetPassword(value(form, "token"), value(form, "password"));
    return { to: "/login?reset=1", notice: "Password updated. Log in with your new password." };
  });
}

export async function changePasswordAction(form: FormData) {
  const user = await requireCurrentUser();
  await guarded("/member/account", async () => {
    const token = (await cookies()).get("zf_session")?.value;
    await changePassword(user, String(form.get("currentPassword") ?? ""), String(form.get("newPassword") ?? ""), token);
    return { to: await backPath("/member/account"), notice: "Password changed. Other devices were signed out." };
  });
}

export async function updateAccountNameAction(form: FormData) {
  const user = await requireCurrentUser();
  await guarded("/member/account", async () => {
    await updateAccountName(user, value(form, "name"));
    return { to: await backPath("/member/account"), notice: "Name updated." };
  });
}

export async function signOutEverywhereAction() {
  const user = await requireCurrentUser();
  await signOutEverywhere(user);
  (await cookies()).delete("zf_session");
  redirect("/login?loggedOut=1");
}

export async function submitCreatorApplicationAction(form: FormData) {
  const user = await requireCurrentUser();
  await guarded("/creator/application", async () => {
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
    return { to: "/creator/application?submitted=1", notice: "Application submitted. We will review it shortly." };
  });
}

export async function reviewApplicationAction(form: FormData) {
  const user = await requireCurrentUser();
  await guarded("/admin/applications", async () => {
    await reviewApplication(user, value(form, "applicationId"), value(form, "decision") as "APPROVED_FOR_PAYOUT_ONBOARDING" | "NEEDS_INFORMATION" | "REJECTED", value(form, "note") || "Admin review");
    return { to: "/admin/applications?reviewed=1", notice: "Review saved." };
  });
}

export async function connectPaymentsAction(form: FormData) {
  const user = await requireCurrentUser();
  await guarded("/creator/payments", async () => {
    const state = await startCreatorPaymentsOnboarding(user, value(form, "creatorId"), form.get("existingStripe") === "on");
    return { to: `/creator/payments?connected=1&state=${encodeURIComponent(state.onboardingState)}` };
  });
}

export async function activatePlanAction(form: FormData) {
  const user = await requireCurrentUser();
  await guarded("/creator/billing", async () => {
    await activateMockPlan(user, value(form, "creatorId"), value(form, "planCode") || "creator");
    return { to: "/creator/billing?activated=1", notice: "Plan activated." };
  });
}

export async function createTierAction(form: FormData) {
  const user = await requireCurrentUser();
  await guarded("/creator/tiers/new", async () => {
    const creatorId = value(form, "creatorId");
    const amount = Number(value(form, "amount"));
    if (!Number.isFinite(amount) || amount < 1 || amount > 10000) throw new UserError("Enter a monthly amount between 1 and 10,000");
    const tier = await createTier(user, creatorId, {
      name: value(form, "name"),
      description: value(form, "description"),
      benefits: value(form, "benefits"),
      pricingMode: value(form, "pricingMode") === "SIMPLE_PRICE" ? "SIMPLE_PRICE" : "GUARANTEED_EARNINGS",
      targetMinor: Math.round(amount * 100),
      currency: value(form, "currency") === "USD" ? "USD" : "EUR",
      interval: value(form, "interval") === "annual" ? "annual" : "monthly"
    });
    if (form.get("publish") === "on") await publishTier(user, creatorId, tier.tierId);
    return { to: `/creator/tiers?created=${tier.tierId}`, notice: form.get("publish") === "on" ? "Tier published." : "Tier saved as draft." };
  });
}

async function uploadOptional(user: Awaited<ReturnType<typeof requireCurrentUser>>, creatorId: string, form: FormData, field: string, purpose: MediaPurpose, altText = "") {
  const file = form.get(field);
  if (!(file instanceof File) || !file.size) return null;
  return (await uploadMedia(user, creatorId, file, { purpose, altText })).id;
}

function postInput(form: FormData) {
  const visibility = value(form, "visibility");
  return {
    title: value(form, "title"),
    slug: value(form, "slug"),
    body: value(form, "body"),
    excerpt: value(form, "excerpt"),
    visibility: (visibility === "PUBLIC" ? "PUBLIC" : visibility === "SELECTED_TIERS" ? "SELECTED_TIERS" : "ALL_PAID") as "PUBLIC" | "ALL_PAID" | "SELECTED_TIERS",
    tierIds: list(form, "tierId"),
    youtubeUrl: value(form, "youtubeUrl") || undefined,
    attachmentIds: list(form, "attachmentId")
  };
}

export async function createPostAction(form: FormData) {
  const user = await requireCurrentUser();
  await guarded("/creator/content/new", async () => {
    const creatorId = value(form, "creatorId");
    const coverAssetId = (await uploadOptional(user, creatorId, form, "cover", "POST_COVER", value(form, "coverAlt"))) ?? (value(form, "existingCoverId") || null);
    const draft = form.get("intent") === "draft";
    const input = postInput(form);
    let slug = input.slug;
    if (!slug) {
      const base = suggestSlug(input.title);
      slug = base;
      for (let n = 2; (await query("SELECT 1 FROM posts WHERE creator_id = $1 AND slug = $2", [creatorId, slug])).rowCount && n < 50; n++) slug = `${base}-${n}`;
    }
    await createPost(user, creatorId, { ...input, slug, coverAssetId, state: draft ? "DRAFT" : "PUBLISHED" });
    return { to: "/creator/content?post=created", notice: draft ? "Draft saved." : "Post published." };
  });
}

export async function updatePostAction(form: FormData) {
  const user = await requireCurrentUser();
  const postId = value(form, "postId");
  await guarded(`/creator/content/${postId}`, async () => {
    const creatorId = value(form, "creatorId");
    const uploaded = await uploadOptional(user, creatorId, form, "cover", "POST_COVER", value(form, "coverAlt"));
    const coverAssetId = uploaded ?? (form.get("removeCover") === "on" ? null : value(form, "existingCoverId") || null);
    const { slug: _slug, ...input } = postInput(form);
    void _slug;
    await updatePost(user, creatorId, postId, { ...input, coverAssetId });
    return { to: `/creator/content/${postId}`, notice: "Post saved." };
  });
}

export async function setPostStateAction(form: FormData) {
  const user = await requireCurrentUser();
  await guarded("/creator/content", async () => {
    const state = value(form, "state");
    if (!["DRAFT", "PUBLISHED", "ARCHIVED"].includes(state)) throw new UserError("Unknown post state");
    await setPostState(user, value(form, "creatorId"), value(form, "postId"), state as "DRAFT" | "PUBLISHED" | "ARCHIVED");
    return { to: "/creator/content", notice: state === "PUBLISHED" ? "Post published." : state === "ARCHIVED" ? "Post archived." : "Post moved to drafts." };
  });
}

export async function deletePostAction(form: FormData) {
  const user = await requireCurrentUser();
  await guarded("/creator/content", async () => {
    await deletePost(user, value(form, "creatorId"), value(form, "postId"));
    return { to: "/creator/content", notice: "Post deleted." };
  });
}

export async function createCourseAction(form: FormData) {
  const user = await requireCurrentUser();
  await guarded("/creator/content", async () => {
    await createCourseWithLesson(user, value(form, "creatorId"), {
      courseTitle: value(form, "courseTitle"),
      lessonTitle: value(form, "lessonTitle"),
      body: value(form, "body"),
      youtubeUrl: value(form, "youtubeUrl")
    });
    return { to: "/creator/content?course=created", notice: "Course created." };
  });
}

export async function uploadMediaAction(form: FormData) {
  const user = await requireCurrentUser();
  await guarded("/creator/content", async () => {
    const file = form.get("file");
    if (!(file instanceof File) || !file.size) throw new UserError("Choose a file to upload");
    await uploadMedia(user, value(form, "creatorId"), file, { purpose: "ATTACHMENT", altText: value(form, "altText") });
    return { to: "/creator/content?uploaded=1", notice: "File uploaded to your library." };
  });
}

export async function deleteMediaAction(form: FormData) {
  const user = await requireCurrentUser();
  await guarded("/creator/content", async () => {
    await deleteMedia(user, value(form, "creatorId"), value(form, "assetId"));
    return { to: await backPath("/creator/content"), notice: "File deleted." };
  });
}

export async function updateSellerProfileAction(form: FormData) {
  const user = await requireCurrentUser();
  await guarded("/creator/settings", async () => {
    const creatorId = value(form, "creatorId");
    await requireCreatorOwner(user, creatorId);
    const labels = form.getAll("linkLabel").map(String);
    const urls = form.getAll("linkUrl").map(String);
    await updateCreatorProfile(user, creatorId, {
      displayName: value(form, "displayName"),
      tagline: value(form, "tagline"),
      bio: value(form, "bio"),
      category: value(form, "category"),
      supportEmail: value(form, "supportEmail"),
      websiteUrl: value(form, "websiteUrl"),
      links: labels.map((label, index) => ({ label, url: urls[index] ?? "" }))
    });
    for (const [field, kind, purpose] of [["avatar", "avatar", "AVATAR"], ["banner", "banner", "BANNER"]] as const) {
      const assetId = await uploadOptional(user, creatorId, form, field, purpose, `${value(form, "displayName")} ${kind}`);
      if (assetId) {
        const previous = await setProfileImage(user, creatorId, kind, assetId);
        if (previous) await deleteMedia(user, creatorId, previous).catch(() => undefined);
      } else if (form.get(`remove_${kind}`) === "on") {
        const previous = await setProfileImage(user, creatorId, kind, null);
        if (previous) await deleteMedia(user, creatorId, previous).catch(() => undefined);
      }
    }
    return { to: "/creator/settings", notice: "Seller profile saved." };
  });
}

export async function setPublishedAction(form: FormData) {
  const user = await requireCurrentUser();
  await guarded("/creator/settings", async () => {
    const publish = value(form, "published") === "true";
    await setProfilePublished(user, value(form, "creatorId"), publish);
    return { to: "/creator/settings", notice: publish ? "Your public page is live." : "Your public page is now hidden." };
  });
}

export async function createCheckoutQuoteAction(form: FormData) {
  const tierId = value(form, "tierId");
  await guarded("/", async () => {
    const tier = await query<{ creator_id: string; slug: string }>(
      "SELECT ct.creator_id, cp.slug FROM creator_tiers ct JOIN creator_profiles cp ON cp.id = ct.creator_id WHERE ct.id = $1 AND ct.state = 'PUBLISHED' AND cp.published = true",
      [tierId]
    );
    if (!tier.rowCount) throw new UserError("This membership is no longer available");
    const quote = await createServerQuote({ user: await currentUserFromCookies(), creatorId: tier.rows[0].creator_id, tierId, context: demoContexts.euConsumer, taxBps: 1900, taxInclusive: true });
    return { to: `/checkout/review/${quote.id}` };
  });
}

export async function confirmMockCheckoutAction(form: FormData) {
  const user = await requireCurrentUser();
  const quoteId = value(form, "quoteId");
  await guarded(`/checkout/review/${quoteId}`, async () => {
    assertMockMode();
    const pending = await acceptQuoteAndCreatePendingSubscription(user, quoteId);
    const quote = await query<{ provider_cost_minor: string }>("SELECT provider_cost_minor FROM membership_price_quotes WHERE id = $1", [quoteId]);
    const payload = JSON.stringify({ id: `evt_browser_${Date.now()}`, type: "payment.succeeded", data: { quoteId, providerPaymentId: pending.providerPaymentId, actualProviderFeeMinor: Number(quote.rows[0].provider_cost_minor) } });
    await import("@/lib/server/webhook-service").then((mod) => mod.processMockWebhook(payload, signPayload(payload, "mock_webhook_secret"), "mock_webhook_secret"));
    return { to: "/member/memberships?activated=1", notice: "Membership activated (test mode)." };
  });
}

export async function subscriptionLifecycleAction(form: FormData) {
  const user = await requireCurrentUser();
  await guarded("/member/billing", async () => {
    const action = value(form, "lifecycle");
    const subscriptionId = value(form, "subscriptionId");
    await requireMemberSubscription(user, subscriptionId);
    if (["renew", "fail", "recover"].includes(action)) assertMockMode();
    if (action === "renew") await markSubscriptionRenewal(subscriptionId, true);
    if (action === "fail") await simulateFailedRenewal(subscriptionId);
    if (action === "recover") await markSubscriptionRenewal(subscriptionId, true);
    if (action === "cancel") await cancelSubscription(subscriptionId, true);
    if (action === "resume") await resumeSubscription(subscriptionId);
    return { to: "/member/billing?updated=1", notice: "Membership updated." };
  });
}

export async function changeTierAction(form: FormData) {
  const user = await requireCurrentUser();
  await guarded("/member/billing", async () => {
    await requireMemberSubscription(user, value(form, "subscriptionId"));
    await changeSubscriptionTier(value(form, "subscriptionId"), value(form, "tierId"));
    return { to: "/member/billing?tierChanged=1", notice: "Tier changed." };
  });
}

export async function refundPaymentAction(form: FormData) {
  const user = await requireCurrentUser();
  await guarded("/creator/financial-verification", async () => {
    await refundMembershipPayment(user, value(form, "paymentId"));
    return { to: "/creator/financial-verification?refunded=1", notice: "Refund issued." };
  });
}

export async function disputePaymentAction(form: FormData) {
  const user = await requireCurrentUser();
  await guarded("/admin/guarantee", async () => {
    assertAdmin(user);
    assertMockMode();
    await simulateDispute(value(form, "paymentId"));
    return { to: "/admin/guarantee?dispute=1", notice: "Test dispute created." };
  });
}

export async function importMigrationAction(form: FormData) {
  const user = await requireCurrentUser();
  await guarded("/creator/migration", async () => {
    const result = await importMigrationCsv(user, value(form, "creatorId"), value(form, "tierId"), value(form, "csv"));
    return { to: "/creator/migration?imported=" + result.imported + (result.inviteTokens[0] ? "&invite=" + encodeURIComponent(result.inviteTokens[0]) : "") };
  });
}

export async function createApiKeyAction(form: FormData) {
  const user = await requireCurrentUser();
  await guarded("/creator/api", async () => {
    await requireCreatorOwner(user, value(form, "creatorId"));
    const result = await createApiKey(value(form, "creatorId"), [value(form, "scope") || "entitlements:read"]);
    return { to: `/creator/api?created=${encodeURIComponent(result.secret)}` };
  });
}

export async function revokeApiKeyAction(form: FormData) {
  const user = await requireCurrentUser();
  await guarded("/creator/api", async () => {
    await requireCreatorOwner(user, value(form, "creatorId"));
    await revokeApiKey(value(form, "keyId"), value(form, "creatorId"));
    return { to: "/creator/api?revoked=1", notice: "API key revoked." };
  });
}

export async function createWebhookEndpointAction(form: FormData) {
  const user = await requireCurrentUser();
  await guarded("/creator/api", async () => {
    await requireCreatorOwner(user, value(form, "creatorId"));
    await createOutboundWebhook(value(form, "creatorId"), value(form, "url"), randomToken("zfwh"));
    return { to: "/creator/api?webhook=created", notice: "Webhook endpoint added." };
  });
}

export async function reportPostAction(form: FormData) {
  const user = await requireCurrentUser();
  await guarded("/", async () => {
    const post = await query<{ creator_id: string; slug: string; creator_slug: string }>(
      "SELECT p.creator_id, p.slug, cp.slug AS creator_slug FROM posts p JOIN creator_profiles cp ON cp.id = p.creator_id WHERE p.id = $1 AND p.state = 'PUBLISHED'",
      [value(form, "postId")]
    );
    if (!post.rowCount) throw new UserError("Post not found");
    await reportContent(user, post.rows[0].creator_id, value(form, "postId"), value(form, "reason"));
    return { to: `/c/${post.rows[0].creator_slug}/posts/${post.rows[0].slug}`, notice: "Thanks. Our team will review this report." };
  });
}
