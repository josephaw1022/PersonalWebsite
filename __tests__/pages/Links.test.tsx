import { render, screen } from "@testing-library/react";
import LinksPage from "@/app/links/page";

describe("Links Page", () => {
  it("renders the terminal badge, main heading, and intro description", () => {
    render(<LinksPage />);
    expect(screen.getByText("links.json")).toBeInTheDocument();
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(/Links & Directory/i);
    expect(
      screen.getByText(
        /A centralized directory of my open-source projects, technical write-ups, community talks, social profiles, and site resources\./i,
      ),
    ).toBeInTheDocument();
  });

  it("renders all section headings", () => {
    render(<LinksPage />);
    expect(
      screen.getByRole("heading", { level: 2, name: /Profiles & Connect/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Featured Repositories & Open Source/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Talks & Presentations/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /Explore This Site/i }),
    ).toBeInTheDocument();
  });

  it("renders external social and profile links with correct attributes", () => {
    render(<LinksPage />);

    const githubLink = screen.getByRole("link", { name: /GitHub/i });
    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/josephaw1022",
    );
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");

    const linkedinLink = screen.getByRole("link", { name: /LinkedIn/i });
    expect(linkedinLink).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/joseph-whiteaker-iii-02482a198/",
    );
    expect(linkedinLink).toHaveAttribute("target", "_blank");
    expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer");

    const mediumLink = screen.getByRole("link", { name: /Medium/i });
    expect(mediumLink).toHaveAttribute(
      "href",
      "https://medium.com/@josephsims1",
    );
    expect(mediumLink).toHaveAttribute("target", "_blank");
    expect(mediumLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders featured open source project links", () => {
    render(<LinksPage />);

    const websiteRepoLink = screen.getByRole("link", {
      name: /Personal Website Repository/i,
    });
    expect(websiteRepoLink).toHaveAttribute(
      "href",
      "https://github.com/josephaw1022/PersonalWebsite",
    );
    expect(websiteRepoLink).toHaveAttribute("target", "_blank");

    const homelabRepoLink = screen.getByRole("link", {
      name: /OKD SNO Homelab Setup/i,
    });
    expect(homelabRepoLink).toHaveAttribute(
      "href",
      "https://github.com/josephaw1022/okd-sno-manual-install",
    );
    expect(homelabRepoLink).toHaveAttribute("target", "_blank");

    const superkindLink = screen.getByRole("link", {
      name: /SuperKind Tool/i,
    });
    expect(superkindLink).toHaveAttribute(
      "href",
      "https://github.com/josephaw1022",
    );
  });

  it("renders technical talk link", () => {
    render(<LinksPage />);

    const talkLink = screen.getByRole("link", {
      name: /Elastic Community Talk: OperatorHub/i,
    });
    expect(talkLink).toHaveAttribute(
      "href",
      "https://www.youtube.com/live/bQEJ7IcO6R4?si=Mqj8UNuhqqoJdGlm",
    );
    expect(talkLink).toHaveAttribute("target", "_blank");
  });

  it("renders internal site navigation links", () => {
    render(<LinksPage />);

    const overviewLink = screen.getByRole("link", { name: /Overview/i });
    expect(overviewLink).toHaveAttribute("href", "/");

    const aboutLink = screen.getByRole("link", { name: /About Me/i });
    expect(aboutLink).toHaveAttribute("href", "/about");

    const skillsLink = screen.getByRole("link", { name: /Technical Skills/i });
    expect(skillsLink).toHaveAttribute("href", "/skills");

    const homelabLink = screen.getByRole("link", {
      name: /Enterprise Homelab/i,
    });
    expect(homelabLink).toHaveAttribute("href", "/homelab");

    const cloudLink = screen.getByRole("link", {
      name: /Cloud Infrastructure/i,
    });
    expect(cloudLink).toHaveAttribute("href", "/cloud");
  });
});
