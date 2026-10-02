# Personal Website

A modern Next.js website containerized and hosted on a homelab OpenShift cluster. External traffic is securely routed through an encrypted Cloudflare Tunnel directly to in-cluster services without exposing open ingress ports.

**Live:** [jwhiteaker22.com](https://jwhiteaker22.com)

---

## Architecture & Cloudflare Routing

- **Cloudflare Edge & Tunnel:** DNS and edge routing are managed via Cloudflare. An in-cluster `cloudflared` connector establishes an outbound encrypted tunnel to Cloudflare's edge network, routing requests directly to internal Kubernetes services.
- **Zero Trust Security:** Eliminates public load balancers and open ingress ports on the homelab cluster. In-cluster NetworkPolicies enforce strict isolation so application namespaces only accept ingress from `cloudflared`.

---

## Infrastructure Setup & Deployment

### 1. Configure In-Cluster Runners (ARC)

Deploy the GitHub Actions Runner Controller (ARC) scale set to the cluster:

```bash
./infra/arc-setup.sh
```

### 2. Bootstrap Cluster Infrastructure

Trigger the cluster bootstrap workflow using the GitHub CLI to provision namespaces, quotas, image pull secrets, and initial Helm releases:

```bash
gh workflow run bootstrap-cluster.yml
```

### 3. Deploy to Environments

Deploy application releases to development or production using Helm workflows:

```bash
# Deploy to Development (personal-site-dev-envs)
gh workflow run deploy-dev.yml

# Deploy to Production (personal-site)
gh workflow run deploy-prod.yml
```

---

## Local Development

```bash
# Start development server (http://localhost:3000)
task dev

# Build and run container locally with Podman
task build-container
task run-container
```
