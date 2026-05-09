import { render, screen } from "@testing-library/react";
import Skills from "@/app/skills/page";

describe("Skills Page", () => {
  it("renders the main heading", () => {
    render(<Skills />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(/Technical Skills/i);
  });

  it("renders a list of skills", () => {
    render(<Skills />);
    expect(screen.getByText("Kubernetes")).toBeInTheDocument();
    expect(screen.getByText("Argo CD")).toBeInTheDocument();
    expect(screen.getByText("Terraform")).toBeInTheDocument();

    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThan(5);
  });
});
