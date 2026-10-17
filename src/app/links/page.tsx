import type { Metadata } from "next";
import Link from "next/link";
import {
  Terminal,
  ExternalLink,
  ArrowRight,
  GitBranch,
  Server,
  BookOpen,
  Layers,
  ShieldCheck,
  Video,
  Globe,
  Share2,
  FolderGit2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Links | Joseph Whiteaker",
  description:
    "Curated directory of external profiles, open source repositories, homelab projects, technical talks, and site resources.",
};

type LinkItem = {
  title: string;
  description: string;
  href: string;
  badge: string;
  isExternal: boolean;
  icon: React.ComponentType<{ className?: string }>;
};

type LinkSection = {
  title: string;
  description: string;
  links: LinkItem[];
};

const linkSections: LinkSection[] = [
  {
    title: "Profiles & Connect",
    description:
      "Primary online profiles, social channels, and technical publications.",
    links: [
      {
        title: "GitHub",
        description:
          "Open source contributions, Kubernetes platform repositories, and infrastructure automation tooling.",
        href: "https://github.com/josephaw1022",
        badge: "github.com/josephaw1022",
        isExternal: true,
        icon: FolderGit2,
      },
      {
        title: "LinkedIn",
        description:
          "Professional career history, enterprise platform architecture leadership, and engineering network.",
        href: "https://www.linkedin.com/in/joseph-whiteaker-iii-02482a198/",
        badge: "in/joseph-whiteaker-iii",
        isExternal: true,
        icon: Globe,
      },
      {
        title: "Medium",
        description:
          "Technical articles and deep dives exploring cloud-native architectures, GitOps, and platform operations.",
        href: "https://medium.com/@josephsims1",
        badge: "@josephsims1",
        isExternal: true,
        icon: BookOpen,
      },
    ],
  },
  {
    title: "Featured Repositories & Open Source",
    description:
      "Public repositories, platform automation tools, and cluster deployment assets.",
    links: [
      {
        title: "Personal Website Repository",
        description:
          "Next.js App Router portfolio featuring automated CI/CD with GitHub Actions, hardened container builds, and Helm charts.",
        href: "https://github.com/josephaw1022/PersonalWebsite",
        badge: "josephaw1022/PersonalWebsite",
        isExternal: true,
        icon: GitBranch,
      },
      {
        title: "OKD SNO Homelab Setup",
        description:
          "Step-by-step documentation and automation configs for deploying bare-metal Single Node OpenShift (OKD 4.22).",
        href: "https://github.com/josephaw1022/okd-sno-manual-install",
        badge: "josephaw1022/okd-sno-manual-install",
        isExternal: true,
        icon: Server,
      },
      {
        title: "SuperKind Tool",
        description:
          "Platform automation utility designed to bootstrap reproducible multi-node local Kubernetes Kind clusters.",
        href: "https://github.com/josephaw1022",
        badge: "Kind & SuperKind",
        isExternal: true,
        icon: Layers,
      },
    ],
  },
  {
    title: "Talks & Presentations",
    description: "Conference and community presentations on cloud-native tech.",
    links: [
      {
        title: "Elastic Community Talk: OperatorHub",
        description:
          "Community session detailing Elastic Cloud on Kubernetes (ECK) deployment and lifecycle automation using OperatorHub.",
        href: "https://www.youtube.com/live/bQEJ7IcO6R4?si=Mqj8UNuhqqoJdGlm",
        badge: "YouTube Live Recording",
        isExternal: true,
        icon: Video,
      },
    ],
  },
  {
    title: "Explore This Site",
    description:
      "Internal pages and architectural deep dives across this platform.",
    links: [
      {
        title: "Overview",
        description:
          "Platform engineering overview, core pillars, and high-level focus areas.",
        href: "/",
        badge: "route: /",
        isExternal: false,
        icon: Share2,
      },
      {
        title: "About Me",
        description:
          "Background in mathematics, career progression, platform philosophy, and credentials.",
        href: "/about",
        badge: "route: /about",
        isExternal: false,
        icon: ShieldCheck,
      },
      {
        title: "Technical Skills",
        description:
          "Comprehensive matrix of platforms, tools, orchestrators, and security mechanisms.",
        href: "/skills",
        badge: "route: /skills",
        isExternal: false,
        icon: Terminal,
      },
      {
        title: "Enterprise Homelab",
        description:
          "Full architecture topology, hardware specifications, network IP allocations, and mesh routing.",
        href: "/homelab",
        badge: "route: /homelab",
        isExternal: false,
        icon: Server,
      },
    ],
  },
];

export default function LinksPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 animate-fade-in">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 mb-4 font-mono text-sm text-emerald-600 dark:text-emerald-400">
          <Terminal className="w-4 h-4" />
          <span>links.json</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">
          Links &amp; Directory
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          A centralized directory of my open-source projects, technical
          write-ups, community talks, social profiles, and site resources.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-12">
        {linkSections.map((section) => (
          <section key={section.title} className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {section.title}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {section.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {section.links.map((item) => {
                const Icon = item.icon;
                const cardContent = (
                  <div className="card-minimal rounded-lg p-5 sm:p-6 flex flex-col justify-between h-full group">
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="w-10 h-10 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        {item.isExternal ? (
                          <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                        ) : (
                          <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                        )}
                      </div>

                      <h3 className="text-base font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2">
                        {item.title}
                      </h3>

                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                      <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {item.badge}
                      </span>
                    </div>
                  </div>
                );

                if (item.isExternal) {
                  return (
                    <a
                      key={item.title}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.title}
                      className="block focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg"
                    >
                      {cardContent}
                    </a>
                  );
                }

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    aria-label={item.title}
                    className="block focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg"
                  >
                    {cardContent}
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
