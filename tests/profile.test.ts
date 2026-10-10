import { beforeAll, describe, expect, it } from "vitest";
import { login, signup, verifyEmail, getUserBySessionToken, changePassword, type AuthUser } from "@/lib/server/auth";
import { query } from "@/lib/server/db";
import { createCreatorProfile, reviewApplication, submitApplication } from "@/lib/server/application-service";
import { createPost, updatePost, setPostState, deletePost, getPostForEdit } from "@/lib/server/content-service";
import { canAccessPost } from "@/lib/server/membership-service";
import { creatorOnboarding, getPublishedProfile, setProfileImage, setProfilePublished, updateCreatorProfile } from "@/lib/server/profile-service";
import { deleteMedia, uploadMedia } from "@/lib/server/media-service";
import { createTier } from "@/lib/server/pricing-service";
import { getStorage } from "@/lib/server/storage";

const pngBytes = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(64)]);
const png = (name = "photo.png") => new File([pngBytes], name, { type: "image/png" });

async function userFor(email: string, password = "Password123!") {
  const found = await getUserBySessionToken((await login(email, password)).token);
  if (!found) throw new Error("no user");
  return found;
}

async function newCreator(label: string) {
  const email = `${label}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}@example.test`;
  const created = await signup(email, "Password123!", `${label} Creator`, "CREATOR", `test-${label}`);
  await verifyEmail(created.verificationToken);
  const user = await userFor(email);
  const slug = `${label}-${Date.now().toString(36)}`;
  const profile = await createCreatorProfile(user, { slug, displayName: `${label} Creator`, countryCode: "IE", category: "education" });
  return { email, user, profile, slug };
}

