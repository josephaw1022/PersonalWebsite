import { test, expect } from "@playwright/test";

test.describe("Links Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/links");
  });

  test("renders page header and metadata correctly", async ({ page }) => {
    await expect(page).toHaveTitle(/Links \| Joseph Whiteaker/);
    await expect(page.locator("h1")).toHaveText("Links & Directory");
    await expect(page.getByText("links.json")).toBeVisible();
    await expect(
      page.getByText(
        "A centralized directory of my open-source projects, technical write-ups, community talks, social profiles, and site resources.",
      ),
    ).toBeVisible();
  });

  test("renders all directory sections and key link cards", async ({
    page,
  }) => {
    // Check section headings
    await expect(
      page.getByRole("heading", { name: "Profiles & Connect" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Featured Repositories & Open Source",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Talks & Presentations" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Explore This Site" }),
    ).toBeVisible();

    const main = page.locator("main");

    // Check external profiles
    const githubLink = main.getByRole("link", { name: "GitHub" });
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/josephaw1022",
    );
    await expect(githubLink).toHaveAttribute("target", "_blank");

    const linkedinLink = main.getByRole("link", { name: "LinkedIn" });
    await expect(linkedinLink).toBeVisible();
    await expect(linkedinLink).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/joseph-whiteaker-iii-02482a198/",
    );

    const mediumLink = main.getByRole("link", { name: "Medium" });
    await expect(mediumLink).toBeVisible();
    await expect(mediumLink).toHaveAttribute(
      "href",
      "https://medium.com/@josephsims1",
    );

    // Check featured repos
    const websiteRepoLink = main.getByRole("link", {
      name: "Personal Website Repository",
    });
    await expect(websiteRepoLink).toBeVisible();
    await expect(websiteRepoLink).toHaveAttribute(
      "href",
      "https://github.com/josephaw1022/PersonalWebsite",
    );

    const homelabRepoLink = main.getByRole("link", {
      name: "OKD SNO Homelab Setup",
    });
    await expect(homelabRepoLink).toBeVisible();
    await expect(homelabRepoLink).toHaveAttribute(
      "href",
      "https://github.com/josephaw1022/okd-sno-manual-install",
    );

    // Check talk link
    const talkLink = main.getByRole("link", {
      name: "Elastic Community Talk: OperatorHub",
    });
    await expect(talkLink).toBeVisible();
    await expect(talkLink).toHaveAttribute(
      "href",
      "https://www.youtube.com/live/bQEJ7IcO6R4?si=Mqj8UNuhqqoJdGlm",
    );
  });

  test("internal links navigate correctly to respective pages", async ({
    page,
  }) => {
    // Navigate to Skills from Links page
    await page.getByRole("link", { name: "Technical Skills" }).click();
    await expect(page).toHaveURL(/.*\/skills/);
    await expect(page.locator("h1")).toHaveText("Technical Skills");

    // Go back to links
    await page.goto("/links");

    // Navigate to Homelab from Links page
    await page.getByRole("link", { name: "Enterprise Homelab" }).click();
    await expect(page).toHaveURL(/.*\/homelab/);
    await expect(page.locator("h1")).toContainText(
      "Enterprise Homelab Infrastructure",
    );
  });
});
