import { test, expect } from "@playwright/test";

test.describe("Skills Page Interactions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/skills");
  });

  test("renders all skill domain categories and key skills", async ({
    page,
  }) => {
    await expect(page.locator("h1")).toHaveText("Technical Skills");

    // Verify key category cards
    await expect(
      page.getByRole("heading", { name: "Cloud & Hybrid Infrastructure" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Containers & Orchestration" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Platform Engineering, GitOps & CI/CD",
      }),
    ).toBeVisible();

    // Verify key skill tags
    await expect(page.getByText("Kubernetes", { exact: true })).toBeVisible();
    await expect(
      page.getByText("Argo CD (HA & App of Apps)", { exact: true }),
    ).toBeVisible();
    await expect(page.getByText("Terraform", { exact: true })).toBeVisible();
  });

  test("filtering by domain shows only matching category card", async ({
    page,
  }) => {
    // Click on Cloud & Hybrid Infrastructure filter tab
    await page
      .getByRole("button", {
        name: "Cloud & Hybrid Infrastructure",
        exact: true,
      })
      .click();

    // Cloud card should be visible
    await expect(
      page.getByRole("heading", { name: "Cloud & Hybrid Infrastructure" }),
    ).toBeVisible();

    // Other categories should not be visible
    await expect(
      page.getByRole("heading", { name: "Containers & Orchestration" }),
    ).not.toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Platform Engineering, GitOps & CI/CD",
      }),
    ).not.toBeVisible();

    // Reset filter to All Domains
    await page
      .getByRole("button", { name: "All Domains", exact: true })
      .click();

    // All should be visible again
    await expect(
      page.getByRole("heading", { name: "Containers & Orchestration" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Platform Engineering, GitOps & CI/CD",
      }),
    ).toBeVisible();
  });
});
