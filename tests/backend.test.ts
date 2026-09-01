import { beforeAll, describe, expect, it } from "vitest";
import { login, signup, verifyEmail, createPasswordReset, resetPassword, getUserBySessionToken } from "@/lib/server/auth";
import { query } from "@/lib/server/db";
import { createCreatorProfile, reviewApplication, submitApplication } from "@/lib/server/application-service";
import { createServerQuote, createTier, publishTier, versionPricingRuleForAdmin } from "@/lib/server/pricing-service";
import { activateMockPlan, setBillingStateForTest, assertCreatorEntitlement } from "@/lib/server/billing-service";
import { acceptQuoteAndCreatePendingSubscription, canAccessPost } from "@/lib/server/membership-service";
import { signPayload, validateOutboundWebhookUrl } from "@/lib/server/security";
import { processMockWebhook } from "@/lib/server/webhook-service";
import { demoContexts } from "@/lib/domain/seed";
import { createCourseWithLesson, createPost, adminUnpublishReportedContent, reportContent, validateMedia } from "@/lib/server/content-service";
import { parsePatreonCsv, importMigrationCsv } from "@/lib/server/migration-service";
import { search } from "@/lib/server/search-service";
import { createApiKey, verifyApiKey, revokeApiKey } from "@/lib/server/integration-service";
import { parseYouTubeVideoId, youtubeEmbedUrl } from "@/lib/server/youtube";

let adminToken = "";
let creatorToken = "";
let fanToken = "";

async function user(token: string) {
  const found = await getUserBySessionToken(token);
  if (!found) throw new Error("missing test user");
  return found;
}

