import { test, expect } from "@playwright/test";

test.describe("Cloud Architecture Page", () => {
  test("loads the cloud page and renders all key sections, cards, and diagrams", async ({
    page,
  }) => {
    await page.goto("/cloud");

    // Verify Title & Headline
    await expect(page).toHaveTitle(
      /Cloud Architecture & Hosting \| Joseph Whiteaker/,
    );
    await expect(page.locator("h1")).toContainText(
      "Cloud Infrastructure & Temporary Hosting",
    );

    // Verify status banner
    await expect(
      page.getByText("Temporary Production Hosting Active on AWS ECS Fargate"),
    ).toBeVisible();

    // Verify badges
    await expect(
      page.getByText("Cloudflare Managed DNS & Proxy", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("Cloudflare Zero Trust Tunnel", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("AWS ECS Fargate (awsvpc)", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("Datadog Fargate Agent & RUM", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("Route 53 & SNS Alerts", { exact: true }),
    ).toBeVisible();

    // Verify diagram heading
    await expect(
      page.getByRole("heading", { name: "Cloud Architecture Topology" }),
    ).toBeVisible();

    // Verify the 3 core cards
    await expect(
      page.getByRole("heading", {
        name: "Cloudflare DNS Management & Tunnels",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "AWS ECS Fargate Temporary Hosting",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Datadog Application Monitoring",
      }),
    ).toBeVisible();

    // Verify specifications table
    await expect(
      page.getByRole("heading", {
        name: "Cloud Architecture Technical Specifications",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "jwhiteaker22.com / www" }),
    ).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "cloudflared:latest" }),
    ).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "datadog/agent:latest" }),
    ).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "DatadogForwarder Lambda" }),
    ).toBeVisible();

    // Verify Terraform source link
    const tfLink = page.getByRole("link", { name: "view_terraform_src" });
    await expect(tfLink).toBeVisible();
    await expect(tfLink).toHaveAttribute(
      "href",
      "https://github.com/josephaw1022/PersonalWebsite/tree/main/terraform",
    );
  });
});
