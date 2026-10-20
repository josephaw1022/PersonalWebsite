import Link from "next/link";
import {
  Cloud,
  Terminal,
  ShieldCheck,
  Server,
  Activity,
  Workflow,
  ExternalLink,
  CheckCircle2,
  Globe,
  Bell,
  Database,
  ArrowRight,
} from "lucide-react";
import Mermaid from "@/components/Mermaid";

export const metadata = {
  title: "Cloud Architecture & Hosting | Joseph Whiteaker",
  description:
    "Overview of the temporary cloud hosting architecture powering the personal site on AWS ECS Fargate with Cloudflare Zero Trust Tunnels and comprehensive Datadog monitoring while the homelab OpenShift cluster is offline.",
};

const cloudArchitectureChart = `flowchart TB
  subgraph Public["Public Internet & Clients"]
    CLIENT["Users & Web Clients"]
    R53["AWS Route 53 (Global Health Checks)"]
  end

  subgraph Cloudflare["Cloudflare Zero Trust Edge"]
    CF_DNS["Cloudflare DNS (Proxied CNAME Records)"]
    CF_EDGE["Cloudflare Edge Network & WAF"]
    CF_TUNNEL["Cloudflare Zero Trust Tunnel"]
  end

  subgraph AWS["AWS Cloud (us-east-1) - ECS Fargate"]
    subgraph VPC["VPC & Subnets (0 Inbound Ingress Rules)"]
      subgraph FargateTask["ECS Fargate Task (awsvpc Network Mode)"]
        CF_CONTAINER["cloudflared Sidecar Container"]
        APP_CONTAINER["personal-site (Next.js Standalone Container)"]
        DD_AGENT["datadog-agent Sidecar Container"]
      end
      CW_LOGS["CloudWatch Logs (/ecs/personal-site)"]
      CW_ALARM["CloudWatch Alarm (HealthCheckStatus < 1)"]
    end
    SNS_ALERT["Amazon SNS Topic (SMS & Email Alerts)"]
    DD_FORWARDER["Datadog Forwarder Lambda"]
  end

  subgraph Datadog["Datadog Observability Platform"]
    DD_METRICS["Datadog Metrics & Autodiscovery"]
    DD_LOGS["Datadog Centralized Logs"]
    DD_RUM["Datadog RUM (Real User Monitoring)"]
    DD_CSPM["Datadog AWS Integration & CSPM"]
  end

  CLIENT -->|HTTPS / Port 443| CF_DNS
  CF_DNS --> CF_EDGE
  CF_EDGE <==>|Encrypted Tunnel Connection| CF_TUNNEL
  CF_TUNNEL <==>|Encrypted Tunnel Traffic| CF_CONTAINER
  CF_CONTAINER -->|Proxy: localhost:3000| APP_CONTAINER
  
  DD_AGENT -.->|http_check: localhost:3000| APP_CONTAINER
  DD_AGENT -.->|openmetrics: 127.0.0.1:2000| CF_CONTAINER
  DD_AGENT ==>|Ship Metrics| DD_METRICS

  FargateTask -->|Container Stdout/Stderr| CW_LOGS
  CW_LOGS -->|Subscription Filter| DD_FORWARDER
  DD_FORWARDER ==>|Ship Logs| DD_LOGS

  CLIENT -.->|Browser Telemetry| DD_RUM
  AWS -.->|IAM SecurityAudit Integration| DD_CSPM

  R53 -->|HTTPS Probes: jwhiteaker22.com| CF_EDGE
  R53 -.->|Status Metric| CW_ALARM
  CW_ALARM -->|Downtime Trigger| SNS_ALERT
`;