describe("seller profile, content and account security", () => {
  let admin: AuthUser;
  beforeAll(async () => {
    process.env.DATABASE_URL ||= "postgresql://127.0.0.1:5432/zerofee";
    admin = await userFor("ops@example.test");
  });

  it("blocks unverified logins and enforces the password policy", async () => {
    const email = `unverified-${Date.now()}@example.test`;
    await expect(signup(email, "short", "Weak User", "MEMBER", "t1")).rejects.toThrow(/at least 10/);
    await expect(signup("not-an-email", "Password123!", "Bad Email", "MEMBER", "t1")).rejects.toThrow(/valid email/);
    const created = await signup(email, "Password123!", "Unverified", "MEMBER", "t1");
    await expect(login(email, "Password123!", "t1")).rejects.toThrow(/verify your email/i);
    await verifyEmail(created.verificationToken);
    await expect(login(email, "Password123!", "t1")).resolves.toBeTruthy();
    await expect(signup(email, "Password123!", "Duplicate", "MEMBER", "t1")).rejects.toThrow(/already exists/);
  });

  it("rate limits repeated failed logins per account", async () => {
    const email = `ratelimit-${Date.now()}@example.test`;
    const created = await signup(email, "Password123!", "Rate Limit", "MEMBER", "t2");
    await verifyEmail(created.verificationToken);
    for (let i = 0; i < 8; i++) await expect(login(email, "wrong-password", `ip-${i}`)).rejects.toThrow(/Invalid email or password/);
    await expect(login(email, "Password123!", "ip-fresh")).rejects.toThrow(/Too many attempts/);
  });

  it("changes password, invalidating other sessions but keeping the current one", async () => {
    const email = `changepw-${Date.now()}@example.test`;
    const created = await signup(email, "Password123!", "Change Pw", "MEMBER", "t3");
    await verifyEmail(created.verificationToken);
    const first = await login(email, "Password123!", "t3");
    const second = await login(email, "Password123!", "t3");
    const user = (await getUserBySessionToken(first.token))!;
    await expect(changePassword(user, "wrong-current", "NewPassword456!", first.token)).rejects.toThrow(/incorrect/);
    await changePassword(user, "Password123!", "NewPassword456!", first.token);
    expect(await getUserBySessionToken(first.token)).toBeTruthy();
    expect(await getUserBySessionToken(second.token)).toBeNull();
    await expect(login(email, "NewPassword456!", "t3")).resolves.toBeTruthy();
  });

  it("saves seller profile fields and https-only links, and rejects unsafe input", async () => {
    const { user, profile } = await newCreator("profile");
    await updateCreatorProfile(user, profile.id, {
      displayName: "Profile Pro", tagline: "Teaching things", bio: "Para one.\n\nPara two.", category: "education",
      supportEmail: "Help@Example.com", websiteUrl: "https://example.com/me",
      links: [{ label: "Podcast", url: "https://example.com/pod" }, { label: "", url: "" }]
    });
    const row = await query<{ tagline: string; support_email: string; website_url: string; display_name: string }>("SELECT tagline, support_email, website_url, display_name FROM creator_profiles WHERE id = $1", [profile.id]);
    expect(row.rows[0]).toMatchObject({ tagline: "Teaching things", support_email: "help@example.com", website_url: "https://example.com/me", display_name: "Profile Pro" });
    expect((await query("SELECT 1 FROM creator_links WHERE creator_id = $1", [profile.id])).rowCount).toBe(1);
    const base = { displayName: "X Y", tagline: "", bio: "", category: "education", supportEmail: "", websiteUrl: "" };
    await expect(updateCreatorProfile(user, profile.id, { ...base, links: [{ label: "Bad", url: "javascript:alert(1)" }] })).rejects.toThrow(/https/);
    await expect(updateCreatorProfile(user, profile.id, { ...base, links: [{ label: "", url: "https://example.com" }] })).rejects.toThrow(/label/);
    await expect(updateCreatorProfile(user, profile.id, { ...base, tagline: "x".repeat(141), links: [] })).rejects.toThrow(/140/);
    const other = await newCreator("intruder");
    await expect(updateCreatorProfile(other.user, profile.id, { ...base, links: [] })).rejects.toThrow("FORBIDDEN");
  });

  it("gates publishing on approval and a complete profile, then exposes the page", async () => {
    const { user, profile, slug } = await newCreator("publish");
    await expect(setProfilePublished(user, profile.id, true)).rejects.toThrow(/approved/);
    expect(await getPublishedProfile(slug)).toBeNull();
    const application = await submitApplication(user, profile.id, { businessType: "individual", offering: "Weekly lessons and templates", rightsAttested: true, aupAccepted: true });
    await expect(submitApplication(user, profile.id, { businessType: "individual", offering: "Weekly lessons and templates", rightsAttested: true, aupAccepted: true })).rejects.toThrow(/under review/);
    await reviewApplication(admin, application.id, "APPROVED_FOR_PAYOUT_ONBOARDING", "ok");
    await expect(setProfilePublished(user, profile.id, true)).rejects.toThrow(/tagline/);
    await updateCreatorProfile(user, profile.id, { displayName: "Publish Pro", tagline: "Hello", bio: "About me", category: "education", supportEmail: "", websiteUrl: "", links: [] });
    await setProfilePublished(user, profile.id, true);
    expect((await getPublishedProfile(slug))?.display_name).toBe("Publish Pro");
    const steps = await creatorOnboarding(profile.id);
    expect(steps.find((step) => step.key === "application")?.done).toBe(true);
    expect(steps.find((step) => step.key === "live")?.done).toBe(true);
    expect(steps.find((step) => step.key === "payments")?.done).toBe(false);
  });

  it("stores validated images through the storage adapter and enforces ownership", async () => {
    const { user, profile } = await newCreator("media");
    const uploaded = await uploadMedia(user, profile.id, png(), { purpose: "AVATAR", altText: "Me" });
    const row = await query<{ visibility: string; purpose: string; mime_type: string }>("SELECT visibility, purpose, mime_type FROM media_assets WHERE id = $1", [uploaded.id]);
    expect(row.rows[0]).toMatchObject({ visibility: "PUBLIC", purpose: "AVATAR", mime_type: "image/png" });
    expect((await getStorage().get(uploaded.objectKey)).equals(pngBytes)).toBe(true);
    await setProfileImage(user, profile.id, "avatar", uploaded.id);
    await expect(setProfileImage(user, profile.id, "banner", uploaded.id)).rejects.toThrow(/not found/);
    await expect(uploadMedia(user, profile.id, new File([Buffer.from("<svg onload=alert(1)>")], "x.png", { type: "image/png" }), { purpose: "ATTACHMENT" })).rejects.toThrow(/match/);
    const intruder = await newCreator("mediaintruder");
    await expect(uploadMedia(intruder.user, profile.id, png(), { purpose: "ATTACHMENT" })).rejects.toThrow("FORBIDDEN");
    await expect(deleteMedia(intruder.user, intruder.profile.id, uploaded.id)).rejects.toThrow(/not found/);
    await deleteMedia(user, profile.id, uploaded.id);
    await expect(getStorage().get(uploaded.objectKey)).rejects.toThrow();
  });

  it("prevents cross-tenant tier and file references on posts and supports draft, edit, archive and delete", async () => {
    const mine = await newCreator("posts");
    const theirs = await newCreator("postsother");
    const myTier = await createTier(mine.user, mine.profile.id, { name: "Mine", description: "Mine tier", benefits: "things", pricingMode: "SIMPLE_PRICE", targetMinor: 500, currency: "EUR", interval: "monthly" });
    const theirTier = await createTier(theirs.user, theirs.profile.id, { name: "Theirs", description: "Their tier", benefits: "things", pricingMode: "SIMPLE_PRICE", targetMinor: 500, currency: "EUR", interval: "monthly" });
    const theirAsset = await uploadMedia(theirs.user, theirs.profile.id, png(), { purpose: "ATTACHMENT" });
    const base = { title: "Hello world", body: "<p>Body <script>x()</script></p>", visibility: "SELECTED_TIERS" as const };
    await expect(createPost(mine.user, mine.profile.id, { ...base, slug: "hello-world", tierIds: [theirTier.tierId] })).rejects.toThrow(/does not belong/);
    await expect(createPost(mine.user, mine.profile.id, { ...base, slug: "hello-world", tierIds: [] })).rejects.toThrow(/at least one tier/);
    await expect(createPost(mine.user, mine.profile.id, { ...base, slug: "hello-world", tierIds: [myTier.tierId], attachmentIds: [theirAsset.id] })).rejects.toThrow(/not found/);
    await expect(createPost(mine.user, mine.profile.id, { ...base, slug: "Bad Slug!", tierIds: [myTier.tierId] })).rejects.toThrow();
    const post = await createPost(mine.user, mine.profile.id, { ...base, slug: "hello-world", tierIds: [myTier.tierId], state: "DRAFT" });
    await expect(createPost(mine.user, mine.profile.id, { ...base, slug: "hello-world", tierIds: [myTier.tierId] })).rejects.toThrow(/already have a post/);
    const stored = await getPostForEdit(mine.profile.id, post.id);
    expect(stored?.body).not.toContain("script");
    expect(stored?.state).toBe("DRAFT");
    expect((await canAccessPost(null, post.id)).allowed).toBe(false);
    expect((await canAccessPost(mine.user, post.id)).allowed).toBe(true);
    await expect(updatePost(theirs.user, theirs.profile.id, post.id, { title: "Hijack", body: "x", visibility: "PUBLIC" })).rejects.toThrow(/not found/);
    await updatePost(mine.user, mine.profile.id, post.id, { title: "Edited", body: "New body", visibility: "PUBLIC" });
    await setPostState(mine.user, mine.profile.id, post.id, "PUBLISHED");
    expect((await canAccessPost(null, post.id)).allowed).toBe(true);
    await setPostState(mine.user, mine.profile.id, post.id, "ARCHIVED");
    expect((await canAccessPost(null, post.id)).allowed).toBe(false);
    await expect(deletePost(theirs.user, theirs.profile.id, post.id)).rejects.toThrow(/not found/);
    await deletePost(mine.user, mine.profile.id, post.id);
    expect(await getPostForEdit(mine.profile.id, post.id)).toBeNull();
  });
});
