import { test, expect } from "@playwright/test";

test.describe("Site Navigation", () => {
  test("navigation works across the main pages", async ({ page }) => {
    // Start at the home page
    await page.goto("/");

    // Verify Homepage
    await expect(page).toHaveTitle(
      /Joseph Whiteaker \| Senior Platform Engineer/,
    );
    await expect(page.locator("h1")).toContainText("Building scalable");

    // Click on About navigation link
    await page.click("nav >> text=About");
    await expect(page).toHaveURL(/.*\/about/);
    await expect(page.locator("h1")).toContainText("About Me");

    // Click on Skills navigation link
    await page.click("nav >> text=Skills");
    await expect(page).toHaveURL(/.*\/skills/);
    await expect(page.locator("h1")).toContainText("Technical Skills");

    // Click on Homelab navigation link
    await page.click("nav >> text=Homelab");
    await expect(page).toHaveURL(/.*\/homelab/);
    await expect(page.locator("h1")).toContainText(
      "Enterprise Homelab Infrastructure",
    );

    // Click on Overview navigation link to go back home
    await page.click("nav >> text=Overview");
    await expect(page).toHaveURL(/.*\//);
    await expect(page.locator("h1")).toContainText("Building scalable");
  });

  test("call to action buttons on home page work", async ({ page }) => {
    await page.goto("/");

    // Test Skills CTA
    await page.click("text=./view_skills.sh");
    await expect(page).toHaveURL(/.*\/skills/);

    // Go back
    await page.goto("/");

    // Test About CTA
    await page.click("text=cat about.md");
    await expect(page).toHaveURL(/.*\/about/);
  });
});
