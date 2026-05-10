import Link from "next/link";
import { Terminal } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 flex flex-col min-h-[75vh]">
      <div className="max-w-3xl animate-fade-in">
        <div className="inline-flex items-center gap-2 mb-8 font-mono text-sm text-emerald-600">
          <Terminal className="w-4 h-4" />
          <span>$ whoami --role=&quot;Senior Cloud Engineer&quot;</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground mb-6 leading-tight">
          Building reliable <br className="hidden sm:block" />
          cloud infrastructure.
        </h1>

        <p className="text-xl text-foreground max-w-2xl leading-relaxed mb-10">
          I design and build secure, scalable developer platforms. With over 4
          years of expertise across AWS, Azure, and on-premise ecosystems, I
          specialize in Kubernetes architecture, automated deployment
          lifecycles, and enforcing supply chain security.
        </p>

        <div className="flex flex-col sm:flex-row items-start gap-4 font-mono text-sm">
          <Link
            href="/skills"
            className="px-6 py-3 bg-zinc-900 text-zinc-50 font-semibold hover:bg-zinc-800 transition-colors flex items-center justify-center rounded-sm"
          >
            ./view_skills.sh
          </Link>
          <Link
            href="/about"
            className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center justify-center rounded-sm"
          >
            cat about.md
          </Link>
        </div>
      </div>

      <div className="mt-auto pt-24 grid sm:grid-cols-3 gap-8 border-t border-zinc-200 dark:border-zinc-800 animate-fade-in delay-200">
        <div>
          <h3 className="font-semibold text-foreground mb-2">
            Kubernetes Ecosystem
          </h3>
          <p className="text-base text-foreground">
            Expertise in cluster lifecycle management, custom operators, and
            multi-cluster orchestration.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-2">
            GitOps & Automation
          </h3>
          <p className="text-base text-foreground">
            Declarative infrastructure via Argo CD, Flux, and Terraform,
            ensuring verifiable state.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-2">
            Platform Security
          </h3>
          <p className="text-base text-foreground">
            Zero-trust principles, OPA Gatekeeper, Kyverno, and hardened
            container supply chains.
          </p>
        </div>
      </div>
    </div>
  );
}
