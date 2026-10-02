---
name: environment-deployments
description: Multi-environment deployment model (dev vs prod), Helm values, namespaces, and routing.
---

# Environment Deployments

Workloads are packaged with Helm (`charts/personal-site`) and deployed across two cluster environments:

- **Development (`personal-site-dev-envs`)**:
  - Automatically deployed on completion of `Container Image - Build & Push`, on `push` to `main` impacting Helm values (`values.yaml`, `values-dev.yaml`) or templates (`templates/**`), or manually via `workflow_dispatch` in `.github/workflows/deploy-dev.yml`.
  - Configured using `charts/personal-site/values-dev.yaml` (HPA autoscaling: 3–5 replicas, Ingress enabled, NetworkPolicies enabled, PDB enabled with minAvailable 1).
  - Ingress configured with `istio` ingress class for `jwhiteaker.homelab.kubesoar.com`.
  - Runner ServiceAccount in `personal-site-runners` has `admin` RBAC over this namespace.

- **Production (`personal-site`)**:
  - Automatically deployed on `push` to `main` impacting Helm values (`values.yaml`, `values-prod.yaml`) or templates (`templates/**`), or manually via `workflow_dispatch` in `.github/workflows/deploy-prod.yml`.
  - Configured using `charts/personal-site/values-prod.yaml` (HPA autoscaling: 3–10 replicas, Ingress disabled, NetworkPolicies enabled, PDB enabled with minAvailable 2).
  - No Ingress; external access is handled via Cloudflare Tunnel.

Deployment execution is shared via composite action `.github/actions/deploy-workload` using `helm upgrade --install`. If no image tag input is provided, candidate tags are resolved and verified in Quay via composite action `.github/actions/resolve-image-tag` (via OCI v2 manifest API and container runtime) before setting the tag override; if unavailable, `--reuse-values` is used to preserve existing release values.
Workloads in both environments can be bootstrapped via `.github/workflows/bootstrap-cluster.yml`, which idempotently applies the namespace declarations, granular ResourceQuotas (CPU, memory, pods, storage, configmaps, secrets, services), and LimitRanges (containers, pods, PVCs) defined under `infra/namespaces/`.
