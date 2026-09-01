import { expect, type Page, test } from "@playwright/test";

async function shot(page: Page, project: string, name: string) {
  await page.screenshot({ path: `test-results/screenshots/${project}-${name}.png`, fullPage: true });
}

test("capture visual QA screenshots", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.getByTestId("homepage")).toBeVisible();
  await shot(page, testInfo.project.name, "homepage");

  await page.getByRole("button", { name: /Pricing/ }).click();
  await shot(page, testInfo.project.name, "pricing");

  await page.getByRole("button", { name: /Migration/ }).first().click();
  await shot(page, testInfo.project.name, "migration-marketing");

  await page.getByRole("button", { name: /Open Migration Center/ }).click();
  await shot(page, testInfo.project.name, "migration-center");

  await page.goto("/");
  await page.getByRole("button", { name: /Start as a creator/ }).first().click();
  await shot(page, testInfo.project.name, "signup");
  await page.getByRole("button", { name: "Continue" }).click();
  await shot(page, testInfo.project.name, "creator-application");
  await page.getByRole("button", { name: "Continue" }).click();
  await shot(page, testInfo.project.name, "payout-onboarding");
  await page.getByRole("button", { name: "Continue" }).click();
  await shot(page, testInfo.project.name, "creator-dashboard");
  await page.getByRole("button", { name: /Membership Tiers/ }).click();
  await shot(page, testInfo.project.name, "tier-builder");
  await page.getByRole("button", { name: /Financial Verification/ }).click();
  await shot(page, testInfo.project.name, "financial-verification");
  await page.getByRole("button", { name: /^Earnings$/ }).click();
  await shot(page, testInfo.project.name, "earnings");
  await page.getByRole("button", { name: /^Payouts$/ }).click();
  await shot(page, testInfo.project.name, "payouts");
  await page.getByRole("button", { name: /^Tax$/ }).click();
  await shot(page, testInfo.project.name, "tax");
  await page.getByRole("button", { name: /^Members$/ }).click();
  await shot(page, testInfo.project.name, "members");
  await page.getByRole("button", { name: /^Content$/ }).click();
  await shot(page, testInfo.project.name, "content");
  await page.getByRole("complementary").getByRole("button", { name: /^Migration$/ }).click();
  await shot(page, testInfo.project.name, "creator-migration");
  await page.getByRole("button", { name: /^Integrations$/ }).click();
  await shot(page, testInfo.project.name, "integrations");
  await page.getByRole("button", { name: /^Broadcasts$/ }).click();
  await shot(page, testInfo.project.name, "broadcasts");
  await page.getByRole("button", { name: /API/ }).click();
  await shot(page, testInfo.project.name, "api-webhooks");

  await page.goto("/");
  await page.getByRole("button", { name: /View public creator page/ }).click();
  await shot(page, testInfo.project.name, "public-creator");
  await page.getByRole("button", { name: /Join Signal Room/ }).click();
  await shot(page, testInfo.project.name, "checkout-review");
  await page.getByRole("button", { name: /Confirm mock payment/ }).click();
  await shot(page, testInfo.project.name, "member-dashboard");
  await page.getByRole("button", { name: /Locked preview/ }).click();
  await shot(page, testInfo.project.name, "locked-content");

  await page.goto("/");
  await page.getByRole("button", { name: "Admin" }).click();
  await shot(page, testInfo.project.name, "admin-overview");
  await page.keyboard.press(process.platform === "darwin" ? "Meta+K" : "Control+K");
  await shot(page, testInfo.project.name, "global-search");
  await page.getByLabel("Close search").click();
  await page.getByRole("button", { name: /^Applications$/ }).click();
  await shot(page, testInfo.project.name, "admin-applications");
  await page.getByRole("button", { name: /Creator Detail/ }).click();
  await shot(page, testInfo.project.name, "admin-creator-detail");
  await page.getByRole("button", { name: /Guarantee Health/ }).click();
  await shot(page, testInfo.project.name, "admin-guarantee-health");
  await page.getByRole("button", { name: /Pricing Catalog/ }).click();
  await shot(page, testInfo.project.name, "admin-pricing-catalog");
  await page.getByRole("button", { name: /^Countries$/ }).click();
  await shot(page, testInfo.project.name, "admin-countries");
  await page.getByRole("button", { name: /^Webhooks$/ }).click();
  await shot(page, testInfo.project.name, "admin-webhooks");
  await page.getByRole("button", { name: /^Support$/ }).click();
  await shot(page, testInfo.project.name, "admin-support");
  await page.getByRole("button", { name: /^Audit$/ }).click();
  await shot(page, testInfo.project.name, "admin-audit");
});
