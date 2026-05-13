export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 animate-fade-in">
      <div className="mb-16">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">
          About My Approach
        </h1>
        <p className="text-xl text-foreground">
          Working backwards from organizational objectives to architect
          developer-centric platforms.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <div className="flex items-center gap-4 mb-6">
            <span className="font-mono text-emerald-600 text-sm">01.</span>
            <h2 className="text-xl font-semibold text-foreground">
              Autonomy Through Guardrails
            </h2>
          </div>
          <div className="pl-9">
            <p className="text-lg text-foreground leading-relaxed">
              Effective platform engineering doesn&apos;t mean gatekeeping
              deployment. It means providing developers with self-service
              capabilities bounded by automated, policy-driven guardrails. By
              enforcing compliance at the admission controller level (e.g.,
              Kyverno or OPA Gatekeeper), teams can deploy rapidly without
              compromising the security posture.
            </p>
            <blockquote className="mt-4 border-l-4 border-emerald-600 bg-white dark:bg-zinc-900/50 p-4 text-zinc-900 dark:text-zinc-200 italic font-medium rounded-r-md shadow-sm">
              &quot;Make the right path the easiest path. Make the wrong path
              impossible.&quot;
            </blockquote>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-6">
            <span className="font-mono text-emerald-600 text-sm">02.</span>
            <h2 className="text-xl font-semibold text-foreground">
              Declarative Source of Truth
            </h2>
          </div>
          <div className="pl-9">
            <p className="text-lg text-foreground leading-relaxed">
              Infrastructure and application state must reside in version
              control. Embracing a strict GitOps methodology ensures that
              disaster recovery, auditability, and environment replication are
              inherent features of the deployment pipeline rather than
              operational burdens.
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-6">
            <span className="font-mono text-emerald-600 text-sm">03.</span>
            <h2 className="text-xl font-semibold text-foreground">
              Abstracting Complexity
            </h2>
          </div>
          <div className="pl-9">
            <p className="text-lg text-foreground leading-relaxed">
              Kubernetes is an infrastructure framework, not a developer
              product. My focus is abstracting the underlying complexity of
              container orchestration via tailored APIs, Helm charts, and custom
              Kubernetes Operators, allowing product teams to focus purely on
              shipping business logic.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
