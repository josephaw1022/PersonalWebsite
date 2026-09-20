import Link from "next/link";
import {
  Terminal,
  Layers,
  GitBranch,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 flex flex-col min-h-[calc(100vh-8rem)] justify-between animate-fade-in">
      {/* Hero Section */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 mb-6 font-mono text-sm text-emerald-600 dark:text-emerald-400">
          <Terminal className="w-4 h-4" />
          <span>$ whoami --role=&quot;Senior Platform Engineer&quot;</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground mb-6 leading-tight">
          Building reliable <br className="hidden sm:block" />
          cloud infrastructure.
        </h1>

        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed mb-8">
          I design and build secure, scalable developer platforms and Kubernetes
          control planes. Specializing in declarative GitOps, supply chain
          security, and cloud native infrastructure across AWS, Azure, and
          bare-metal environments.
        </p>

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
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-minimal rounded-lg p-6 flex flex-col justify-between group">
          <div>
            <div className="w-10 h-10 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 transition-colors">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2">
              Kubernetes Ecosystem
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-5">
              Cluster lifecycle management, custom operators, Karpenter node
              autoscaling, and multi-cluster orchestration.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 font-mono text-xs">
            <span className="px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60">
              Kubernetes
            </span>
            <span className="px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60">
              Helm
            </span>
            <span className="px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60">
              EKS / AKS / OKD
            </span>
            <span className="px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60">
              Karpenter
            </span>
          </div>
        </div>

        <div className="card-minimal rounded-lg p-6 flex flex-col justify-between group">
          <div>
            <div className="w-10 h-10 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 transition-colors">
              <GitBranch className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2">
              GitOps &amp; Automation
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-5">
              Declarative infrastructure delivery via Argo CD, GitHub Actions
              ARC runners, Terraform, and Ansible.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 font-mono text-xs">
            <span className="px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60">
              Argo CD
            </span>
            <span className="px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60">
              GitHub ARC
            </span>
            <span className="px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60">
              Terraform
            </span>
            <span className="px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60">
              Ansible
            </span>
          </div>
        </div>

        <div className="card-minimal rounded-lg p-6 flex flex-col justify-between group">
          <div>
            <div className="w-10 h-10 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2">
              Platform Security
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-5">
              Zero-trust admission control with Kyverno, Cosign container
              signing, and secretless identity with Vault and ESO.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 font-mono text-xs">
            <span className="px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60">
              Kyverno
            </span>
            <span className="px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60">
              Cosign
            </span>
            <span className="px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60">
              SBOM
            </span>
            <span className="px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60">
              Vault / ESO
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
