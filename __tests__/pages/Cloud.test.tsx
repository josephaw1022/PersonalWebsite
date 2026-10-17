import { render, screen } from "@testing-library/react";
import CloudArchitecturePage from "@/app/cloud/page";

describe("Cloud Architecture Page", () => {
  it("renders the terminal badge, main heading, and overview description", () => {
    render(<CloudArchitecturePage />);
    expect(screen.getByText("cloud-infra.tf")).toBeInTheDocument();
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(
      /Cloud Infrastructure & Temporary Hosting/i,
    );
    expect(
      screen.getByText(
        /A resilient, serverless fallback architecture deployed on AWS ECS Fargate/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders the temporary hosting status banner referencing homelab fallback", () => {
    render(<CloudArchitecturePage />);
    expect(
      screen.getByText(
        /Temporary Production Hosting Active on AWS ECS Fargate/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /The primary bare-metal homelab OpenShift cluster is temporarily offline for hardware maintenance/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /view_homelab_status/i }),
    ).toHaveAttribute("href", "/homelab");
  });

  it("renders highlights and badges", () => {
    render(<CloudArchitecturePage />);
    expect(
      screen.getByText("Cloudflare Managed DNS & Proxy"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Cloudflare Zero Trust Tunnel"),
    ).toBeInTheDocument();
    expect(screen.getByText("AWS ECS Fargate (awsvpc)")).toBeInTheDocument();
    expect(screen.getByText("Datadog Fargate Agent & RUM")).toBeInTheDocument();
    expect(screen.getByText("Route 53 & SNS Alerts")).toBeInTheDocument();
  });

  it("renders the architecture diagram heading and mermaid chart", () => {
    render(<CloudArchitecturePage />);
    expect(
      screen.getByRole("heading", { name: /Cloud Architecture Topology/i }),
    ).toBeInTheDocument();
  });

  it("renders the three requested core cards for Cloudflare, AWS, and Datadog", () => {
    render(<CloudArchitecturePage />);

    // Card 1: Cloudflare DNS Management & Tunnels
    expect(
      screen.getByRole("heading", {
        name: /Cloudflare DNS Management & Tunnels/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("cloudflare.tf")).toBeInTheDocument();
    expect(screen.getByText(/Zero Inbound Open Ports:/i)).toBeInTheDocument();

    // Card 2: AWS Hosting (Temporarily)
    expect(
      screen.getByRole("heading", {
        name: /AWS ECS Fargate Temporary Hosting/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("ecs.tf")).toBeInTheDocument();
    expect(screen.getByText(/Homelab Fallback:/i)).toBeInTheDocument();

    // Card 3: Datadog Monitoring
    expect(
      screen.getByRole("heading", {
        name: /Datadog Application Monitoring/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("datadog.tf")).toBeInTheDocument();
    expect(
      screen.getByText(/Real User Monitoring \(RUM\):/i),
    ).toBeInTheDocument();
  });

  it("renders the technical specifications matrix table", () => {
    render(<CloudArchitecturePage />);
    expect(
      screen.getByRole("heading", {
        name: /Cloud Architecture Technical Specifications/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Edge Routing")).toBeInTheDocument();
    expect(screen.getByText("Ingress Connector")).toBeInTheDocument();
    expect(screen.getByText("Web Application")).toBeInTheDocument();
    expect(screen.getByText("Telemetry Agent")).toBeInTheDocument();
    expect(screen.getByText("Log Ingestion")).toBeInTheDocument();
    expect(screen.getByText("Health Probes")).toBeInTheDocument();
  });

  it("renders the Terraform repository source link", () => {
    render(<CloudArchitecturePage />);
    const tfLink = screen.getByRole("link", { name: /view_terraform_src/i });
    expect(tfLink).toHaveAttribute(
      "href",
      "https://github.com/josephaw1022/PersonalWebsite/tree/main/terraform",
    );
    expect(tfLink).toHaveAttribute("target", "_blank");
  });
});
