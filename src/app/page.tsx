import Link from "next/link";
import { Terminal, Layers, GitBranch, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 flex flex-col min-h-[calc(100vh-8rem)] justify-between animate-fade-in">
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

        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed mb-10">
          I design and build secure, scalable developer platforms and Kubernetes
          control planes. Specializing in declarative GitOps, supply chain
          security, and enterprise infrastructure automation.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 font-mono text-sm">
          <Link
            href="/skills"
            className="px-6 py-3 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 font-semibold transition-colors flex items-center justify-center rounded-sm shadow-sm"
          >
            ./view_skills.sh
          </Link>
          <Link
            href="/about"
            className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center rounded-sm"
          >
            cat about.md
          </Link>
        </div>
      </div>

      {/* Core Focus Overview */}
      <div className="pt-20 grid sm:grid-cols-3 gap-6">
        <div className="card-minimal rounded-lg p-6 flex flex-col justify-start">
          <div className="w-9 h-9 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
            <Layers className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-foreground mb-2">
            Kubernetes Ecosystem
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Multi-cluster control plane architecture, custom operators, and
            automated workload orchestration.
          </p>
        </div>

        <div className="card-minimal rounded-lg p-6 flex flex-col justify-start">
          <div className="w-9 h-9 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
            <GitBranch className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-foreground mb-2">
            GitOps &amp; Automation
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Declarative infrastructure delivery, automated CI/CD runners, and
            idempotent configuration management.
          </p>
        </div>

        <div className="card-minimal rounded-lg p-6 flex flex-col justify-start">
          <div className="w-9 h-9 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-foreground mb-2">
            Platform Security
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Zero-trust admission enforcement, cryptographic container signing,
            and hardened supply chain governance.
          </p>
        </div>
      </div>
    </div>
  );
}
