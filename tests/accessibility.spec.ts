import { expect, test } from "@playwright/test";

test("critical pages have named controls and no horizontal overflow", async ({ page }) => {
  for (const path of ["/"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: /You choose what you earn/ })).toBeVisible();
    const unnamedControls = await page.locator("button:not([aria-label])").evaluateAll((buttons) =>
      buttons.filter((button) => !button.textContent?.trim()).length
    );
    expect(unnamedControls).toBe(0);
    const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(horizontalOverflow).toBe(false);
  }
});
