import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home Page", () => {
  it("renders the main heading", () => {
    render(<Home />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(/Building reliable/i);
    expect(heading).toHaveTextContent(/cloud infrastructure/i);
  });

  it("renders call to action links", () => {
    render(<Home />);
    expect(
      screen.getByRole("link", { name: /\.\/view_skills\.sh/i }),
    ).toHaveAttribute("href", "/skills");
    expect(
      screen.getByRole("link", { name: /cat about\.md/i }),
    ).toHaveAttribute("href", "/about");
  });
});
