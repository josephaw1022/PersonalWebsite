"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Terminal,
  Mail,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Cloud,
  GitBranch,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  Send,
} from "lucide-react";

interface ConsultingDomain {
  id: string;
  title: string;
  description: string;
  icon: typeof Layers;
  deliverables: string[];
}

const consultingDomains: ConsultingDomain[] = [
  {
    id: "k8s",
    title: "Kubernetes Platforms & Control Planes",
    description:
      "Enterprise control plane architecture, multi-cluster management, custom operator development, and automated cluster scaling.",
    icon: Layers,
    deliverables: [
      "HA ArgoCD (App of Apps) deployment",
      "Karpenter dynamic node autoscaling",
      "ACK & ASO cloud resource operators",
      "Multi-tenant cluster isolation & RBAC",
    ],
  },
  {
    id: "cloud",
    title: "Cloud Infrastructure & IaC",
    description:
      "Scalable, resilient AWS and Azure cloud infrastructure automated through modular, declarative Infrastructure as Code.",
    icon: Cloud,
    deliverables: [
      "Modular Terraform / OpenTofu architectures",
      "Multi-account security & VPC networking",
      "ECS Fargate & containerized workloads",
      "Cloudflare Zero Trust tunnels & routing",
    ],
  },
  {
    id: "gitops",
    title: "GitOps, ARC & Developer Velocity",
    description:
      "Modern CI/CD pipelines, private runner automation, and declarative release workflows designed for engineering velocity.",
    icon: GitBranch,
    deliverables: [
      "Actions Runner Controller (ARC) on Kubernetes",
      "Automated dependency management (Dependabot/Renovate)",
      "Internal Developer Platform (IDP) tooling",
      "Immutable artifact pipelines & release gating",
    ],
  },
  {
    id: "security",
    title: "Supply Chain & Zero Trust Security",
    description:
      "Hardened platform security from code to cluster admission, container signing, and secretless workload identity.",
    icon: ShieldCheck,
    deliverables: [
      "Admission control policies with Kyverno",
      "Cosign container signing & provenance attestation",
      "Automated Syft & Grype SBOM generation",
      "Secretless identity via Vault & Workload Identity",
    ],
  },
];

const inquiryTopics = [
  {
    id: "k8s-platform",
    label: "Kubernetes & Control Planes",
    subject: "Consulting Inquiry: Kubernetes & Control Plane Architecture",
    prompt:
      "Hi Joseph,\n\nWe are looking for consulting help with our Kubernetes infrastructure. Specifically, we are looking to...",
  },
  {
    id: "cloud-infra",
    label: "Cloud & Terraform IaC",
    subject: "Consulting Inquiry: Cloud Infrastructure & Terraform",
    prompt:
      "Hi Joseph,\n\nI'd like to discuss a project involving cloud infrastructure and Terraform. We are currently working on...",
  },
  {
    id: "gitops-arc",
    label: "GitOps & CI/CD Runners",
    subject: "Consulting Inquiry: GitOps & CI/CD Runner Systems",
    prompt:
      "Hi Joseph,\n\nWe are looking to optimize our CI/CD pipelines and runner infrastructure (ARC / GitOps). Our current goals are...",
  },
  {
    id: "security-supplychain",
    label: "Zero Trust & Supply Chain",
    subject: "Consulting Inquiry: Supply Chain Security & Zero Trust",
    prompt:
      "Hi Joseph,\n\nWe need assistance hardening our container supply chain and cluster security policies. We are interested in...",
  },
  {
    id: "advisory-general",
    label: "Architecture Advisory / Other",
    subject: "Consulting Inquiry: Platform Advisory & Architecture",
    prompt:
      "Hi Joseph,\n\nI'd like to get in touch regarding platform engineering consulting. Here is an overview of what we are building...",
  },
];

