---
globs: "{infra/**,charts/**}"
---

# Infrastructure Deployment

The runner infrastructure on the cluster is configured via the `./infra/arc-setup.sh` script.
Workload infrastructure (Deployment, Service, Ingress, PodDisruptionBudget) is packaged as a Helm chart in `charts/personal-site/` with unit tests executed via `helm-unittest`. Cluster workloads are bootstrapped using the GitHub Actions `Bootstrap Cluster Infrastructure` workflow (`.github/workflows/bootstrap-cluster.yml`). Continuous deployment to the dev environment (`personal-site-dev-envs`) is handled by `.github/workflows/deploy-dev.yml` using `charts/personal-site/values-dev.yaml`, and production deployment (`personal-site`) is handled via `.github/workflows/deploy-prod.yml` using `charts/personal-site/values-prod.yaml`. Both workflows share deployment execution via `.github/actions/deploy-workload`.
