import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactPage from "@/app/contact/page";

describe("Contact Page", () => {
  const originalClipboard = { ...navigator.clipboard };

  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  afterEach(() => {
    Object.assign(navigator, {
      clipboard: originalClipboard,
    });
  });

  it("renders the main heading and consulting description", () => {
    render(<ContactPage />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(/Consulting & Platform Advisory/i);
    expect(
      screen.getByText(/contact --domain=exokube\.com/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Open for Consulting & Advisory/i),
    ).toBeInTheDocument();
  });

  it("renders the consulting email on exokube.com", () => {
    render(<ContactPage />);

    expect(
      screen.getAllByText(/consulting@exokube\.com/i).length,
    ).toBeGreaterThan(0);
    const emailLink = screen.getByRole("link", {
      name: /Send email to Joseph Whiteaker/i,
    });
    expect(emailLink).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:consulting@exokube.com"),
    );
  });

  it("copies email address to clipboard when copy button is clicked", async () => {
    render(<ContactPage />);

    const copyBtn = screen.getByRole("button", { name: /Copy email address/i });
    expect(copyBtn).toBeInTheDocument();

    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "consulting@exokube.com",
      );
      expect(screen.getByText(/Copied!/i)).toBeInTheDocument();
    });
  });

  it("updates pre-populated inquiry when selecting topics", () => {
    render(<ContactPage />);

    const cloudBtn = screen.getByRole("button", {
      name: /Cloud & Terraform IaC/i,
    });
    fireEvent.click(cloudBtn);

    const emailLink = screen.getByRole("link", {
      name: /Send email to Joseph Whiteaker/i,
    });
    expect(emailLink.getAttribute("href")).toContain(
      encodeURIComponent(
        "Consulting Inquiry: Cloud Infrastructure & Terraform",
      ),
    );
  });

  it("renders all consulting domain capability cards", () => {
    render(<ContactPage />);

    expect(
      screen.getByRole("heading", {
        name: /Kubernetes Platforms & Control Planes/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /Cloud Infrastructure & IaC/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /GitOps, ARC & Developer Velocity/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /Supply Chain & Zero Trust Security/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders engagement models and external profile links", () => {
    render(<ContactPage />);

    expect(
      screen.getByRole("heading", { name: /Architecture & Audits/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Hands-On Implementation/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Fractional Advisory/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /LinkedIn Profile/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /GitHub Profile/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Medium Articles/i }),
    ).toBeInTheDocument();
  });

  it("renders the view_skills CTA link", () => {
    render(<ContactPage />);

    expect(screen.getByRole("link", { name: /view_skills/i })).toHaveAttribute(
      "href",
      "/skills",
    );
  });
});
