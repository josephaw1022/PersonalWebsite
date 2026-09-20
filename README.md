# Personal Website

A personal website built with **Next.js**, containerized and hosted on a **homelab OpenShift cluster** with secure external access via **Cloudflare Tunnel**.

**Live at:** [jwhiteaker22.com](https://jwhiteaker22.com)

---

## Deploying To My Homelab OpenShift Cluster & Making It Publicly Accessible

```mermaid
flowchart TB
    subgraph INTERNET["☁️ INTERNET"]
        USER["🌐 User Browser"]
        CF["Cloudflare Edge Network"]
    end

    subgraph CLUSTER["HOMELAB OPENSHIFT CLUSTER"]
        subgraph NS_CF["namespace: cloudflare-connector"]
            CFLD["cloudflared (3 replicas)"]
        end

        subgraph NS_SITE["namespace: personal-site"]
            NP["NetworkPolicy"]
            SVC["Service: personal-site"]
            DEPLOY["personal-site Deployment"]
            PODS["Pods (3 replicas)"]
        end
    end

    USER -->|"jwhiteaker22.com"| CF
    CF <-->|"Encrypted tunnel"| CFLD
    CFLD --> NP
    NP --> SVC
    SVC --> PODS
    DEPLOY --> PODS
```

## How It Works

**1. Domain & DNS**

The domain `jwhiteaker22.com` is registered and managed through Cloudflare's nameservers.

![Cloudflare DNS Records](assets/cloudflare-dns-records.png)

**2. Cloudflare Tunnel**

Instead of exposing the homelab cluster to the internet with a public IP, a `cloudflared` connector runs inside the cluster and establishes an outbound-only encrypted tunnel to Cloudflare's edge network. The tunnel routes are configured in Cloudflare Zero Trust to point `jwhiteaker22.com` to the internal Kubernetes service.

![Cloudflare Tunnel Routes](assets/cloudflare-tunnel-routes.png)

**3. Cloudflared Connector**

The `cloudflared` deployment runs in its own namespace and handles all inbound traffic from Cloudflare's edge network.

![OpenShift Cloudflared Topology](assets/okd-cloudflared-topology.png)

**4. Personal Site Deployment**

The Next.js deployment serves the website application. Traffic is routed from `cloudflared` to the `personal-site` ClusterIP service.

![OpenShift Personal Site Topology](assets/okd-personal-site-topology.png)

**5. Network Security**

A Kubernetes NetworkPolicy restricts the `personal-site` namespace to only accept traffic from the `cloudflared` pods, with egress limited to DNS resolution.

**6. Zero Trust**

No ingress controllers, load balancers, or public IPs are needed on the cluster—all traffic flows through Cloudflare's secure tunnel.

---

## Deployment

1. **Configure Cluster Runners:**

Set up the GitHub Actions Runner Controller (ARC) runner scale set on your OpenShift cluster:

```bash
./infra/arc-setup.sh
```

2. **Bootstrap Workloads:**

Trigger the **Bootstrap Cluster Infrastructure** workflow (`.github/workflows/bootstrap-cluster.yml`) via `workflow_dispatch` in GitHub Actions. This idempotent workflow runs on the in-cluster runners and creates:

- The container image pull secret (`quay-pull-secret`) linked to the default service account
- The 3-replica Next.js `Deployment` configured with telemetry labels
- The `ClusterIP` Service exposing port 80 (target port 3000)
- Verifies rollout completion

---

## Local Development

Run the Next.js development server locally:

```bash
task dev
# or: npm run dev
```

Then visit http://localhost:3000

Alternatively, build and run the production container locally with Podman:

```bash
# Build
task build-container
# or: npm run build && podman build -t personal-site -f Containerfile .

# Run
task run-container
# or: podman run -p 3000:3000 personal-site
```
