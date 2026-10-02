import { render, screen } from "@testing-library/react";
import Skills from "@/app/skills/page";

describe("Skills Page", () => {
  it("renders the main heading and description", () => {
    render(<Skills />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(/Technical Skills/i);
    expect(
      screen.getByText(/The core platforms, orchestrators/i),
    ).toBeInTheDocument();
  });

  it("renders all domain category cards and key skills", () => {
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
    expect(
      screen.getByRole("heading", { name: /Security, Policy & Identity/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Observability & Telemetry/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Networking & Edge Routing/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Languages & Frameworks/i }),
    ).toBeInTheDocument();

    expect(screen.getByText("Kubernetes")).toBeInTheDocument();
    expect(screen.getByText("Argo CD (HA & App of Apps)")).toBeInTheDocument();
    expect(screen.getByText("Terraform")).toBeInTheDocument();
    expect(
      screen.getByText("Datadog (Certified, APM, RUM)"),
    ).toBeInTheDocument();
    expect(screen.getByText("Tailscale Mesh VPN")).toBeInTheDocument();
  });
});
