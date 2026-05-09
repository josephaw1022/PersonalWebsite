import Image from "next/image";

type Skill = {
  name: string;
  url: string;
  darkInvert?: boolean;
};

const skills: Skill[] = [
  { name: "Kubernetes", url: "https://cdn.simpleicons.org/kubernetes" },
  { name: "Argo CD", url: "https://cdn.simpleicons.org/argo" },
  { name: "Helm", url: "https://cdn.simpleicons.org/helm" },
  { name: "Podman", url: "https://cdn.simpleicons.org/podman" },
  { name: "CentOS", url: "https://d7umqicpi7263.cloudfront.net/img/product/bf98a07a-9aa9-45f8-b79b-953878714ee4.png" },
  { name: "Rancher", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rancher/rancher-original.svg" },
  { name: "Kyverno", url: "https://raw.githubusercontent.com/kyverno/kyverno/main/img/logo.png" },
  { name: "Keycloak", url: "https://upload.wikimedia.org/wikipedia/commons/2/29/Keycloak_Logo.png" },
  { name: "Nginx", url: "https://cdn.simpleicons.org/nginx" },
  { name: "AWS", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
  { name: "Azure", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" },
  { name: "PostgreSQL", url: "https://cdn.simpleicons.org/postgresql" },
  { name: "Valkey", url: "https://valkey.io/img/valkey-logo-og.png", darkInvert: true },
  { name: "Headlamp", url: "https://headlamp.dev/img/logo.svg", darkInvert: true },
  { name: "Terraform", url: "https://cdn.simpleicons.org/terraform" },
  { name: "Ansible", url: "https://cdn.simpleicons.org/ansible" },
  { name: "NetBird", url: "https://play-lh.googleusercontent.com/gwsB0q8e3BMAGF0_iBsj8WfxfGyGHTG27krDWKhyfdy0H6ttcRYjBkOlP0nSyZxe6g" },
];

export default function Skills() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 animate-fade-in-up">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
          My <span className="text-gradient">Tech Stack</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          A curated selection of tools and platforms I use to build scalable, secure, and developer-friendly infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 place-items-center">
        {skills.map((skill, i) => (
          <div 
            key={skill.name} 
            className="w-full aspect-square glass rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/50 flex flex-col items-center justify-center gap-4 hover-lift group"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 transition-transform duration-300 group-hover:scale-110">
              {/* Using standard img to avoid Next.js external domain config requirements for so many different domains,
                  but in a real prod app we'd configure next.config.ts or bundle the SVGs */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={skill.url} 
                alt={skill.name} 
                className={`w-full h-full object-contain ${skill.darkInvert ? 'invert-on-dark' : ''}`}
                loading="lazy"
              />
            </div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute bottom-3 bg-white/80 dark:bg-slate-900/80 px-2 py-1 rounded backdrop-blur-sm">
              {skill.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