export default function CloudArchitecturePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 animate-fade-in">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 mb-4 font-mono text-sm text-emerald-600 dark:text-emerald-400">
          <Terminal className="w-4 h-4" />
          <span>cloud-infra.tf</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">
          Cloud Infrastructure &amp; Temporary Hosting
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed mb-6">
          A resilient, serverless fallback architecture deployed on AWS ECS
          Fargate, connected securely through Cloudflare Zero Trust Tunnels with
          zero open inbound firewall ports, and fully monitored end-to-end with
          Datadog.
        </p>

        {/* Status Alert Banner */}
        <div className="mb-8 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Cloud className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-950 dark:text-emerald-100">
                Temporary Production Hosting Active on AWS ECS Fargate
              </p>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
                The primary bare-metal homelab OpenShift cluster is temporarily
                offline for hardware maintenance. This cloud infrastructure
                keeps the site online with zero downtime and minimal operating
                cost.
              </p>
            </div>
          </div>
          <Link
            href="/homelab"
            className="flex items-center gap-2 px-4 py-2 rounded text-xs font-mono font-medium text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors whitespace-nowrap"
          >
            <span>view_homelab_status</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Highlights / Badges */}
        <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Cloudflare Managed DNS &amp; Proxy</span>
          </span>
          <span className="px-3 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Cloudflare Zero Trust Tunnel</span>
          </span>
          <span className="px-3 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>AWS ECS Fargate (awsvpc)</span>
          </span>
          <span className="px-3 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Datadog Fargate Agent &amp; RUM</span>
          </span>
          <span className="px-3 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Route 53 &amp; SNS Alerts</span>
          </span>
        </div>
      </div>

      <div className="space-y-14">
        {/* Architecture Diagram */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                Cloud Architecture Topology
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                End-to-end data flow from user requests through Cloudflare edge,
                AWS ECS Fargate sidecars, and Datadog observability pipelines.
              </p>
            </div>
          </div>
          <Mermaid chart={cloudArchitectureChart} />
        </section>

        {/* Three Core Infrastructure Cards */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                Core Cloud Infrastructure Pillars
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Declarative Terraform modules managing DNS, serverless compute,
                and telemetry.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Card 1: Cloudflare DNS Management & Tunnels */}
            <div className="card-minimal rounded-lg p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Globe className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200">
                    cloudflare.tf
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Cloudflare DNS Management &amp; Tunnels
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-5">
                  Authoritative DNS management paired with an encrypted
                  Cloudflare Zero Trust Tunnel that securely exposes internal
                  services without exposing open ingress ports.
                </p>

                <ul className="space-y-3 text-xs font-mono text-zinc-700 dark:text-zinc-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">
                        Managed DNS Records:
                      </strong>{" "}
                      Proxied CNAME records routing apex domain (
                      <code className="text-emerald-600 dark:text-emerald-400">
                        @
                      </code>
                      ) and{" "}
                      <code className="text-emerald-600 dark:text-emerald-400">
                        www
                      </code>{" "}
                      to Cloudflare Argo Tunnel endpoints.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">
                        Zero Inbound Open Ports:
                      </strong>{" "}
                      The AWS security group contains zero inbound rules. All
                      traffic travels over the outbound encrypted tunnel
                      connection.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">
                        cloudflared Sidecar:
                      </strong>{" "}
                      Container runs inside the ECS task, authenticating via SSM
                      Parameter Store credentials and proxying traffic to{" "}
                      <code className="text-emerald-600 dark:text-emerald-400">
                        localhost:3000
                      </code>
                      .
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">
                        Prometheus Telemetry:
                      </strong>{" "}
                      Exposes internal connection metrics on{" "}
                      <code className="text-emerald-600 dark:text-emerald-400">
                        127.0.0.1:2000/metrics
                      </code>{" "}
                      for Datadog Agent autodiscovery.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-xs font-mono text-zinc-500 dark:text-zinc-400">
                <span>Zero Trust Security</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  Encrypted Ingress
                </span>
              </div>
            </div>

            {/* Card 2: AWS Hosting (Temporarily) */}
            <div className="card-minimal rounded-lg p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Server className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200">
                    ecs.tf
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2">
                  AWS ECS Fargate Temporary Hosting
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-5">
                  Lightweight, serverless container hosting on AWS ECS Fargate
                  providing zero-downtime availability and cost-effective
                  operation while homelab cluster hardware is serviced.
                </p>

                <ul className="space-y-3 text-xs font-mono text-zinc-700 dark:text-zinc-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">
                        Homelab Fallback:
                      </strong>{" "}
                      Active continuity environment while the primary bare-metal
                      OKD OpenShift cluster is temporarily offline (as described
                      in{" "}
                      <code className="text-emerald-600 dark:text-emerald-400">
                        README.md
                      </code>
                      ).
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">
                        Fargate Serverless Tasks:
                      </strong>{" "}
                      Runs in{" "}
                      <code className="text-emerald-600 dark:text-emerald-400">
                        awsvpc
                      </code>{" "}
                      network mode with three co-located sidecar containers
                      sharing localhost communication.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">
                        Automated GHCR CI/CD:
                      </strong>{" "}
                      GitHub Actions workflows build Next.js container images,
                      push to GHCR, and automatically submit PRs updating image
                      tags in Terraform.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">
                        Uptime &amp; Alerting:
                      </strong>{" "}
                      Route 53 HTTPS health checks coupled to CloudWatch alarms
                      and Amazon SNS send immediate SMS &amp; email alerts upon
                      downtime.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-xs font-mono text-zinc-500 dark:text-zinc-400">
                <span>Terraform &amp; OIDC</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  Serverless Fargate
                </span>
              </div>
            </div>

            {/* Card 3: Datadog Monitoring */}
            <div className="card-minimal rounded-lg p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200">
                    datadog.tf
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Datadog Application Monitoring
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-5">
                  Comprehensive full-stack observability featuring ECS Fargate
                  metrics autodiscovery, serverless log shipping, CSPM
                  compliance, and client-side Real User Monitoring.
                </p>

                <ul className="space-y-3 text-xs font-mono text-zinc-700 dark:text-zinc-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">
                        Datadog Agent Sidecar:
                      </strong>{" "}
                      Runs in ECS Fargate mode, auto-detecting health probes on
                      the web application and Prometheus metrics from the
                      tunnel.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">
                        Forwarder Lambda:
                      </strong>{" "}
                      CloudWatch subscription filter streams container stdout
                      and stderr logs directly to the Datadog Forwarder Lambda
                      in real-time.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">
                        Cost-Optimized Retention:
                      </strong>{" "}
                      CloudWatch log retention is kept to 1 day to eliminate AWS
                      storage costs while storing rich historical logs in
                      Datadog.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">
                        Real User Monitoring (RUM):
                      </strong>{" "}
                      Browser telemetry monitors 100% of user sessions, tracking
                      page latency, Core Web Vitals, and session replay
                      telemetry.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-xs font-mono text-zinc-500 dark:text-zinc-400">
                <span>RUM &amp; OpenMetrics</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  Full Observability
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Specifications Matrix */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                Cloud Architecture Technical Specifications
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Key infrastructure parameters, resource allocations, and
                networking configurations.
              </p>
            </div>
          </div>

          <div className="card-minimal rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-100/80 dark:bg-zinc-900/80 font-mono text-xs text-zinc-600 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="py-3 px-4">Component</th>
                    <th className="py-3 px-4">Target Resource</th>
                    <th className="py-3 px-4">Provider / Service</th>
                    <th className="py-3 px-4">Configuration &amp; Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60 font-mono text-xs">
                  <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      Edge Routing
                    </td>
                    <td className="py-3 px-4 text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                      jwhiteaker22.com / www
                    </td>
                    <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400 whitespace-nowrap font-sans">
                      Cloudflare DNS &amp; Argo
                    </td>
                    <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300 font-sans">
                      Proxied CNAME records pointing to Zero Trust Tunnel ID
                      with DDoS mitigation
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      Ingress Connector
                    </td>
                    <td className="py-3 px-4 text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                      cloudflared:latest
                    </td>
                    <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400 whitespace-nowrap font-sans">
                      Cloudflare Tunnel Sidecar
                    </td>
                    <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300 font-sans">
                      Outbound QUIC tunnel proxying requests to localhost:3000
                      (0 inbound open ports)
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      Web Application
                    </td>
                    <td className="py-3 px-4 text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                      ghcr.io/josephaw1022/...
                    </td>
                    <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400 whitespace-nowrap font-sans">
                      AWS ECS Fargate Task
                    </td>
                    <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300 font-sans">
                      Next.js standalone Node.js container with multi-stage
                      hardened build
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      Telemetry Agent
                    </td>
                    <td className="py-3 px-4 text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                      datadog/agent:latest
                    </td>
                    <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400 whitespace-nowrap font-sans">
                      Datadog ECS Sidecar
                    </td>
                    <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300 font-sans">
                      Fargate Agent scraping http_check and cloudflared
                      Prometheus OpenMetrics
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      Log Ingestion
                    </td>
                    <td className="py-3 px-4 text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                      DatadogForwarder Lambda
                    </td>
                    <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400 whitespace-nowrap font-sans">
                      AWS CloudFormation Stack
                    </td>
                    <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300 font-sans">
                      CloudWatch subscription filter streaming ECS container
                      logs to Datadog Logs
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      Health Probes
                    </td>
                    <td className="py-3 px-4 text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                      https://jwhiteaker22.com/
                    </td>
                    <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400 whitespace-nowrap font-sans">
                      AWS Route 53 &amp; SNS
                    </td>
                    <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300 font-sans">
                      30s interval global endpoint health check triggering
                      CloudWatch downtime alarm
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Links to Git repositories and related resources */}
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <div>
            <h3 className="text-base font-semibold text-foreground mb-1">
              Explore the Infrastructure as Code (IaC)
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Review the complete Terraform manifests in the project repository.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/josephaw1022/PersonalWebsite/tree/main/terraform"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-sm bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 font-mono text-xs font-medium transition-colors shadow-sm"
            >
              <span>view_terraform_src</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
