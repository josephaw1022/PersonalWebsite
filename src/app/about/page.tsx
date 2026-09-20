import Link from "next/link";
import {
  Server,
  Terminal,
  ShieldCheck,
  GitBranch,
  Layers,
  BookOpen,
  ArrowRight,
} from "lucide-react";

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 animate-fade-in">
      {/* Header */}
      <div className="mb-16">
        <div className="inline-flex items-center gap-2 mb-4 font-mono text-sm text-emerald-600 dark:text-emerald-400">
          <Terminal className="w-4 h-4" />
          <span>whoami.md</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">
          About Me
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
          Senior Cloud and Platform Engineer dedicated to designing resilient
          infrastructure, automating developer workflows, and building secure
          cloud platforms.
        </p>
      </div>

      {/* Main Narrative */}
      <div className="space-y-16">
        <section className="prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Background & Focus
          </h2>
          <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
            I specialize in cloud architecture, container orchestration, and
            developer platforms across AWS, Azure, and on-premises environments.
            My work focuses on bridging the gap between application engineering
            and underlying infrastructure—translating operational complexity
            into clean, declarative self-service workflows.
          </p>
          <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
            Rather than relying on manual runbooks or heavyweight approval
            gates, I build repeatable platforms where automated policy
            enforcement and continuous delivery provide both developer autonomy
            and rigorous operational guardrails.
          </p>
        </section>

        {/* Pillars / Core Focus Areas */}
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Core Focus Areas
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card-minimal rounded-lg p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Platform Engineering
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Architecting production Kubernetes clusters, custom operators,
                  and self-service abstractions so teams can ship business logic
                  quickly and reliably.
                </p>
              </div>
            </div>

            <div className="card-minimal rounded-lg p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                  <GitBranch className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Declarative GitOps & CI/CD
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Treating infrastructure and workloads as code using GitOps
                  reconciliation, Actions Runner Controller (ARC), and automated
                  rollout pipelines.
                </p>
              </div>
            </div>

            <div className="card-minimal rounded-lg p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Zero Trust & Security
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Hardening container supply chains, enforcing admission
                  policies, and establishing granular role-based access controls
                  across multi-tenant clusters.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Homelab & Open Source */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="card-minimal rounded-lg p-6 border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Homelab Infrastructure
              </h3>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-4">
              I maintain a bare-metal OpenShift (OKD) cluster running on
              enterprise hardware. This environment hosts live
              workloads—including this website—routed securely through
              Cloudflare Tunnels with automated deployments driven by
              self-hosted ARC runners.
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
              It serves as an active testbed for evaluating CNCF tools, mesh
              networking, storage orchestration, and telemetry setups before
              bringing them to production systems.
            </p>
          </div>

          <div className="card-minimal rounded-lg p-6 border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Community & Open Source
              </h3>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-4">
              I regularly contribute to open source infrastructure tooling,
              write technical deep dives on Medium, and share automation
              patterns with the broader engineering community.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <a
                href="https://github.com/josephaw1022"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-mono text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <span>github.com/josephaw1022</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://medium.com/@josephsims1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-mono text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <span>medium.com/@josephsims1</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* CTA to Skills */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
            Explore the tooling and technologies powering these platforms.
          </p>
          <Link
            href="/skills"
            className="px-5 py-2.5 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 font-mono text-sm font-medium transition-colors flex items-center gap-2 rounded-sm shadow-sm"
          >
            <span>view_skills</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
