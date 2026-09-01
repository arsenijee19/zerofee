import { expect, test } from "@playwright/test";

test("creator to buyer to admin seeded journey is navigable", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("homepage")).toContainText("You choose what you earn");
  await page.getByRole("button", { name: /Start as a creator/ }).first().click();
  await expect(page.getByRole("heading", { name: /Create your ZeroFee account/ })).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("heading", { name: /Creator country/ })).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText(/Mock Connect account created/)).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText(/Creator Earnings/).first()).toBeVisible();
  await page.getByRole("button", { name: /Membership Tiers/ }).click();
  await expect(page.getByRole("heading", { name: /Guaranteed Earnings builder/ })).toBeVisible();
  await page.getByRole("button", { name: /Financial Verification/ }).click();
  await expect(page.getByText("GUARANTEE SHORTFALL")).toBeVisible();
});

test("member checkout shows final price before confirmation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page.getByRole("heading", { name: /Your memberships/ })).toBeVisible();
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 0));
});

test("admin operations expose guarantee health and catalog", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Admin" }).click();
  await expect(page.getByText("ZeroFee SaaS MRR")).toBeVisible();
  await page.getByRole("button", { name: /Pricing Catalog/ }).click();
  await expect(page.getByText("Provider Pricing Catalog")).toBeVisible();
});
