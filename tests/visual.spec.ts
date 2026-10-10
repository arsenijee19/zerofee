import { expect, test, type Page } from "@playwright/test";

async function shot(page: Page, name: string) {
  await page.screenshot({ path: "test-results/screenshots/" + name + ".png", fullPage: true, timeout: 60000, animations: "disabled" });
}

async function login(page: Page, email: string, next: string) {
  await page.goto("/login?next=" + encodeURIComponent(next));
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("Password123!");
  await page.getByRole("button", { name: "Log in" }).click();
}

test("capture representative real-route visual QA", async ({ page }, testInfo) => {
  test.setTimeout(420_000);
  const prefix = testInfo.project.name + "-";
  await page.goto("/");
  await expect(page.getByTestId("homepage")).toBeVisible();
  await shot(page, prefix + "homepage");
  for (const item of [["/pricing", "pricing"], ["/how-it-works", "how-it-works"], ["/safety", "safety"], ["/migration", "migration"], ["/creators", "creators"], ["/terms", "terms"], ["/login", "login"], ["/signup?role=creator", "signup"], ["/c/mila-nova", "public-creator"], ["/c/mila-nova/posts/how-to-read-a-signal-brief", "public-post"], ["/c/mila-nova/posts/weekly-signal-brief", "locked-post"], ["/c/not-a-creator", "not-found"]] as const) {
    await page.goto(item[0]);
    await shot(page, prefix + item[1]);
  }
  await login(page, "mila@example.test", "/creator");
  for (const item of [["/creator", "creator-dashboard"], ["/creator/settings", "seller-profile"], ["/creator/tiers", "tiers"], ["/creator/content", "content"], ["/creator/content/new", "new-post"], ["/creator/application", "application"], ["/creator/earnings", "earnings"], ["/creator/payouts", "payouts"], ["/creator/migration", "creator-migration"], ["/creator/integrations", "integrations"], ["/creator/api", "api"]] as const) {
    await page.goto(item[0]);
    await shot(page, prefix + item[1]);
  }
  await login(page, "ana@example.test", "/member");
  for (const item of [["/member", "member-dashboard"], ["/member/account", "member-account"], ["/member/memberships", "memberships"], ["/member/billing", "member-billing"], ["/member/notifications", "notifications"]] as const) {
    await page.goto(item[0]);
    await shot(page, prefix + item[1]);
  }
  await login(page, "ops@example.test", "/admin");
  for (const item of [["/admin", "admin-overview"], ["/admin/applications", "admin-applications"], ["/admin/guarantee", "admin-guarantee"], ["/admin/pricing-catalog", "admin-pricing"], ["/admin/webhooks", "admin-webhooks"], ["/admin/audit", "admin-audit"]] as const) {
    await page.goto(item[0]);
    await shot(page, prefix + item[1]);
  }
});