export default function ContactContent() {
  const emailAddress = "consulting@exokube.com";
  const [copied, setCopied] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(inquiryTopics[0]);
  const [customMessage, setCustomMessage] = useState("");

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers or restricted permissions
      const textarea = document.createElement("textarea");
      textarea.value = emailAddress;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const mailtoBody = encodeURIComponent(
    customMessage.trim() ? customMessage : selectedTopic.prompt,
  );
  const mailtoUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(
    selectedTopic.subject,
  )}&body=${mailtoBody}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 animate-fade-in">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 mb-4 font-mono text-sm text-emerald-600 dark:text-emerald-400">
          <Terminal className="w-4 h-4" />
          <span>contact --domain=exokube.com</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">
          Consulting &amp; Platform Advisory
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed mb-6">
          Whether you&apos;re architecting multi-cluster Kubernetes control
          planes, modernizing cloud infrastructure with Terraform, optimizing
          GitOps runners, or hardening container supply chains—don&apos;t
          hesitate to reach out. I partner with teams to build scalable, secure,
          and developer-centric platforms.
        </p>

        {/* Quick Highlights / Badges */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-zinc-600 dark:text-zinc-400">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Open for Consulting &amp; Advisory</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Response within 24–48 hours</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <Mail className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Direct Domain: exokube.com</span>
          </div>
        </div>
      </div>

      {/* Primary Contact Card */}
      <div className="card-minimal rounded-lg p-6 sm:p-8 mb-14 border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">
              Direct Contact
            </span>
            <h2 className="text-2xl font-semibold text-foreground mb-1">
              Start a Conversation
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Reach out directly via email to discuss project scope,
              architecture reviews, or platform advisory.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={mailtoUrl}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-sm font-semibold rounded-sm transition-colors inline-flex items-center gap-2 shadow-sm"
              aria-label="Send email to Joseph Whiteaker"
            >
              <Send className="w-4 h-4" />
              <span>Email Joseph</span>
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="px-4 py-2.5 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-mono text-sm font-medium rounded-sm transition-colors inline-flex items-center gap-2"
              aria-label="Copy email address"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">
                    Copied!
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Address</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Email Address Display */}
        <div className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-md bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 font-mono text-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-zinc-500 block">
                  Consulting Inquiries:
                </span>
                <span className="text-foreground font-semibold text-base sm:text-lg select-all">
                  {emailAddress}
                </span>
              </div>
            </div>

            <span className="text-xs text-zinc-500 sm:text-right">
              PGP &amp; secure delivery enabled via exokube.com
            </span>
          </div>
        </div>

        {/* Interactive Inquiry Helper */}
        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <label className="block text-sm font-medium text-foreground mb-3">
            Select an area of interest to pre-populate your inquiry:
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
            {inquiryTopics.map((topic) => {
              const isSelected = selectedTopic.id === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => {
                    setSelectedTopic(topic);
                    setCustomMessage("");
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                    isSelected
                      ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-sm"
                      : "bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  {topic.label}
                </button>
              );
            })}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="inquiry-message"
              className="text-xs font-mono text-zinc-500 block"
            >
              Preview or customize message body (optional):
            </label>
            <textarea
              id="inquiry-message"
              rows={4}
              value={customMessage || selectedTopic.prompt}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full p-3 rounded-md bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-foreground font-mono text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>

          <div className="mt-3 flex justify-end">
            <a
              href={mailtoUrl}
              className="inline-flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <span>Open in Default Mail Client</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Consulting Domains Grid */}
      <div className="mb-14">
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          Consulting Capabilities
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
          Areas where I can assist your team as an architect, builder, or
          advisor.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {consultingDomains.map((domain) => {
            const Icon = domain.icon;
            return (
              <div
                key={domain.id}
                className="card-minimal rounded-lg p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {domain.title}
                    </h3>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                    {domain.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block mb-2">
                    Key Deliverables:
                  </span>
                  <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                    {domain.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Engagement Models */}
      <div className="mb-14">
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Engagement Models
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="card-minimal rounded-lg p-5 flex flex-col">
            <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
              Model 01
            </span>
            <h3 className="text-base font-semibold text-foreground mb-2">
              Architecture &amp; Audits
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Targeted assessments of current Kubernetes clusters, GitOps flows,
              and security policies with clear architectural recommendations.
            </p>
          </div>

          <div className="card-minimal rounded-lg p-5 flex flex-col">
            <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
              Model 02
            </span>
            <h3 className="text-base font-semibold text-foreground mb-2">
              Hands-On Implementation
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Direct execution building control planes, authoring Terraform
              modules, configuring ARC runner pools, and writing custom Helm
              charts.
            </p>
          </div>

          <div className="card-minimal rounded-lg p-5 flex flex-col">
            <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
              Model 03
            </span>
            <h3 className="text-base font-semibold text-foreground mb-2">
              Fractional Advisory
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Ongoing technical advisory for engineering leaders, mentoring
              platform engineers, and helping steer cloud-native technology
              choices.
            </p>
          </div>
        </div>
      </div>

      {/* Other Channels / Links */}
      <div className="card-minimal rounded-lg p-6 mb-12 border-zinc-200 dark:border-zinc-800">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Other Profiles &amp; Work
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          Connect or explore open source contributions and technical writing
          across the web.
        </p>
        <div className="flex flex-wrap gap-4 font-mono text-xs">
          <a
            href="https://www.linkedin.com/in/joseph-whiteaker-iii-02482a198/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <span>LinkedIn Profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://github.com/josephaw1022"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <span>GitHub Profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://medium.com/@josephsims1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <span>Medium Articles</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Bottom CTA to Skills */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
          Looking for detailed skill proficiencies and tool breakdowns?
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
  );
}
