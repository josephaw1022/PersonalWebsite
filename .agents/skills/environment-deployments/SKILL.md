---
name: environment-deployments
description: Multi-environment deployment model (dev vs prod), Helm values, namespaces, and routing.
---

# Environment Deployments

Workloads are packaged with Helm (`charts/personal-site`) and deployed across two cluster environments:

- **Development (`personal-site-dev-envs`)**:
  - Automatically deployed on push to `main` via `.github/workflows/deploy-dev.yml`.
  - Configured using `charts/personal-site/values-dev.yaml` (HPA autoscaling enabled: 1–5 replicas, Ingress enabled, PDB disabled).
  - Ingress configured with `istio` ingress class for `jwhiteaker.homelab.kubesoar.com`.
  - Runner ServiceAccount in `personal-site` has `admin` RBAC over this namespace.

- **Production (`personal-site`)**:
  - Deployed manually via `workflow_dispatch` in `.github/workflows/deploy-prod.yml`.
  - Configured using `charts/personal-site/values-prod.yaml` (3 replicas, Ingress disabled, PDB enabled with minAvailable 1).
  - No Ingress; external access is handled via Cloudflare Tunnel.

Deployment execution is shared via composite action `.github/actions/deploy-workload` using `helm upgrade --install`.
Workloads in both environments can be bootstrapped via `.github/workflows/bootstrap-cluster.yml`.
