import { test, expect } from "@playwright/test";

test.describe("Skills Page Interactions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/skills");
  });

  test("hovering over a skill card transitions the icon from grayscale to color", async ({
    page,
  }) => {
    // Find the Helm skill card - it contains the text "Helm"
    const helmCard = page.locator(".card-minimal", { hasText: /^Helm$/ });
    const helmIcon = helmCard.locator("img");

    // 1. Initial State: Icon should be grayscale
    // We check the computed style of the filter
    const initialFilter = await helmIcon.evaluate(
      (el) => window.getComputedStyle(el).filter,
    );

    // Most browsers will return 'grayscale(1)' or 'grayscale(100%)'
    expect(initialFilter).toContain("grayscale");
    expect(initialFilter).not.toContain("grayscale(0)");

    // 2. Hover State: Hover over the CARD container
    // This should trigger the group-hover effect on the icon
    await helmCard.hover();

    // 3. Verification: Icon should no longer be grayscale
    // We use expect.toPass to account for the 0.3s CSS transition
    await expect(async () => {
      const hoveredFilter = await helmIcon.evaluate(
        (el) => window.getComputedStyle(el).filter,
      );
      // It should either be 'none' or 'grayscale(0)' depending on the browser
      const isColor =
        hoveredFilter === "none" || hoveredFilter.includes("grayscale(0)");
      expect(isColor).toBe(true);

      const hoveredOpacity = await helmIcon.evaluate(
        (el) => window.getComputedStyle(el).opacity,
      );
      expect(hoveredOpacity).toBe("1");
    }).toPass({ timeout: 2000 });
  });

  test("icon returns to grayscale when hover is removed", async ({ page }) => {
    const helmCard = page.locator(".card-minimal", { hasText: /^Helm$/ });
    const helmIcon = helmCard.locator("img");

    // Hover and wait for color
    await helmCard.hover();
    await expect(async () => {
      const filter = await helmIcon.evaluate(
        (el) => window.getComputedStyle(el).filter,
      );
      expect(filter === "none" || filter.includes("grayscale(0)")).toBe(true);
    }).toPass();

    // Move mouse away (e.g. to the heading)
    await page.hover("h1");

    // Should return to grayscale
    await expect(async () => {
      const filter = await helmIcon.evaluate(
        (el) => window.getComputedStyle(el).filter,
      );
      expect(filter).toContain("grayscale");
      expect(filter).not.toContain("grayscale(0)");
    }).toPass();
  });
});
