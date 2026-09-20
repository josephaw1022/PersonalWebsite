---
globs: "infra/**"
---

# Infrastructure Deployment

The runner infrastructure on the cluster is configured via the `./infra/arc-setup.sh` script.
Workload infrastructure (Deployment, Service, Image Pull Secret, Ingress) is bootstrapped idempotently using the GitHub Actions `Bootstrap Cluster Infrastructure` workflow (`.github/workflows/bootstrap-cluster.yml`). Continuous deployment to the dev environment (`personal-site-dev-envs`) is handled by `.github/workflows/deploy-dev.yml`, and production deployment (`personal-site`) is handled manually via `.github/workflows/deploy-prod.yml`. Both workflows share deployment execution via `.github/actions/deploy-workload`.
