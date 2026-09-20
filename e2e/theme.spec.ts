import { test, expect } from "@playwright/test";

test.describe("Theme Toggle and Coloring", () => {
  test("toggles theme between light and dark modes successfully", async ({
    page,
  }) => {
    await page.goto("/");

    const lightBtn = page.locator('button[aria-label="Switch to Light mode"]');
    const darkBtn = page.locator('button[aria-label="Switch to Dark mode"]');
    const html = page.locator("html");

    // Switch to dark mode
    await darkBtn.click();
    await expect(html).toHaveClass(/dark/);

    // Switch to light mode
    await lightBtn.click();
    await expect(html).not.toHaveClass(/dark/);
  });

  test("header adapts appropriately across theme changes", async ({ page }) => {
    await page.goto("/");

    const header = page.locator("header");
    await expect(header).toBeVisible();

    // Verify header has adaptive classes
    await expect(header).toHaveClass(/bg-white\/80/);
    await expect(header).toHaveClass(/dark:bg-zinc-950\/80/);
    await expect(header).toHaveClass(/border-zinc-200/);
    await expect(header).toHaveClass(/dark:border-zinc-800/);
  });

  test("all skill images on skills page load successfully", async ({
    page,
  }) => {
    await page.goto("/skills");
    await page.waitForLoadState("networkidle");

    const images = page.locator(".card-minimal img");
    const count = await images.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      await expect(img).toBeVisible();
      await img.scrollIntoViewIfNeeded();
      await expect(async () => {
        const isLoaded = await img.evaluate(
          (node: HTMLImageElement) => node.complete && node.naturalWidth > 0,
        );
        expect(isLoaded).toBe(true);
      }).toPass({ timeout: 5000 });
    }
  });
});
