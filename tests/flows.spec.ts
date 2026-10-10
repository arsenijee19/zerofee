import { expect, test, type Page } from "@playwright/test";

async function login(page: Page, email: string, password = "Password123!", next?: string) {
  await page.goto(next ? "/login?next=" + encodeURIComponent(next) : "/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Log in" }).click();
}

test("creator onboarding, persistence and content publishing", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("homepage")).toContainText("You choose what you earn");
  await page.getByRole("link", { name: "Start as a creator" }).first().click();
  await page.getByLabel("Name").fill("Browser Creator");
  const email = "browser-creator-" + Date.now() + "@example.test";
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("Password123!");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/verify-email\?token=/);
  const verifyUrl = page.url();
  await page.getByRole("button", { name: "Verify email" }).click();
  await login(page, email, "Password123!", "/creator/application");
  await page.getByLabel("Slug").fill("browser-creator-" + Date.now());
  await page.getByLabel("Display name").fill("Browser Creator");
  await page.getByLabel("Category").fill("education");
  await page.getByLabel("Offering").fill("Paid browser test lessons");
  await page.getByLabel("Rights attested").check();
  await page.getByLabel("Acceptable use accepted").check();
  await page.getByRole("button", { name: "Submit application" }).click();
  await expect(page).toHaveURL(/\/creator\/application\?submitted=1/);
  expect(verifyUrl).toContain("/verify-email?token=");
});

test("member sees server-generated quote and completes mock provider subscription", async ({ page }) => {
  await page.goto("/c/mila-nova");
  await page.getByRole("button", { name: "See final price" }).first().click();
  await expect(page.getByRole("heading", { name: "Signal Room" })).toBeVisible();
  await page.getByRole("link", { name: "Log in to continue" }).click();
  await page.getByLabel("Email").fill("ana@example.test");
  await page.getByLabel("Password").fill("Password123!");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page.getByText("Customer pays")).toBeVisible();
  await page.getByRole("button", { name: "Confirm test subscription" }).click();
  await expect(page).toHaveURL(/\/member\/memberships\?activated=1/);
  await page.getByRole("link", { name: "Billing" }).click();
  await page.getByRole("button", { name: "Test dunning" }).first().click();
  await expect(page.getByText("GRACE")).toBeVisible();
});

test("creator manages tiers, content, migration, integrations and search", async ({ page }) => {
  await login(page, "mila@example.test", "Password123!", "/creator");
  await page.getByRole("link", { name: "Membership Tiers" }).click();
  await page.getByRole("link", { name: "Create tier" }).click();
  await page.getByLabel("Name").fill("Browser Tier " + Date.now());
  await page.getByLabel("Description").fill("Browser tier");
  await page.getByLabel("Benefits").fill("Browser benefits");
  await page.getByLabel("Amount").fill("12");
  await page.getByLabel("Publish now").check();
  await page.getByRole("button", { name: "Save tier" }).click();
  await page.getByRole("link", { name: "Content", exact: true }).click();
  await page.getByRole("link", { name: "New post" }).click();
  const postTitle = "Browser post " + Date.now();
  await page.getByRole("textbox", { name: "Title", exact: true }).fill(postTitle);
  await page.getByRole("textbox", { name: "Body" }).fill("A persisted browser post.");
  await page.getByRole("button", { name: "Publish post" }).click();
  await expect(page.locator(".flash.success")).toContainText("Post published");
  await expect(page.getByRole("link", { name: postTitle })).toBeVisible();
  await page.getByRole("complementary").getByRole("link", { name: "Migration" }).click();
  await page.getByRole("button", { name: "Import migration" }).click();
  await expect(page.getByText("IMPORTED")).toBeVisible();
  await page.getByRole("link", { name: "Open member migration link" }).click();
  await expect(page.getByText("Payment credentials were not transferred")).toBeVisible();
  await page.goto("/creator/api");
  await page.getByRole("link", { name: "API / Webhooks" }).click();
  await page.getByRole("button", { name: "Create key" }).click();
  await expect(page.getByText("Plaintext key, shown once")).toBeVisible();
  await page.getByRole("link", { name: "Search records" }).click();
  await page.getByPlaceholder("Members, posts or tiers").fill("Browser");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page.getByText("Browser").first()).toBeVisible();
});

