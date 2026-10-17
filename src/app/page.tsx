import Link from "next/link";
import { Terminal, Layers, GitBranch, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 flex-1 flex flex-col justify-center animate-fade-in">
      <div className="my-auto space-y-10 sm:space-y-12 lg:space-y-14">
        {/* Hero Section */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 mb-3 sm:mb-4 font-mono text-sm text-emerald-600 dark:text-emerald-400">
            <Terminal className="w-4 h-4" />
            <span>$ whoami --role=&quot;Senior Platform Engineer&quot;</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground mb-4 sm:mb-5 leading-tight">
            Building scalable <br className="hidden sm:block" />
            developer platforms.
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed mb-6 sm:mb-7">
            I design and build secure, scalable developer platforms and
            enterprise control planes running on Kubernetes. Specializing in
            declarative GitOps, network security, supply chain security, and
            platform automation.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 font-mono text-sm">
            <Link
              href="/skills"
              className="px-5 sm:px-6 py-2.5 sm:py-3 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 font-semibold transition-colors flex items-center justify-center rounded-sm shadow-sm"
            >
              ./view_skills.sh
            </Link>
            <Link
              href="/about"
              className="px-5 sm:px-6 py-2.5 sm:py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center rounded-sm"
            >
              cat about.md
            </Link>
            <Link
              href="/contact"
              className="px-5 sm:px-6 py-2.5 sm:py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center rounded-sm"
            >
              ./contact.sh
            </Link>
            <Link
              href="/homelab"
              className="sm:hidden px-5 sm:px-6 py-2.5 sm:py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center rounded-sm"
            >
              ./view_homelab.sh
            </Link>
          </div>
        </div>

        {/* Core Focus Overview */}
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="card-minimal rounded-lg p-5 sm:p-6 flex flex-col justify-start">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h2 className="text-base font-semibold text-foreground mb-1.5">
              Kubernetes Platforms
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Multi-cluster enterprise control planes running on Kubernetes,
              custom operators, and automated workload orchestration.
            </p>
          </div>

          <div className="card-minimal rounded-lg p-5 sm:p-6 flex flex-col justify-start">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <GitBranch className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h2 className="text-base font-semibold text-foreground mb-1.5">
              GitOps &amp; Automation
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Declarative infrastructure delivery, automated CI/CD runners, and
              idempotent configuration management.
            </p>
          </div>

          <div className="card-minimal rounded-lg p-5 sm:p-6 flex flex-col justify-start">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h2 className="text-base font-semibold text-foreground mb-1.5">
              Platform Security
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Zero-trust admission enforcement, cryptographic container signing,
              and hardened supply chain governance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
