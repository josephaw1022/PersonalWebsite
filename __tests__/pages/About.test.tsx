import { render, screen } from "@testing-library/react";
import About from "@/app/about/page";

describe("About Page", () => {
  it("renders the main heading and intro", () => {
    render(<About />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(/About Me/i);
    expect(
      screen.getByText(/Team Architect and Platform Engineer/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Columbia, SC")).toBeInTheDocument();
    expect(
      screen.getByText(/BS in Mathematics, Univ\. of South Carolina/i),
    ).toBeInTheDocument();
  });

  it("renders the core focus areas and background sections", () => {
    render(<About />);
    expect(
      screen.getByRole("heading", { name: /Background & Focus/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Core Focus Areas/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Control Plane & Kubernetes/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Declarative GitOps & CI\/CD/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /Supply Chain Security & Identity/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders homelab and open source community sections", () => {
    render(<About />);
    expect(
      screen.getByRole("heading", { name: /Homelab Infrastructure/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Open Source & Community/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /github\.com\/josephaw1022/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /medium\.com\/@josephsims1/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /Elastic Community Talk: OperatorHub/i,
      }),
    ).toBeInTheDocument();
  });
});
