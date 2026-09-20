---
name: environment-deployments
description: Multi-environment deployment model (dev vs prod), namespaces, and routing.
---

# Environment Deployments

Workloads are deployed across two cluster environments:

- **Development (`personal-site-dev-envs`)**:
  - Automatically deployed on push to `main` via `.github/workflows/deploy-dev.yml`.
  - Ingress configured with `istio` ingress class for `jwhiteaker.homelab.kubesoar.com`.
  - Runner ServiceAccount in `personal-site` has `admin` RBAC over this namespace.

- **Production (`personal-site`)**:
  - Deployed manually via `workflow_dispatch` in `.github/workflows/deploy-prod.yml`.
  - No Ingress; external access is handled via Cloudflare Tunnel.

Deployment execution is shared via composite action `.github/actions/deploy-workload`.
Workloads in both environments can be bootstrapped via `.github/workflows/bootstrap-cluster.yml`.
