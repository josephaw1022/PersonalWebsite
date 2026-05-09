import Link from "next/link";
import { Terminal } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 flex flex-col min-h-[75vh]">
      <div className="max-w-3xl animate-fade-in">
        <div className="inline-flex items-center gap-2 mb-8 font-mono text-sm text-emerald-400">
          <Terminal className="w-4 h-4" />
          <span>$ whoami --role="Senior Cloud Engineer"</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-zinc-100 mb-6 leading-tight">
          Engineering Resilient <br className="hidden sm:block" />
          Cloud Infrastructure.
        </h1>
        
        <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed mb-10">
          I design and build secure, scalable developer platforms. With over 4 years of expertise across AWS, Azure, and on-premise ecosystems, I specialize in Kubernetes architecture, automated deployment lifecycles, and enforcing supply chain security.
        </p>
        
        <div className="flex flex-col sm:flex-row items-start gap-4 font-mono text-sm">
          <Link 
            href="/skills" 
            className="px-6 py-3 bg-zinc-100 text-zinc-950 font-semibold hover:bg-zinc-300 transition-colors flex items-center justify-center"
          >
            ./view_stack.sh
          </Link>
          <Link 
            href="/about" 
            className="px-6 py-3 border border-zinc-800 text-zinc-300 hover:bg-zinc-900 transition-colors flex items-center justify-center"
          >
            cat principles.md
          </Link>
        </div>
      </div>
      
      <div className="mt-auto pt-24 grid sm:grid-cols-3 gap-8 border-t border-zinc-800/50 animate-fade-in delay-200">
        <div>
          <h3 className="font-semibold text-zinc-100 mb-2">Kubernetes Ecosystem</h3>
          <p className="text-sm text-zinc-500">Expertise in cluster lifecycle management, custom operators, and multi-cluster orchestration.</p>
        </div>
        <div>
          <h3 className="font-semibold text-zinc-100 mb-2">GitOps & Automation</h3>
          <p className="text-sm text-zinc-500">Declarative infrastructure via Argo CD, Flux, and Terraform, ensuring verifiable state.</p>
        </div>
        <div>
          <h3 className="font-semibold text-zinc-100 mb-2">Platform Security</h3>
          <p className="text-sm text-zinc-500">Zero-trust principles, OPA Gatekeeper, Kyverno, and hardened container supply chains.</p>
        </div>
      </div>
    </div>
  );
}
