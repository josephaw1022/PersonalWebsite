import Link from "next/link";
import {
  Server,
  Network,
  ShieldCheck,
  KeyRound,
  Boxes,
  Activity,
  Layers,
  Terminal,
  Cpu,
  Lock,
  Globe,
  HardDrive,
  GitBranch,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Database,
  Radio,
} from "lucide-react";

export const metadata = {
  title: "Homelab Infrastructure | Joseph Whiteaker",
  description:
    "Deep dive into Joseph Whiteaker's bare-metal OKD OpenShift cluster, Istio Ambient Mesh, MetalLB L2 routing, Keycloak & Entra ID SSO, OpenBao, Quay registry, and Pi-hole DNS network topology.",
};

interface IpAllocation {
  ip: string;
  hostname: string;
  subsystem: string;
  role: string;
  ingressType: string;
}

const ipAllocations: IpAllocation[] = [
  {
    ip: "192.168.1.4",
    hostname: "laptop-server.kubesoar.com",
    subsystem: "Host / Hypervisor",
    role: "CentOS Stream 10 ThinkPad (KVM Host, Cockpit, Quay Stack, Tailscale Exit Node)",
    ingressType: "Direct HTTPS / Port 443 (Certbot TLS)",
  },
  {
    ip: "192.168.1.5",
    hostname: "pihole.kubesoar.com",
    subsystem: "DNS / Network",
    role: "Pi-hole DNS Server VM (Fedora Cloud 44, FTL/dnsmasq, Split DNS)",
    ingressType: "DNS Port 53 / Admin Web UI",
  },
  {
    ip: "192.168.1.9",
    hostname: "desktop-server.kubesoar.com",
    subsystem: "Host / Hypervisor",
    role: "CentOS Stream 10 Server (125GB RAM, OKD Master VMs, Datadog Host Agent)",
    ingressType: "Direct HTTPS / Port 443 (Certbot TLS)",
  },
  {
    ip: "192.168.1.20",
    hostname: "api.okd.kubesoar.com",
    subsystem: "OKD Core Ingress",
    role: "Nginx Load Balancer (macvlan VIP for API 6443, MachineConfig 22623, Ingress 80/443)",
    ingressType: "Layer 4/7 Nginx Load Balancer",
  },
  {
    ip: "192.168.1.22",
    hostname: "master-0.okd.kubesoar.com",
    subsystem: "OKD Control Plane",
    role: "OKD 4.22 SCOS Master Node 0 (Rendezvous / Bootstrap & Worker Node)",
    ingressType: "Internal Node Communication",
  },
  {
    ip: "192.168.1.23",
    hostname: "master-1.okd.kubesoar.com",
    subsystem: "OKD Control Plane",
    role: "OKD 4.22 SCOS Master Node 1 (Control Plane & Worker Node)",
    ingressType: "Internal Node Communication",
  },
  {
    ip: "192.168.1.24",
    hostname: "master-2.okd.kubesoar.com",
    subsystem: "OKD Control Plane",
    role: "OKD 4.22 SCOS Master Node 2 (Control Plane & Worker Node)",
    ingressType: "Internal Node Communication",
  },
  {
    ip: "192.168.1.25",
    hostname: "postgres.kubesoar.com",
    subsystem: "Observability Storage",
    role: "BYOC PostgreSQL Container (Datadog CloudPrem Logs Backend)",
    ingressType: "Internal TCP Port 5432",
  },
  {
    ip: "192.168.1.26",
    hostname: "minio.kubesoar.com",
    subsystem: "Observability Storage",
    role: "BYOC MinIO S3 Object Storage (Datadog CloudPrem Archive Store)",
    ingressType: "Internal S3 API Port 9000/9001",
  },
  {
    ip: "192.168.1.30",
    hostname: "quay-postgres.kubesoar.com",
    subsystem: "Container Registry",
    role: "Quay PostgreSQL Dedicated Database Container",
    ingressType: "Internal TCP Port 5432",
  },
  {
    ip: "192.168.1.31",
    hostname: "quay-valkey.kubesoar.com",
    subsystem: "Container Registry",
    role: "Quay Valkey In-Memory Cache Container",
    ingressType: "Internal TCP Port 6379",
  },
  {
    ip: "192.168.1.32",
    hostname: "quay-registry.kubesoar.com",
    subsystem: "Container Registry",
    role: "Red Hat Quay Enterprise Registry Application Container",
    ingressType: "Internal HTTP Port 8080",
  },
  {
    ip: "192.168.1.33",
    hostname: "quay.kubesoar.com",
    subsystem: "Container Registry Ingress",
    role: "Quay Nginx Ingress Reverse Proxy with Let's Encrypt TLS",
    ingressType: "HTTPS Port 443 (Certbot DNS-01 TLS)",
  },
  {
    ip: "192.168.1.230",
    hostname: "*.homelab.kubesoar.com",
    subsystem: "Istio Service Mesh",
    role: "Istio Ingress Gateway LoadBalancer VIP (Allocated via MetalLB L2 Pool)",
    ingressType: "Layer 7 Ingress Gateway / Cert-Manager TLS",
  },
  {
    ip: "192.168.1.231 - .249",
    hostname: "Dynamic MetalLB Range",
    subsystem: "MetalLB IP Pool",
    role: "Dynamic Layer 2 LoadBalancer IP Pool for Workload Services",
    ingressType: "MetalLB Layer 2 ARP Advertisements",
  },
  {
    ip: "100.110.200.108",
    hostname: "laptop-server (Tailscale)",
    subsystem: "Remote Access Mesh",
    role: "Tailscale Exit Node & Subnet Router advertising 192.168.1.0/24 subnet",
    ingressType: "Tailscale Encrypted WireGuard Mesh",
  },
];

