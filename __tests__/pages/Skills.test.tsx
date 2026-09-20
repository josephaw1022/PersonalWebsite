import { render, screen, fireEvent } from "@testing-library/react";
import Skills from "@/app/skills/page";

describe("Skills Page", () => {
  it("renders the main heading", () => {
    render(<Skills />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(/Technical Skills/i);
  });

  it("renders domain category cards and key skills", () => {
    render(<Skills />);
    expect(
      screen.getByRole("heading", { name: /Cloud & Hybrid Infrastructure/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Containers & Orchestration/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /Platform Engineering, GitOps & CI\/CD/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Kubernetes")).toBeInTheDocument();
    expect(screen.getByText("Argo CD (HA & App of Apps)")).toBeInTheDocument();
    expect(screen.getByText("Terraform")).toBeInTheDocument();
  });

  it("filters skill categories when clicking filter buttons", () => {
    render(<Skills />);
    const cloudFilterBtn = screen.getByRole("button", {
      name: "Cloud & Hybrid Infrastructure",
    });

    fireEvent.click(cloudFilterBtn);

    expect(
      screen.getByRole("heading", { name: "Cloud & Hybrid Infrastructure" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Containers & Orchestration" }),
    ).not.toBeInTheDocument();

    const allFilterBtn = screen.getByRole("button", { name: "All Domains" });
    fireEvent.click(allFilterBtn);

    expect(
      screen.getByRole("heading", { name: "Containers & Orchestration" }),
    ).toBeInTheDocument();
  });
});
