import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-8 border border-indigo-500/20 shadow-sm">
          <Terminal className="w-4 h-4" />
          <span>Platform Engineer & Cloud-Native Expert</span>
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl leading-[1.1] font-extrabold tracking-tight mb-8">
          Building Secure Platforms <br className="hidden md:block" />
          <span className="text-gradient">Without Sacrificing Velocity</span>
        </h1>
        
        <p className="mt-6 text-xl sm:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          4+ years of experience architecting Kubernetes ecosystems across AWS, Azure, and on-premise environments. Specializing in GitOps, supply chain security, and developer experience.
        </p>
        
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 delay-200 animate-fade-in-up">
          <Link 
            href="/skills" 
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-premium text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            Explore My Tech Stack
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            href="/about" 
            className="w-full sm:w-auto px-8 py-4 rounded-2xl glass text-slate-900 dark:text-white font-semibold hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center"
          >
            About My Approach
          </Link>
        </div>
      </div>
    </div>
  );
}
