---
globs: "infra/**"
---

# Infrastructure Deployment

The runner infrastructure on the cluster is configured via the `./infra/arc-setup.sh` script.
Workload infrastructure (Deployment, Service, Image Pull Secret) is bootstrapped idempotently using the GitHub Actions `Bootstrap Cluster Infrastructure` workflow (`.github/workflows/bootstrap-cluster.yml`), and continuous deployment is handled by `.github/workflows/deploy.yml`.
