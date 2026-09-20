import { render, screen } from "@testing-library/react";
import About from "@/app/about/page";

describe("About Page", () => {
  it("renders the main heading and intro", () => {
    render(<About />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(/About Me/i);
    expect(
      screen.getByText(/Senior Cloud and Platform Engineer/i),
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
      screen.getByRole("heading", { name: /Platform Engineering/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Declarative GitOps & CI\/CD/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Zero Trust & Security/i }),
    ).toBeInTheDocument();
  });

  it("renders homelab and open source community sections", () => {
    render(<About />);
    expect(
      screen.getByRole("heading", { name: /Homelab Infrastructure/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Community & Open Source/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /github\.com\/josephaw1022/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /medium\.com\/@josephsims1/i }),
    ).toBeInTheDocument();
  });
});
