import Link from "next/link";
import {
  Server,
  Terminal,
  ShieldCheck,
  GitBranch,
  Layers,
  BookOpen,
  ArrowRight,
  ExternalLink,
  MapPin,
  GraduationCap,
  Award,
} from "lucide-react";

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 animate-fade-in">
      {/* Header */}
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 mb-4 font-mono text-sm text-emerald-600 dark:text-emerald-400">
          <Terminal className="w-4 h-4" />
          <span>whoami.md</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">
          About Me
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed mb-6">
          Team Architect and Platform Engineer based in Columbia, SC,
          specializing in Kubernetes control planes, declarative GitOps, supply
          chain security, and developer velocity.
        </p>

        {/* Quick Highlights / Badges */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-zinc-600 dark:text-zinc-400">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Columbia, SC</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>BS in Mathematics, Univ. of South Carolina</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Eagle Scout • Phi Mu Epsilon</span>
          </div>
        </div>
      </div>

      {/* Main Narrative */}
      <div className="space-y-16">
        <section className="prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Background & Focus
          </h2>
          <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
            With a background grounded in mathematics and software engineering,
            I approach infrastructure through the lens of systematic design,
            repeatability, and scalability. As Team Architect at Versaterm
            across both the Control Plane and Product Runtime pods, I lead the
            architecture of enterprise Kubernetes platforms managing and
            reconciling over 1,200 applications across dozens of AWS and Azure
            data plane clusters, onboarding 40+ diverse product teams.
          </p>
          <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
            I operate with a &quot;Platform as a Product&quot; mindset: treating
            developer teams as customers, testing Helm charts thoroughly, and
            delivering developer velocity through modern automation. This
            includes building agentic engineering workflows—scaling our central
            platform monorepo with 120+ AI skills, private ARC runners, and
            automated dependency pipelines across more than 3,000 pull requests.
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
                  Control Plane & Kubernetes
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Architecting multi-cluster Kubernetes control planes running
                  High-Availability ArgoCD (App of Apps pattern), ACK and ASO
                  operators, and Karpenter node pools for elastic scaling.
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
                  Driving end-to-end GitOps workflows across GitHub Actions,
                  Actions Runner Controller (ARC), Terraform, and Ansible to
                  automate reliable deployments and dependency updates.
                </p>
              </div>
            </div>

            <div className="card-minimal rounded-lg p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Supply Chain Security & Identity
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Enforcing admission policies via Kyverno, signing container
                  images with Cosign, generating Syft/Grype SBOMs, and
                  implementing secretless workload identities (Vault, ESO, Azure
                  Workload Identity).
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
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-3">
              I operate enterprise hardware at home, including SuperMicro and
              Dell PowerEdge servers alongside a CentOS Stream ThinkPad for
              homelab services. My setup runs bare-metal OpenShift (OKD 4.20)
              automated via Ansible, plus multi-node K3s clusters on Podman
              containers.
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
              Services including Tekton Pipelines, Quay registry, External
              Secrets Operator, Cert-Manager, Kyverno, and Datadog monitoring
              are exposed securely through Cloudflare Tunnels without public
              IPs.
            </p>
          </div>

          <div className="card-minimal rounded-lg p-6 border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Open Source & Community
              </h3>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-3">
              Active open source contributor across major cloud native projects:
              Argo-CD, Datadog Agent Integrations, Azure CLI, .NET Aspire,
              Quarkus, and Operator Framework. Creator of{" "}
              <strong className="text-foreground">SuperKind</strong>, an
              automated Kind cluster setup tool.
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-4">
              Speaker at the Elastic Community on Elastic &amp; OperatorHub;
              regular attendee at All Things Open and AWS re:Invent.
            </p>
            <div className="flex flex-col gap-2 pt-1 font-mono text-xs">
              <a
                href="https://github.com/josephaw1022"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <span>github.com/josephaw1022</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://medium.com/@josephsims1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <span>medium.com/@josephsims1</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.youtube.com/live/bQEJ7IcO6R4?si=Mqj8UNuhqqoJdGlm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <span>Elastic Community Talk: OperatorHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* CTA to Skills */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
            Explore the tooling, orchestrators, and platforms powering these
            systems.
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
