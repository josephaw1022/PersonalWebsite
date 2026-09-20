import Link from "next/link";
import {
  Terminal,
  Layers,
  GitBranch,
  ShieldCheck,
  Server,
  ArrowRight,
  ExternalLink,
  Boxes,
} from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 flex flex-col space-y-20 animate-fade-in">
      {/* Hero Section */}
      <section className="max-w-4xl">
        <div className="inline-flex items-center gap-2 mb-6 font-mono text-sm text-emerald-600 dark:text-emerald-400">
          <Terminal className="w-4 h-4" />
          <span>$ whoami --role=&quot;Senior Platform Engineer&quot;</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground mb-6 leading-tight">
          Building reliable <br className="hidden sm:block" />
          cloud infrastructure.
        </h1>

        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed mb-8">
          Team Architect and Platform Engineer specializing in multi-cluster
          Kubernetes control planes, declarative GitOps, supply chain security,
          and developer velocity. Reconciling 1,200+ microservices across AWS,
          Azure, and bare-metal environments.
        </p>

        {/* Live Architecture Highlights / Telemetry Pills */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-zinc-600 dark:text-zinc-400 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-foreground font-semibold">1,200+ Apps</span>
            <span>Reconciled</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <GitBranch className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-foreground font-semibold">40+ Teams</span>
            <span>Onboarded</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <Server className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Bare-Metal OKD 4.20 Homelab</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Zero-Trust GitOps</span>
          </div>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 font-mono text-sm">
          <Link
            href="/skills"
            className="px-6 py-3 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 font-semibold transition-colors flex items-center justify-center gap-2 rounded-md shadow-sm group"
          >
            <span>./view_skills.sh</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/about"
            className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 rounded-md"
          >
            <span>cat about.md</span>
          </Link>
          <a
            href="https://github.com/josephaw1022"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center justify-center gap-2 text-xs"
          >
            <span>github.com/josephaw1022</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 mb-2 font-mono text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            <span>Engineering Pillars</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Architecture &amp; Core Focus
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-minimal rounded-lg p-6 flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 transition-colors">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2">
                Kubernetes Ecosystem
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                Multi-cluster orchestration running High-Availability Argo CD
                (App of Apps pattern), ACK and ASO operators, and Karpenter for
                dynamic, elastic node scaling.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 font-mono text-xs">
              <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60">
                Kubernetes
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60">
                Argo CD
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60">
                EKS / AKS / OKD
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60">
                Karpenter
              </span>
            </div>
          </div>

          <div className="card-minimal rounded-lg p-6 flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 transition-colors">
                <GitBranch className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2">
                GitOps &amp; Automation
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                Declarative infrastructure delivery through GitHub Actions,
                Actions Runner Controller (ARC), Terraform, and Ansible—driving
                velocity across 120+ AI skills and 3,000+ automated PRs.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 font-mono text-xs">
              <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60">
                GitHub ARC
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60">
                Terraform
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60">
                Ansible
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60">
                Taskfile
              </span>
            </div>
          </div>

          <div className="card-minimal rounded-lg p-6 flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2">
                Platform Security
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                Zero-trust admission enforcement via Kyverno, cryptographic
                container signing with Cosign, Syft/Grype SBOM generation, and
                secretless workload identities using Vault and External Secrets
                Operator.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 font-mono text-xs">
              <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60">
                Kyverno
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60">
                Cosign
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60">
                Syft / Grype
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60">
                Vault / ESO
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Spec Snippet */}
      <section className="card-minimal rounded-lg overflow-hidden border-zinc-200 dark:border-zinc-800">
        <div className="bg-zinc-100 dark:bg-zinc-900 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400/80 dark:bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-amber-400/80 dark:bg-amber-500/60" />
            <div className="w-3 h-3 rounded-full bg-emerald-400/80 dark:bg-emerald-500/60" />
            <span className="ml-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">
              platform-spec.yaml
            </span>
          </div>
          <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Synced &amp; Healthy
          </span>
        </div>
        <div className="p-6 font-mono text-xs sm:text-sm overflow-x-auto text-zinc-800 dark:text-zinc-200 bg-white/50 dark:bg-zinc-950/40">
          <pre className="leading-relaxed">
            <code>
              <span className="text-zinc-400 dark:text-zinc-500">
                # Production &amp; Homelab Architecture Overview
              </span>
              {"\n"}
              <span className="text-emerald-600 dark:text-emerald-400">
                apiVersion
              </span>
              : platform.josephwhiteaker.dev/v1alpha1{"\n"}
              <span className="text-emerald-600 dark:text-emerald-400">
                kind
              </span>
              : InfrastructureSpecification{"\n"}
              <span className="text-emerald-600 dark:text-emerald-400">
                metadata
              </span>
              :{"\n"}
              {"  "}
              <span className="text-zinc-700 dark:text-zinc-300">
                architect
              </span>
              : &quot;Joseph Whiteaker&quot;{"\n"}
              {"  "}
              <span className="text-zinc-700 dark:text-zinc-300">
                workloads
              </span>
              : &quot;1,200+ reconciled applications&quot;{"\n"}
              <span className="text-emerald-600 dark:text-emerald-400">
                spec
              </span>
              :{"\n"}
              {"  "}
              <span className="text-zinc-700 dark:text-zinc-300">
                controlPlane
              </span>
              :{"\n"}
              {"    "}
              <span className="text-zinc-600 dark:text-zinc-400">gitops</span>:
              ArgoCD (HA App of Apps, ACK/ASO Operators){"\n"}
              {"    "}
              <span className="text-zinc-600 dark:text-zinc-400">compute</span>:
              AWS EKS, Azure AKS, Bare-Metal OKD 4.20{"\n"}
              {"    "}
              <span className="text-zinc-600 dark:text-zinc-400">
                autoscaling
              </span>
              : Karpenter Node Pools{"\n"}
              {"  "}
              <span className="text-zinc-700 dark:text-zinc-300">security</span>
              :{"\n"}
              {"    "}
              <span className="text-zinc-600 dark:text-zinc-400">
                admission
              </span>
              : Kyverno Policy Engine{"\n"}
              {"    "}
              <span className="text-zinc-600 dark:text-zinc-400">
                supplyChain
              </span>
              : Cosign Signing + Syft/Grype SBOM{"\n"}
              {"    "}
              <span className="text-zinc-600 dark:text-zinc-400">identity</span>
              : HashiCorp Vault + External Secrets Operator{"\n"}
              {"  "}
              <span className="text-zinc-700 dark:text-zinc-300">
                observability
              </span>
              :{"\n"}
              {"    "}
              <span className="text-zinc-600 dark:text-zinc-400">
                telemetry
              </span>
              : Datadog APM &amp; RUM, Prometheus, OpenTelemetry
            </code>
          </pre>
        </div>
      </section>

      {/* Homelab & Open Source Spotlight */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="card-minimal rounded-lg p-6 flex flex-col justify-between group">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Bare-Metal Homelab
                </h3>
                <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                  SuperMicro &amp; Dell PowerEdge
                </span>
              </div>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              I self-host enterprise hardware running Red Hat OpenShift (OKD
              4.20) and K3s on Podman. All internal services are published
              through Cloudflare Tunnels and NetBird overlay mesh with zero open
              public ports.
            </p>
          </div>
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <span>Read infrastructure notes in about.md</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="card-minimal rounded-lg p-6 flex flex-col justify-between group">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Boxes className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Open Source &amp; Tooling
                </h3>
                <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                  Creator of SuperKind &amp; OSS Contributor
                </span>
              </div>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              Contributing upstream to Argo CD, Datadog Agent Integrations,
              Azure CLI, and Quarkus. Speaker on OperatorHub at Elastic
              Community, and passionate about engineering developer productivity
              tools.
            </p>
          </div>
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
            <Link
              href="/skills"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <span>Explore all technical tooling in skills.yaml</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="card-minimal rounded-lg p-8 border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-semibold text-foreground">
            Explore the Architecture &amp; Skillsets
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Detailed breakdown of platforms, tooling, and professional
            experience.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 font-mono text-sm">
          <Link
            href="/about"
            className="px-4 py-2.5 rounded-md border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            About Me
          </Link>
          <Link
            href="/skills"
            className="px-4 py-2.5 rounded-md bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 font-semibold transition-colors flex items-center gap-1.5"
          >
            <span>Technical Skills</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
