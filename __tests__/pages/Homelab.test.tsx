import { render, screen } from "@testing-library/react";
import Homelab from "@/app/homelab/page";

describe("Homelab Page", () => {
  it("renders the main heading and overview description", () => {
    render(<Homelab />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(/Enterprise Homelab Infrastructure/i);
    expect(
      screen.getByText(/A production-grade, bare-metal OpenShift OKD cluster/i),
    ).toBeInTheDocument();
  });

  it("renders the core architecture section headings including mermaid diagrams", () => {
    render(<Homelab />);
    expect(
      screen.getByRole("heading", {
        name: /Servers & Hypervisors Architecture Diagram/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /Hardware & Virtualization Topology/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /Cluster Nodes, MetalLB VIPs & Ingress Topology Diagram/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /Network Setup & IP Allocation Map/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /Split DNS & Pi-hole Configuration/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /Istio Ambient Mesh & MetalLB L2 Ingress/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /Tailscale Mesh Containers & Subnet Routing/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /Identity Federation & Secrets Management/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /Quay Container Registry.*Clair Security/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /Platform Operations, CI\/CD & Storage/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders key network IP allocation rows and hostnames", () => {
    render(<Homelab />);
    expect(screen.getAllByText("192.168.1.4").length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByText("laptop-server.kubesoar.com").length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("192.168.1.5").length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByText("pihole.kubesoar.com").length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("192.168.1.9").length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByText("desktop-server.kubesoar.com").length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("192.168.1.20").length).toBeGreaterThanOrEqual(
      1,
    );
    expect(
      screen.getAllByText("api.okd.kubesoar.com").length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("192.168.1.22").length).toBeGreaterThanOrEqual(
      1,
    );
    expect(
      screen.getAllByText("master-0.okd.kubesoar.com").length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("192.168.1.230").length).toBeGreaterThanOrEqual(
      1,
    );
    expect(
      screen.getAllByText("*.homelab.kubesoar.com").length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("192.168.1.33").length).toBeGreaterThanOrEqual(
      1,
    );
    expect(
      screen.getAllByText("quay.kubesoar.com").length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("192.168.1.34").length).toBeGreaterThanOrEqual(
      1,
    );
    expect(
      screen.getAllByText("quay-clair.kubesoar.com").length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByText("personal-laptop (Tailscale)").length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("renders the Tailscale remote client workstation card", () => {
    render(<Homelab />);
    expect(
      screen.getByRole("heading", {
        name: /ThinkPad Remote Admin Workstation/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders external link to the okd repo", () => {
    render(<Homelab />);
    const repoLink = screen.getByRole("link", { name: /view_okd_repo/i });
    expect(repoLink).toHaveAttribute(
      "href",
      "https://github.com/josephaw1022/okd-sno-manual-install",
    );
  });
});
