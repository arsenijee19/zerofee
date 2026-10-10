import { expect, test, type Page } from "@playwright/test";

const publicRoutes = ["/", "/how-it-works", "/pricing", "/safety", "/migration", "/creators", "/terms", "/privacy", "/refunds", "/acceptable-use", "/login", "/signup", "/signup?role=creator", "/forgot-password", "/reset-password", "/verify-email", "/c/mila-nova", "/c/mila-nova/posts/how-to-read-a-signal-brief", "/c/mila-nova/posts/weekly-signal-brief", "/robots.txt", "/sitemap.xml", "/api/health", "/demo"];
const memberRoutes = ["/member", "/member/memberships", "/member/billing", "/member/notifications", "/member/support", "/member/account"];
const creatorRoutes = ["/creator", "/creator/application", "/creator/payments", "/creator/billing", "/creator/tiers", "/creator/tiers/new", "/creator/members", "/creator/content", "/creator/content/new", "/creator/earnings", "/creator/financial-verification", "/creator/payouts", "/creator/migration", "/creator/integrations", "/creator/broadcasts", "/creator/api", "/creator/settings", "/creator/account", "/creator/support", "/creator/search"];
const adminRoutes = ["/admin", "/admin/applications", "/admin/creators", "/admin/guarantee", "/admin/pricing-catalog", "/admin/countries", "/admin/webhooks", "/admin/support", "/admin/moderation", "/admin/audit", "/admin/search"];

async function login(page: Page, email: string) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("Password123!");
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/login"));
}

async function visitAll(page: Page, routes: string[]) {
  const problems: string[] = [];
  for (const route of routes) {
    const response = await page.goto(route);
    const status = response?.status() ?? 0;
    const crashed = await page.getByText("This page hit a problem").count();
    const isDocument = !/^\/(api|robots|sitemap)/.test(route);
    const overflow = isDocument && await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    if (status >= 400 || crashed) problems.push(`${route} -> ${status}${crashed ? " (error boundary)" : ""}`);
    if (overflow) problems.push(`${route} -> horizontal overflow`);
  }
  expect(problems, problems.join("\n")).toEqual([]);
}

test.describe("every route renders without errors or horizontal overflow", () => {
  test.setTimeout(420_000);

  test("public", async ({ page }) => {
    await visitAll(page, publicRoutes);
  });

  test("member", async ({ page }) => {
    await login(page, "ana@example.test");
    await visitAll(page, memberRoutes);
  });

  test("creator", async ({ page }) => {
    await login(page, "mila@example.test");
    await visitAll(page, creatorRoutes);
  });

  test("admin", async ({ page }) => {
    await login(page, "ops@example.test");
    await visitAll(page, adminRoutes);
  });
});