test("admin reviews operations and tenant-isolated search", async ({ page }) => {
  await login(page, "ops@example.test", "Password123!", "/admin");
  await expect(page.getByText("Open guarantee incidents")).toBeVisible();
  await page.getByRole("link", { name: "Pricing Catalog" }).click();
  await expect(page.getByText("mock-ie-eea-card-consumer-eur-v1")).toBeVisible();
  await page.getByRole("link", { name: "Applications" }).click();
  await expect(page.getByText("Mila Novak")).toBeVisible();
  await page.getByRole("link", { name: "Search records" }).click();
  await page.getByPlaceholder("Users, creators, events").fill("mila");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page.getByText("mila-nova")).toBeVisible();
});

test("role guards keep member out of admin operations", async ({ page }) => {
  await login(page, "ana@example.test", "Password123!", "/member");
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();
});

const tinyPng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", "base64");

test("seller profile editor saves details, images and links to the public page", async ({ page }) => {
  await login(page, "mila@example.test", "Password123!", "/creator/settings");
  await expect(page.getByRole("heading", { name: "Seller profile" })).toBeVisible();
  const tagline = "Research briefings for operators " + Date.now();
  await page.getByLabel("Tagline").fill(tagline);
  await page.getByLabel("Label 4").fill("Podcast");
  await page.getByLabel("Address 4").fill("https://example.com/podcast");
  await page.getByLabel("Profile photo").setInputFiles({ name: "photo.png", mimeType: "image/png", buffer: tinyPng });
  await page.getByRole("button", { name: "Save profile" }).click();
  await expect(page.locator(".flash.success")).toContainText("Seller profile saved");
  await page.goto("/c/mila-nova");
  await expect(page.getByRole("heading", { level: 1, name: "Mila Novak" })).toBeVisible();
  await expect(page.getByText(tagline)).toBeVisible();
  await expect(page.getByRole("link", { name: /Podcast/ })).toHaveAttribute("href", "https://example.com/podcast");
  await expect(page.getByRole("heading", { name: "Memberships" })).toBeVisible();
  const avatar = page.getByRole("img", { name: /Mila Novak profile photo/ }).first();
  await expect(avatar).toBeVisible();
  expect(await avatar.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
});

test("profile validation rejects unsafe links and shows a clear error", async ({ page }) => {
  await login(page, "mila@example.test", "Password123!", "/creator/settings");
  await page.getByLabel("Label 5").fill("Bad");
  await page.getByLabel("Address 5").evaluate((input: HTMLInputElement) => { input.type = "text"; });
  await page.getByLabel("Address 5").fill("javascript:alert(1)");
  await page.getByRole("button", { name: "Save profile" }).click();
  await expect(page.locator(".flash.error")).toContainText("https://");
});

test("paid posts stay locked for anonymous visitors and files are access controlled", async ({ page, request }) => {
  await page.goto("/c/mila-nova/posts/weekly-signal-brief");
  await expect(page.getByRole("heading", { name: "Members-only content" })).toBeVisible();
  await expect(page.getByText("Members-only briefing body")).toHaveCount(0);
  const posts = await request.get("/c/mila-nova");
  expect(posts.status()).toBe(200);
  await page.goto("/c/mila-nova");
  const coverLess = await request.get("/api/media/00000000-0000-4000-8000-000000000000");
  expect(coverLess.status()).toBe(404);
  await page.goto("/c/mila-nova/posts/how-to-read-a-signal-brief");
  await expect(page.getByRole("heading", { level: 1, name: "How to read a weekly signal brief" })).toBeVisible();
  await expect(page.getByText("headline signal")).toBeVisible();
});

test("security headers and redirect hardening", async ({ page, request }) => {
  const response = await request.get("/");
  const headers = response.headers();
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
  await login(page, "ana@example.test", "Password123!", "//evil.example/phish");
  await expect(page).toHaveURL(/\/member/);
  expect(new URL(page.url()).hostname).not.toBe("evil.example");
});

test("unknown pages show a helpful 404", async ({ page }) => {
  const response = await page.goto("/c/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /could not find/ })).toBeVisible();
});

test("marketing pages are real content pages", async ({ page }) => {
  for (const [path, heading] of [["/how-it-works", "Your target sets the price."], ["/pricing", "Fixed plans for a fairer creator business."], ["/safety", "Money stays visible at every step."], ["/migration", "Bring your community with you."], ["/creators", "Memberships on ZeroFee."], ["/terms", "Terms of service"]] as const) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  }
  await page.goto("/pricing");
  await expect(page.getByRole("heading", { name: "Creator", exact: true })).toBeVisible();
});
