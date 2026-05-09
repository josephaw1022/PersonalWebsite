import { ShieldCheck, Zap } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 animate-fade-in-up">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
          My <span className="text-gradient">Philosophy</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Working backwards from business outcomes to create platforms that developers actually want to use.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass rounded-3xl p-8 md:p-10 hover-lift relative overflow-hidden group border border-slate-200/50 dark:border-slate-800/50">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="w-24 h-24 text-indigo-500" />
          </div>
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-6 border border-indigo-200 dark:border-indigo-800">
              <Zap className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4">My Focus Areas</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Automation that makes developers' lives easier. Whether it's declarative GitOps or imperative pipeline-based automation, policy guardrails with Kyverno or OPA Gatekeeper, multi-cluster management with tools like OCM or Azure Fleet, or streamlined developer experiences with tools such as Helm Charts and Operators. I focus on business outcomes and team velocity and work backwards from there.
            </p>
          </div>
        </div>

        <div className="glass rounded-3xl p-8 md:p-10 hover-lift relative overflow-hidden group border border-slate-200/50 dark:border-slate-800/50">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldCheck className="w-24 h-24 text-purple-500" />
          </div>
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6 border border-purple-200 dark:border-purple-800">
              <ShieldCheck className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4">How I Approach Platform Work</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
              I believe in giving developers autonomy with guardrails: 
              <br /><br />
              <span className="font-semibold text-slate-900 dark:text-slate-100 italic border-l-4 border-indigo-500 pl-4 block">
                "Making it easy to do the right thing and hard to do the wrong thing."
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