export default function Homelab() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 animate-fade-in">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 mb-4 font-mono text-sm text-emerald-600 dark:text-emerald-400">
          <Terminal className="w-4 h-4" />
          <span>homelab.spec.yaml</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">
          Enterprise Homelab Infrastructure
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed mb-6">
          A production-grade, bare-metal OpenShift OKD cluster running
          sidecarless Istio Ambient Mesh, MetalLB L2 load balancing, Keycloak
          &amp; Microsoft Entra ID single sign-on, OpenBao HA secrets engine,
          self-hosted Quay container registry, and dedicated Pi-hole DNS
          virtualization.
        </p>

        {/* Quick Highlights / Badges */}
        <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>OKD SCOS 4.22 (K8s v1.35.5)</span>
          </span>
          <span className="px-3 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
            <Network className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>192.168.0.0/21 LAN Subnet</span>
          </span>
          <span className="px-3 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>MetalLB Layer 2 Pool (.230-.249)</span>
          </span>
          <span className="px-3 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Istio Ambient Mesh (ztunnel + HBONE)</span>
          </span>
          <span className="px-3 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Microsoft Entra ID + Keycloak OIDC</span>
          </span>
          <span className="px-3 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
            <Boxes className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Quay Registry Stack + Pull Cache</span>
          </span>
        </div>
      </div>

      <div className="space-y-14">
        {/* Hardware & Hypervisors */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                Hardware &amp; Virtualization Topology
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Redundant physical servers orchestrated via Libvirt/KVM and Red
                Hat Ansible automation.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Desktop Server */}
            <div className="card-minimal rounded-lg p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200">
                    192.168.1.9
                  </span>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                    desktop-server
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Primary Hypervisor &amp; OKD Compute Server
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Dedicated CentOS Stream 10 bare-metal server equipped with 125
                  GB RAM and 13 CPU cores. Serves as the primary Libvirt/KVM
                  virtualization host running the OKD 3-node converged master
                  cluster.
                </p>

                <ul className="space-y-2 text-xs font-mono text-zinc-700 dark:text-zinc-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>
                      3 OKD Master VMs (4 vCPUs, 30 GB RAM, 175 GB root disk
                      each)
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>
                      Dedicated raw NVMe data volumes (/dev/vdb, 200 GB per
                      node) for LVMS storage
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>
                      Podman Datadog Host Agent &amp; Cockpit Console on Port
                      443 with Cloudflare TLS
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Laptop Server */}
            <div className="card-minimal rounded-lg p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200">
                    192.168.1.4
                  </span>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                    laptop-server
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Edge Services, DNS &amp; Registry Host
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Lenovo ThinkPad laptop running CentOS Stream 10 acting as a
                  dedicated hypervisor and edge gateway for auxiliary
                  containerized infrastructure, DNS services, and remote
                  networking.
                </p>

                <ul className="space-y-2 text-xs font-mono text-zinc-700 dark:text-zinc-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>
                      Pi-hole DNS Server VM (Fedora Cloud 44, static IP
                      192.168.1.5)
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>
                      Quay Registry Stack (PostgreSQL, Valkey cache, Quay core,
                      Nginx TLS proxy)
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>
                      Tailscale Exit Node &amp; Subnet Router (advertising
                      192.168.1.0/24 subnet)
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Network & IP Allocation Map */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                Network Setup &amp; IP Allocation Map
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Subnet CIDR{" "}
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  192.168.0.0/21
                </span>{" "}
                with router gateway at{" "}
                <span className="font-mono text-emerald-600 dark:text-emerald-400">
                  192.168.1.1
                </span>
                .
              </p>
            </div>
          </div>

          <div className="card-minimal rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-100/80 dark:bg-zinc-900/80 font-mono text-xs text-zinc-600 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="py-3 px-4">IP Address</th>
                    <th className="py-3 px-4">Hostname / Target</th>
                    <th className="py-3 px-4">Subsystem</th>
                    <th className="py-3 px-4">Role &amp; Deployment</th>
                    <th className="py-3 px-4">Ingress / Access</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60 font-mono text-xs">
                  {ipAllocations.map((item) => (
                    <tr
                      key={item.ip + item.hostname}
                      className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                        {item.ip}
                      </td>
                      <td className="py-3 px-4 text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                        {item.hostname}
                      </td>
                      <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400 whitespace-nowrap font-sans">
                        {item.subsystem}
                      </td>
                      <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300 font-sans">
                        {item.role}
                      </td>
                      <td className="py-3 px-4 text-zinc-500 dark:text-zinc-400 font-sans text-xs">
                        {item.ingressType}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* DNS Architecture & Pi-hole */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                Split DNS &amp; Pi-hole Configuration
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Local high-performance DNS resolution orchestrated through
                Pi-hole FTL / dnsmasq with Cloudflare upstream fallback.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="card-minimal rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-semibold">
                <span>okd.conf</span>
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                OKD Core &amp; ETCD Records
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
                Provides forward and reverse PTR resolution for OKD master
                nodes, API endpoints (
                <code className="text-emerald-600 dark:text-emerald-400 font-mono">
                  api.okd.kubesoar.com
                </code>{" "}
                &amp;{" "}
                <code className="text-emerald-600 dark:text-emerald-400 font-mono">
                  api-int
                </code>
                ), apps wildcard (
                <code className="text-emerald-600 dark:text-emerald-400 font-mono">
                  *.apps.okd.kubesoar.com
                </code>
                ), and ETCD SRV records across port 2380.
              </p>
            </div>

            <div className="card-minimal rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-semibold">
                <span>homelab.conf</span>
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                Homelab Istio Wildcard
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
                Directs all{" "}
                <code className="text-emerald-600 dark:text-emerald-400 font-mono">
                  *.homelab.kubesoar.com
                </code>{" "}
                requests directly to the MetalLB Layer 2 LoadBalancer VIP (
                <code className="text-emerald-600 dark:text-emerald-400 font-mono">
                  192.168.1.230
                </code>
                ) fronting the Istio Ingress gateway.
              </p>
            </div>

            <div className="card-minimal rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-semibold">
                <span>quay.conf</span>
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                Quay Registry Stack Records
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
                Maps standalone container infrastructure on laptop-server
                including{" "}
                <code className="text-emerald-600 dark:text-emerald-400 font-mono">
                  quay.kubesoar.com
                </code>{" "}
                (192.168.1.33), PostgreSQL (192.168.1.30), Valkey
                (192.168.1.31), and Quay core (192.168.1.32).
              </p>
            </div>
          </div>
        </section>

        {/* Istio Ambient Mesh & MetalLB */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                Istio Ambient Mesh &amp; MetalLB L2 Ingress
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Sidecarless service mesh architecture delivering transparent
                Layer 4 mTLS and traffic management without sidecar container
                injection overhead.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-minimal rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span>Sidecarless Ambient Architecture</span>
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                Operating Istio in{" "}
                <strong className="text-foreground">ambient profile</strong>{" "}
                separates L4 secure transport from L7 application routing,
                dramatically lowering memory footprint and eliminating pod
                restart requirements during mesh updates.
              </p>
              <ul className="space-y-2 text-xs font-mono text-zinc-700 dark:text-zinc-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>ztunnel:</strong> Node-level DaemonSet handling
                    mutual TLS via HBONE (HTTP-Based Overlay Network
                    Encapsulation)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>istio-cni:</strong> Transparent kernel-level pod
                    traffic redirection into ztunnel
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>OVN-Kubernetes Patch:</strong> Configured with{" "}
                    <code className="text-emerald-600 dark:text-emerald-400">
                      routingViaHost: true
                    </code>{" "}
                    to ensure seamless kubelet liveness/readiness health probes
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Kiali UI (v2.32.0):</strong> Real-time mesh topology
                    visualization connected to Thanos Querier metrics
                  </span>
                </li>
              </ul>
            </div>

            <div className="card-minimal rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Radio className="w-5 h-5 text-emerald-500" />
                <span>MetalLB Layer 2 Load Balancing</span>
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                MetalLB provides standard Kubernetes{" "}
                <code className="text-emerald-600 dark:text-emerald-400 font-mono">
                  LoadBalancer
                </code>{" "}
                service functionality across the bare-metal environment via
                Layer 2 ARP advertisements.
              </p>
              <ul className="space-y-2 text-xs font-mono text-zinc-700 dark:text-zinc-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>IPAddressPool:</strong> Dedicated range{" "}
                    <code className="text-emerald-600 dark:text-emerald-400">
                      192.168.1.230-192.168.1.249
                    </code>{" "}
                    for cluster services
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Istio Ingress Gateway:</strong> Statically bound to
                    VIP{" "}
                    <code className="text-emerald-600 dark:text-emerald-400">
                      192.168.1.230
                    </code>{" "}
                    for all{" "}
                    <code className="text-emerald-600 dark:text-emerald-400">
                      *.homelab.kubesoar.com
                    </code>{" "}
                    ingress routes
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Dual-Tier Ingress:</strong> Native OpenShift Router
                    on{" "}
                    <code className="text-emerald-600 dark:text-emerald-400">
                      *.apps.okd
                    </code>{" "}
                    alongside Istio Ingress on{" "}
                    <code className="text-emerald-600 dark:text-emerald-400">
                      *.homelab
                    </code>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Cert-Manager &amp; Cloudflare:</strong> Automated
                    wildcard TLS issued via Cloudflare DNS-01 challenge
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Identity, SSO & Security */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                Identity Federation &amp; Secrets Management
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Centralized authentication and zero-trust secrets lifecycle
                management across OpenShift, Keycloak, OpenBao, and Microsoft
                Entra ID.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Keycloak & Entra ID */}
            <div className="card-minimal rounded-lg p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-semibold mb-3">
                  <KeyRound className="w-4 h-4" />
                  <span>Keycloak Operator v26.7</span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">
                  Keycloak &amp; Microsoft Entra ID
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Multi-instance Keycloak deployment backed by an HA
                  CloudNativePG PostgreSQL cluster. Authenticates upstream users
                  against Microsoft Entra ID with mapped security groups (
                  <code className="text-emerald-600 dark:text-emerald-400 font-mono">
                    homelab-user
                  </code>
                  ) and provides OIDC federation for cluster apps.
                </p>
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-xs font-mono text-zinc-600 dark:text-zinc-400">
                  <p>
                    • Realm: <span className="text-foreground">homelab</span>
                  </p>
                  <p>
                    • Ingress:{" "}
                    <span className="text-foreground">
                      keycloak.homelab.kubesoar.com
                    </span>
                  </p>
                  <p>• EDP Operator: Declarative CRDs</p>
                </div>
              </div>
            </div>

            {/* OpenBao */}
            <div className="card-minimal rounded-lg p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-semibold mb-3">
                  <Lock className="w-4 h-4" />
                  <span>OpenBao HA (Vault)</span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">
                  OpenBao Secrets Engine
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  High-Availability OpenBao cluster (3 replicas) backed by a
                  dedicated CloudNativePG PostgreSQL database cluster.
                  Integrated with Keycloak OIDC for single sign-on
                  authentication and automated unseal orchestration.
                </p>
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-xs font-mono text-zinc-600 dark:text-zinc-400">
                  <p>
                    • Backend:{" "}
                    <span className="text-foreground">
                      CloudNativePG HA Cluster
                    </span>
                  </p>
                  <p>
                    • Ingress:{" "}
                    <span className="text-foreground">
                      openbao.homelab.kubesoar.com
                    </span>
                  </p>
                  <p>• Auth: Keycloak OIDC Role Mapping</p>
                </div>
              </div>
            </div>

            {/* OKD OAuth */}
            <div className="card-minimal rounded-lg p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-semibold mb-3">
                  <ShieldCheck className="w-4 h-4" />
                  <span>OKD OAuth Integration</span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">
                  Cluster OAuth &amp; RBAC
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Native OpenShift cluster authentication federated through
                  Keycloak Homelab Realm and Microsoft Entra ID. Enables
                  zero-touch administrative login via{" "}
                  <code className="text-emerald-600 dark:text-emerald-400 font-mono">
                    oc login --web
                  </code>{" "}
                  and Web Console SSO.
                </p>
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-xs font-mono text-zinc-600 dark:text-zinc-400">
                  <p>
                    • IdP:{" "}
                    <span className="text-foreground">
                      Keycloak Homelab Realm
                    </span>
                  </p>
                  <p>
                    • Callback:{" "}
                    <span className="text-foreground">
                      oauth-openshift.apps.okd
                    </span>
                  </p>
                  <p>• Security: Kyverno restricted-v2</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quay Registry & Pull-Through Caching */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                Quay Container Registry &amp; Node Pull-Through Caching
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Self-hosted container registry with global cluster pull caching
                for optimized builds and offline resilience.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-minimal rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Server className="w-5 h-5 text-emerald-500" />
                <span>Standalone Quay Registry Stack</span>
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                Deployed via Podman and Ansible on{" "}
                <code className="text-emerald-600 dark:text-emerald-400 font-mono">
                  laptop-server
                </code>
                , the registry delivers full image lifecycle management, robot
                accounts, and Microsoft Entra ID OIDC SSO.
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">
                    REGISTRY UI &amp; API
                  </span>
                  <span className="font-semibold text-foreground">
                    quay.kubesoar.com
                  </span>
                </div>
                <div className="p-3 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">
                    CACHE LAYER
                  </span>
                  <span className="font-semibold text-foreground">
                    Valkey (Redis)
                  </span>
                </div>
                <div className="p-3 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">
                    METADATA DATABASE
                  </span>
                  <span className="font-semibold text-foreground">
                    PostgreSQL 16
                  </span>
                </div>
                <div className="p-3 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">
                    TLS TERMINATION
                  </span>
                  <span className="font-semibold text-foreground">
                    Nginx + Certbot DNS-01
                  </span>
                </div>
              </div>
            </div>

            <div className="card-minimal rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-emerald-500" />
                <span>Cluster Pull-Through Mirroring</span>
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                OKD nodes are configured with{" "}
                <strong className="text-foreground">
                  ImageDigestMirrorSet
                </strong>{" "}
                and{" "}
                <strong className="text-foreground">ImageTagMirrorSet</strong>{" "}
                CRDs managed by the Machine Config Operator, routing container
                image pulls through local cache mirrors.
              </p>
              <ul className="space-y-2 text-xs font-mono text-zinc-700 dark:text-zinc-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>DockerHub &amp; Quay.io Cache:</strong> Transparent
                    local pull acceleration to reduce external WAN bandwidth
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Global Cluster Pull Secret:</strong> Node-level auth
                    synchronization in{" "}
                    <code className="text-emerald-600 dark:text-emerald-400">
                      openshift-config
                    </code>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>CRI-O Daemon:</strong> Automated configuration
                    injection via{" "}
                    <code className="text-emerald-600 dark:text-emerald-400">
                      /etc/containers/registries.conf
                    </code>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Platform Engineering & CI/CD */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                Platform Operations, CI/CD &amp; Storage
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Automated runners, dynamic local storage, and cluster policy
                enforcement.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="card-minimal rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-semibold">
                <GitBranch className="w-4 h-4" />
                <span>GitHub ARC Controller</span>
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                Actions Runner Controller
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
                <code className="text-emerald-600 dark:text-emerald-400 font-mono">
                  gha-runner-scale-set-controller
                </code>{" "}
                dynamically provisions ephemeral container runners inside the
                cluster, executing private CI/CD builds for this site and
                automation jobs.
              </p>
            </div>

            <div className="card-minimal rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-semibold">
                <HardDrive className="w-4 h-4" />
                <span>LVMS Dynamic Storage</span>
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                LVM Storage Operator
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
                Dynamic persistent volume provisioning backed by raw{" "}
                <code className="text-emerald-600 dark:text-emerald-400 font-mono">
                  /dev/vdb
                </code>{" "}
                data disks across master nodes. Powers stateful workloads
                including CloudNativePG PostgreSQL and monitoring.
              </p>
            </div>

            <div className="card-minimal rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-semibold">
                <Activity className="w-4 h-4" />
                <span>Datadog Observability</span>
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                Observability &amp; BYOC Logs
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
                Host-level agent container alongside in-cluster{" "}
                <code className="text-emerald-600 dark:text-emerald-400 font-mono">
                  DatadogAgent
                </code>{" "}
                CR. Ingests logs and telemetry with an on-premises CloudPrem
                BYOC backend (MinIO &amp; PostgreSQL).
              </p>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="font-mono text-sm text-zinc-600 dark:text-zinc-400">
            <span>
              Explore the code repository and automation makefile on GitHub.
            </span>
          </div>
          <div className="flex items-center gap-4 font-mono text-sm">
            <a
              href="https://github.com/josephaw1022/okd-sno-manual-install"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 font-medium transition-colors flex items-center gap-2 rounded-sm shadow-sm"
            >
              <span>view_okd_repo</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <Link
              href="/skills"
              className="px-5 py-2.5 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2 rounded-sm"
            >
              <span>skills.yaml</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
