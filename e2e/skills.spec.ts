import { test, expect } from "@playwright/test";

test.describe("Skills Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/skills");
  });

  test("renders all skill domain categories and key skills", async ({
    page,
  }) => {
    await expect(page.locator("h1")).toHaveText("Technical Skills");

    // Verify all category cards
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
    await expect(
      page.getByRole("heading", { name: "Security, Policy & Identity" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Observability & Telemetry" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Networking & Edge Routing" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Languages & Frameworks" }),
    ).toBeVisible();

    // Verify key skill tags
    await expect(page.getByText("Kubernetes", { exact: true })).toBeVisible();
    await expect(
      page.getByText("Argo CD (HA & App of Apps)", { exact: true }),
    ).toBeVisible();
    await expect(page.getByText("Terraform", { exact: true })).toBeVisible();
    await expect(
      page.getByText("Datadog (Certified, APM, RUM)", { exact: true }),
    ).toBeVisible();
  });
});
