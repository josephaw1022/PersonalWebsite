"use client";

import { useState } from "react";
import {
  Cloud,
  Boxes,
  GitBranch,
  ShieldCheck,
  Activity,
  Network,
  Terminal,
  type LucideIcon,
} from "lucide-react";

type SkillCategory = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  skills: string[];
};

const skillCategories: SkillCategory[] = [
  {
    id: "cloud",
    name: "Cloud & Hybrid Infrastructure",
    description:
      "Enterprise public cloud, hybrid infrastructure, managed Kubernetes, and Linux operating systems.",
    icon: Cloud,
    skills: [
      "Amazon Web Services (AWS)",
      "Microsoft Azure",
      "Red Hat OpenShift / OKD",
      "Linux (CentOS Stream / RHEL)",
      "AWS EKS & Azure AKS",
      "Karpenter Node Autoscaling",
    ],
  },
  {
    id: "kubernetes",
    name: "Containers & Orchestration",
    description:
      "Cluster lifecycle management, container runtimes, custom operators, and local development clusters.",
    icon: Boxes,
    skills: [
      "Kubernetes",
      "Podman & Docker",
      "Helm Charts",
      "Rancher",
      "Kind & SuperKind",
      "Headlamp & K9s",
      "ACK & ASO Operators",
    ],
  },
  {
    id: "gitops",
    name: "Platform Engineering, GitOps & CI/CD",
    description:
      "Declarative infrastructure as code, multi-cluster continuous delivery, and runner automation.",
    icon: GitBranch,
    skills: [
      "Argo CD (HA & App of Apps)",
      "GitHub Actions & ARC",
      "Azure DevOps (ADO)",
      "Terraform",
      "Red Hat Ansible",
      "Dependabot & Renovate",
      "Taskfile & Make",
    ],
  },
  {
    id: "security",
    name: "Security, Policy & Identity",
    description:
      "Zero-trust boundaries, automated admission policies, supply chain security, and secrets management.",
    icon: ShieldCheck,
    skills: [
      "Kyverno Policy Engine",
      "External Secrets Operator (ESO)",
      "HashiCorp Vault & Key Vault",
      "Cosign Image Signing",
      "Syft & Grype (SBOM & CVE)",
      "Azure Workload Identity",
      "Keycloak & Entra ID (OIDC)",
    ],
  },
  {
    id: "observability",
    name: "Observability & Telemetry",
    description:
      "Full-stack application telemetry, distributed tracing, metrics collection, and alerting.",
    icon: Activity,
    skills: [
      "Datadog (Certified, APM, RUM)",
      "Datadog Operator & Scanner",
      "Prometheus & Grafana",
      "Loki Log Aggregation",
      "OpenTelemetry",
    ],
  },
  {
    id: "networking",
    name: "Networking & Edge Routing",
    description:
      "Secure edge ingress, encrypted mesh overlay networks, service meshes, and reverse proxies.",
    icon: Network,
    skills: [
      "Cloudflare Tunnels & DNS",
      "NetBird Overlay VPN",
      "Istio Service Mesh",
      "Nginx Reverse Proxy",
      "AWS Route 53",
    ],
  },
  {
    id: "languages",
    name: "Languages & Frameworks",
    description:
      "Languages, scripts, and application frameworks used for platform automation and internal tooling.",
    icon: Terminal,
    skills: [
      "Go (Golang)",
      "Bash & PowerShell",
      "C# / .NET",
      "TypeScript / JavaScript",
      "React & Next.js",
      "Python",
    ],
  },
];

export default function Skills() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const filteredCategories =
    selectedFilter === "all"
      ? skillCategories
      : skillCategories.filter((cat) => cat.id === selectedFilter);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 animate-fade-in">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 mb-4 font-mono text-sm text-emerald-600 dark:text-emerald-400">
          <Terminal className="w-4 h-4" />
          <span>skills.yaml</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">
          Technical Skills
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          The core platforms, orchestrators, automation pipelines, and developer
          tools I utilize to engineer reliable environments.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setSelectedFilter("all")}
          className={`px-3.5 py-1.5 rounded-md text-xs font-mono transition-colors ${
            selectedFilter === "all"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }`}
        >
          All Domains
        </button>
        {skillCategories.map((category) => {
          const isActive = selectedFilter === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedFilter(category.id)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-mono transition-colors ${
                isActive
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => {
          const Icon = category.icon;
          return (
            <div
              key={category.id}
              className="card-minimal rounded-lg p-6 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {category.name}
                    </h2>
                  </div>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                  {category.description}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded text-xs font-mono bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60 hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
