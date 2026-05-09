import { render, screen } from "@testing-library/react";
import About from "@/app/about/page";

describe("About Page", () => {
  it("renders the main heading", () => {
    render(<About />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(/About My Approach/i);
  });

  it("renders the focus areas and approach sections", () => {
    render(<About />);
    expect(
      screen.getByRole("heading", { name: /Autonomy Through Guardrails/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Declarative Source of Truth/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Abstracting Complexity/i }),
    ).toBeInTheDocument();
  });
});
