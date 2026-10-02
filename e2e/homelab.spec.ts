import { test, expect } from "@playwright/test";

test.describe("Homelab Page", () => {
  test("loads the homelab page and renders key architecture sections", async ({
    page,
  }) => {
    await page.goto("/homelab");

    // Verify Title & Headline
    await expect(page).toHaveTitle(
      /Homelab Infrastructure \| Joseph Whiteaker/,
    );
    await expect(page.locator("h1")).toContainText(
      "Enterprise Homelab Infrastructure",
    );

    // Verify key badges
    await expect(page.getByText("OKD SCOS 4.22 (K8s v1.35.5)")).toBeVisible();
    await expect(page.getByText("192.168.0.0/21 LAN Subnet")).toBeVisible();
    await expect(
      page.getByText("MetalLB Layer 2 Pool (.230-.249)"),
    ).toBeVisible();
    await expect(
      page.getByText("Istio Ambient Mesh (ztunnel + HBONE)"),
    ).toBeVisible();
    await expect(
      page.getByText("Tailscale Subnet & Host Containers"),
    ).toBeVisible();

    // Verify Section Headings
    await expect(
      page.getByRole("heading", {
        name: "Servers & Hypervisors Architecture Diagram",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Hardware & Virtualization Topology",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Cluster Nodes, MetalLB VIPs & Ingress Topology Diagram",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Network Setup & IP Allocation Map",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Split DNS & Pi-hole Configuration",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Istio Ambient Mesh & MetalLB L2 Ingress",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Kiali Mesh UI Dashboard",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Tailscale Mesh Containers & Subnet Routing",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Identity Federation & Secrets Management",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: /Quay Container Registry.*Clair Security/i,
      }),
    ).toBeVisible();

    // Verify external repo link
    const repoLinks = page.getByRole("link", { name: /view_okd_repo/i });
    await expect(repoLinks).toHaveCount(2);
    await expect(repoLinks.first()).toHaveAttribute(
      "href",
      "https://github.com/josephaw1022/okd-sno-manual-install",
    );
  });
});
