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
  {
    name: "CentOS",
    url: "https://d7umqicpi7263.cloudfront.net/img/product/bf98a07a-9aa9-45f8-b79b-953878714ee4.png",
  },
  {
    name: "Rancher",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rancher/rancher-original.svg",
  },
  {
    name: "Kyverno",
    url: "https://raw.githubusercontent.com/kyverno/kyverno/main/img/logo.png",
  },
  {
    name: "Keycloak",
    url: "https://upload.wikimedia.org/wikipedia/commons/2/29/Keycloak_Logo.png",
  },
  { name: "Nginx", url: "https://cdn.simpleicons.org/nginx" },
  {
    name: "AWS",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
  },
  {
    name: "Azure",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg",
  },
  { name: "PostgreSQL", url: "https://cdn.simpleicons.org/postgresql" },
  { name: "Valkey", url: "https://valkey.io/img/valkey-logo-og.png" },
  { name: "Headlamp", url: "https://headlamp.dev/img/logo.svg" },
  { name: "Terraform", url: "https://cdn.simpleicons.org/terraform" },
  { name: "Ansible", url: "https://cdn.simpleicons.org/ansible" },
  {
    name: "NetBird",
    url: "https://play-lh.googleusercontent.com/gwsB0q8e3BMAGF0_iBsj8WfxfGyGHTG27krDWKhyfdy0H6ttcRYjBkOlP0nSyZxe6g",
  },
];

export default function Stack() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 animate-fade-in">
      <div className="mb-16">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">
          Technical Skills
        </h1>
        <p className="text-xl text-foreground max-w-2xl">
          The primary technologies I utilize to engineer secure, scalable, and
          observable environments.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {skills.map((skill, i) => (
          <div
            key={skill.name}
            className="w-full aspect-square card-minimal rounded-lg p-6 flex flex-col items-center justify-center gap-4 group"
            style={{ animationDelay: `${i * 30}ms` }}
          >
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 transition-transform duration-300">
              {/* Using standard img to avoid Next.js external domain config requirements for so many different domains */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={skill.url}
                alt={skill.name}
                className={`w-full h-full object-contain grayscale-hover`}
                loading="lazy"
              />
            </div>
            <span className="text-sm font-mono text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
              {skill.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
