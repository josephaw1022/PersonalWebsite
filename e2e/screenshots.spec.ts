import { test } from "@playwright/test";

const pages = [
  { name: "home", path: "/" },
  { name: "about", path: "/about" },
  { name: "skills", path: "/skills" },
];

test.describe("UI Screenshot Capture", () => {
  for (const p of pages) {
    test(`capture ${p.name} in light and dark mode`, async ({ page }) => {
      await page.goto(p.path);
      await page.waitForLoadState("networkidle");

      // Switch to light mode and capture
      const lightBtn = page.locator(
        'button[aria-label="Switch to Light mode"]',
      );
      if (await lightBtn.isVisible()) {
        await lightBtn.click();
        await page.waitForTimeout(300);
      }
      await page.screenshot({
        path: `screenshots/light-${p.name}.png`,
        fullPage: true,
      });

      // Switch to dark mode and capture
      const darkBtn = page.locator('button[aria-label="Switch to Dark mode"]');
      if (await darkBtn.isVisible()) {
        await darkBtn.click();
        await page.waitForTimeout(300);
      }
      await page.screenshot({
        path: `screenshots/dark-${p.name}.png`,
        fullPage: true,
      });
    });
  }
});