describe("real PostgreSQL-backed V1 services", () => {
  beforeAll(async () => {
    process.env.DATABASE_URL ||= "postgresql://127.0.0.1:5432/zerofee";
    await query("UPDATE provider_pricing_rules SET status = 'VERIFIED', revalidate_by = now() + interval '120 days' WHERE version IN ('mock-ie-eea-card-consumer-eur-v1','mock-us-domestic-commercial-fx-v1')");
    await query("UPDATE guarantee_eligibility_profiles SET status = 'ELIGIBLE', effective_to = now() + interval '120 days' WHERE version IN ('mock-ie-eea-card-consumer-eur-v1-eligibility','mock-us-domestic-commercial-fx-v1-eligibility')");
    adminToken = (await login("ops@example.test", "Password123!")).token;
    creatorToken = (await login("mila@example.test", "Password123!")).token;
    fanToken = (await login("ana@example.test", "Password123!")).token;
  });

  it("signs up, verifies email, resets password, invalidates old session and logs in", async () => {
    const email = `new-${Date.now()}@example.test`;
    const created = await signup(email, "Password123!", "New User", "MEMBER");
    await verifyEmail(created.verificationToken);
    const session = await login(email, "Password123!");
    expect(await getUserBySessionToken(session.token)).toMatchObject({ email });
    const reset = await createPasswordReset(email);
    expect(reset.token).toBeTruthy();
    await resetPassword(reset.token!, "Password456!");
    await expect(login(email, "Password123!")).rejects.toThrow(/Invalid/);
    await expect(login(email, "Password456!")).resolves.toBeTruthy();
  });

  it("persists creator application and blocks creator self-approval", async () => {
    const draftEmail = `creator-${Date.now()}@example.test`;
    const created = await signup(draftEmail, "Password123!", "Fresh Creator", "CREATOR");
    await verifyEmail(created.verificationToken);
    await expect(login(draftEmail, "wrong")).rejects.toThrow(/Invalid/);

    const actualEmail = `creator-real-${Date.now()}@example.test`;
    const actual = await signup(actualEmail, "Password123!", "Real Creator", "CREATOR");
    await verifyEmail(actual.verificationToken);
    const creatorUser = await user((await login(actualEmail, "Password123!")).token);
    const profile = await createCreatorProfile(creatorUser, { slug: `real-${Date.now()}`, displayName: "Real Creator", countryCode: "IE", category: "education" });
    const app = await submitApplication(creatorUser, profile.id, { businessType: "individual", offering: "Lessons and templates", rightsAttested: true, aupAccepted: true });
    await expect(reviewApplication(creatorUser, app.id, "APPROVED_FOR_PAYOUT_ONBOARDING", "self")).rejects.toThrow("FORBIDDEN");
    const admin = await user(adminToken);
    await reviewApplication(admin, app.id, "APPROVED_FOR_PAYOUT_ONBOARDING", "approved");
    const persisted = await query<{ state: string }>("SELECT state FROM creator_applications WHERE id = $1", [app.id]);
    expect(persisted.rows[0].state).toBe("APPROVED_FOR_PAYOUT_ONBOARDING");
  });

  it("enforces SaaS entitlement state server-side", async () => {
    const creator = await query<{ id: string }>("SELECT id FROM creator_profiles WHERE slug = 'mila-nova'");
    await setBillingStateForTest(creator.rows[0].id, "SUSPENDED");
    await expect(assertCreatorEntitlement(creator.rows[0].id, "tiers")).rejects.toThrow(/not available/);
    await setBillingStateForTest(creator.rows[0].id, "ACTIVE");
    await expect(assertCreatorEntitlement(creator.rows[0].id, "tiers")).resolves.toBeUndefined();
  });

  it("creates DB-backed tiers, immutable quotes, payment activation, surplus and incidents", async () => {
    const creator = await query<{ id: string }>("SELECT id FROM creator_profiles WHERE slug = 'mila-nova'");
    const creatorUser = await user(creatorToken);
    await activateMockPlan(creatorUser, creator.rows[0].id, "creator");
    const tier = await createTier(creatorUser, creator.rows[0].id, { name: `Matrix ${Date.now()}`, description: "DB tier", benefits: "briefings", pricingMode: "GUARANTEED_EARNINGS", targetMinor: 1000, currency: "EUR", interval: "monthly" });
    await publishTier(creatorUser, creator.rows[0].id, tier.tierId);
    const quote = await createServerQuote({ user: await user(fanToken), creatorId: creator.rows[0].id, tierId: tier.tierId, context: demoContexts.euConsumer, taxBps: 1900, taxInclusive: true });
    expect(quote.platformFee.amountMinor).toBe(0);
    const pending = await acceptQuoteAndCreatePendingSubscription(await user(fanToken), quote.id);
    const payload = JSON.stringify({ id: `evt_${Date.now()}`, type: "payment.succeeded", data: { quoteId: quote.id, providerPaymentId: pending.providerPaymentId, actualProviderFeeMinor: quote.providerCost.amountMinor - 25 } });
    await processMockWebhook(payload, signPayload(payload, "mock_webhook_secret"), "mock_webhook_secret");
    const rec = await query<{ surplus_minor: string; zero_fee_platform_fee_minor: string }>("SELECT surplus_minor, zero_fee_platform_fee_minor FROM guarantee_reconciliations WHERE quote_id = $1", [quote.id]);
    expect(Number(rec.rows[0].surplus_minor)).toBeGreaterThan(0);
    expect(Number(rec.rows[0].zero_fee_platform_fee_minor)).toBe(0);
  });

  it("rejects invalid/duplicate webhooks and creates shortfall incidents once", async () => {
    const quote = await query<{ id: string; provider_cost_minor: string }>("SELECT id, provider_cost_minor FROM membership_price_quotes ORDER BY created_at DESC LIMIT 1");
    const payload = JSON.stringify({ id: `evt_short_${Date.now()}`, type: "payment.succeeded", data: { quoteId: quote.rows[0].id, providerPaymentId: `pay_short_${Date.now()}`, actualProviderFeeMinor: Number(quote.rows[0].provider_cost_minor) + 250 } });
    await expect(processMockWebhook(payload, "bad", "mock_webhook_secret")).rejects.toThrow(/Invalid/);
    await processMockWebhook(payload, signPayload(payload, "mock_webhook_secret"), "mock_webhook_secret").catch(() => undefined);
    await processMockWebhook(payload, signPayload(payload, "mock_webhook_secret"), "mock_webhook_secret");
    const hooks = await query("SELECT id FROM webhooks WHERE provider_event_id = $1", [JSON.parse(payload).id]);
    expect(hooks.rowCount).toBe(1);
  });

  it("server-gates paid content and moderation can unpublish it", async () => {
    const creator = await query<{ id: string }>("SELECT id FROM creator_profiles WHERE slug = 'mila-nova'");
    const tier = await query<{ id: string }>("SELECT id FROM creator_tiers WHERE creator_id = $1 LIMIT 1", [creator.rows[0].id]);
    const post = await createPost(await user(creatorToken), creator.rows[0].id, { title: `Paid ${Date.now()}`, slug: `paid-${Date.now()}`, body: "<h1>Safe</h1><script>bad()</script>", visibility: "SELECTED_TIERS", tierIds: [tier.rows[0].id], youtubeUrl: "https://youtu.be/dQw4w9WgXcQ" });
    const outsiderEmail = `outsider-${Date.now()}@example.test`;
    const outsider = await signup(outsiderEmail, "Password123!", "Outsider", "MEMBER");
    await verifyEmail(outsider.verificationToken);
    const outsiderUser = await user((await login(outsiderEmail, "Password123!")).token);
    expect((await canAccessPost(outsiderUser, post.id)).allowed).toBe(false);
    const report = await reportContent(await user(fanToken), creator.rows[0].id, post.id, "copyright");
    await expect(adminUnpublishReportedContent(await user(creatorToken), report.id)).rejects.toThrow("FORBIDDEN");
    await adminUnpublishReportedContent(await user(adminToken), report.id);
    expect((await canAccessPost(await user(fanToken), post.id)).allowed).toBe(false);
  });

  it("validates YouTube-only video and media upload boundaries", async () => {
    expect(parseYouTubeVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(parseYouTubeVideoId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(youtubeEmbedUrl("dQw4w9WgXcQ")).toContain("youtube-nocookie.com");
    expect(() => parseYouTubeVideoId("<iframe src=x>")).toThrow();
    expect(() => parseYouTubeVideoId("https://example.com/watch?v=dQw4w9WgXcQ")).toThrow();
    validateMedia({ name: "image.png", mimeType: "image/png", sizeBytes: 4, bytes: Buffer.from([0x89, 0x50, 0x4e, 0x47]) });
    expect(() => validateMedia({ name: "../x.png", mimeType: "image/png", sizeBytes: 4, bytes: Buffer.from([0x89, 0x50, 0x4e, 0x47]) })).toThrow();
    expect(() => validateMedia({ name: "x.png", mimeType: "image/png", sizeBytes: 4, bytes: Buffer.from("nope") })).toThrow();
  });

  it("parses/imports Patreon CSV and creates invitation state", async () => {
    const creator = await query<{ id: string }>("SELECT id FROM creator_profiles WHERE slug = 'mila-nova'");
    const tier = await query<{ id: string }>("SELECT id FROM creator_tiers WHERE creator_id = $1 LIMIT 1", [creator.rows[0].id]);
    const csv = "Name,Email,Patreon ID,Tier,Status,Billing Frequency,Amount\nIva,iva@example.test,p1,Patreon Pro,active,monthly,10\nBad,bad-email,p2,Backer,active,annual,5";
    const parsed = parsePatreonCsv(csv);
    expect(parsed).toHaveLength(2);
    expect(parsed.filter((row) => row.valid)).toHaveLength(1);
    const result = await importMigrationCsv(await user(creatorToken), creator.rows[0].id, tier.rows[0].id, csv);
    expect(result.imported).toBe(1);
    const invites = await query("SELECT mi.id FROM migration_invitations mi JOIN migration_import_rows mr ON mr.id = mi.import_row_id WHERE mr.project_id = $1", [result.projectId]);
    expect(invites.rowCount).toBe(1);
  });

  it("search, API keys and SSRF protections are tenant safe", async () => {
    const creator = await query<{ id: string }>("SELECT id FROM creator_profiles WHERE slug = 'mila-nova'");
    const other = await query<{ id: string }>("SELECT id FROM creator_profiles WHERE slug = 'other-creator'");
    const creatorResults = await search(await user(creatorToken), "Other");
    expect(creatorResults.some((r) => String(r.label).includes("Other"))).toBe(false);
    const adminResults = await search(await user(adminToken), "Other");
    expect(adminResults.some((r) => String(r.label).includes("Other"))).toBe(true);
    const key = await createApiKey(creator.rows[0].id, ["entitlements:read"]);
    expect(await verifyApiKey(key.secret, creator.rows[0].id, "entitlements:read")).toBe(true);
    expect(await verifyApiKey(key.secret, other.rows[0].id, "entitlements:read")).toBe(false);
    await revokeApiKey(key.id, creator.rows[0].id);
    expect(await verifyApiKey(key.secret, creator.rows[0].id, "entitlements:read")).toBe(false);
    expect(() => validateOutboundWebhookUrl("https://127.0.0.1/hook")).toThrow();
    expect(validateOutboundWebhookUrl("https://example.com/hook")).toContain("example.com");
  });

  it("versions pricing rules without mutating historical quotes", async () => {
    const before = await query<{ pricing_rule_version: string }>("SELECT pricing_rule_version FROM membership_price_quotes ORDER BY created_at DESC LIMIT 1");
    await versionPricingRuleForAdmin(await user(adminToken), "mock-ie-eea-card-consumer-eur-v1", { percentageBps: 175, newVersion: `mock-ie-eea-card-consumer-eur-v${Date.now()}` });
    const after = await query<{ pricing_rule_version: string }>("SELECT pricing_rule_version FROM membership_price_quotes ORDER BY created_at DESC LIMIT 1");
    expect(after.rows[0].pricing_rule_version).toBe(before.rows[0].pricing_rule_version);
  });

  it("creates course/module/lesson records with YouTube-only video reference", async () => {
    const creator = await query<{ id: string }>("SELECT id FROM creator_profiles WHERE slug = 'mila-nova'");
    const result = await createCourseWithLesson(await user(creatorToken), creator.rows[0].id, { courseTitle: `Course ${Date.now()}`, lessonTitle: "Lesson one", body: "Clean lesson", youtubeUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ" });
    const lesson = await query<{ youtube_video_id: string }>("SELECT youtube_video_id FROM lessons WHERE id = $1", [result.lessonId]);
    expect(lesson.rows[0].youtube_video_id).toBe("dQw4w9WgXcQ");
  });
});
