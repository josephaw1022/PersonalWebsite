---
name: deploying-to-infra
description: Configure cluster runner infrastructure with arc-setup.sh and bootstrap/deploy workloads on OKD/OpenShift. Use when working with runner infrastructure or deploying cluster workloads.
paths:
  - "infra/**"
---

## Deploying to Infrastructure

Cluster runner infrastructure is managed via `./infra/arc-setup.sh`, while application workloads (Deployment, Service, Image Pull Secret) are bootstrapped and deployed using GitHub Actions workflows.

### Implementation

- **GitHub Actions Runner Controller (ARC) Setup:** `./infra/arc-setup.sh`
- **Workload Bootstrap:** `.github/workflows/bootstrap-cluster.yml`
- **Continuous Deployment (Dev):** `.github/workflows/deploy-dev.yml`
- **Manual Deployment (Production):** `.github/workflows/deploy-prod.yml`
- **Shared Deployment Action:** `.github/actions/deploy-workload`

#### ARC Setup Process (`arc-setup.sh`):

1. Configures the GitHub Actions Runner Controller (ARC) scale set on the cluster in the `personal-site` namespace.
2. Requires `--app-id`, `--installation-id`, and `--private-key-file` arguments for GitHub App authentication (or loaded from `.env`).
3. Sets up the ServiceAccount, RoleBinding (`admin`), runner authentication Secret, and installs/upgrades the runner scale set using Helm.

#### Bootstrap Workflow (`bootstrap-cluster.yml`):

1. Triggered manually via `workflow_dispatch`.
2. Runs on the self-hosted `personal-site-runner`.
3. Idempotently creates or updates the container registry pull secret (`quay-pull-secret`).
4. Idempotently applies the Next.js `Deployment` (3 replicas, OpenShift/Istio telemetry labels) and `ClusterIP` `Service`.
5. Verifies rollout status.

To set up CI/CD runners, run `bash infra/arc-setup.sh` with the required GitHub App credentials. Once runners are online, trigger the **Bootstrap Cluster Infrastructure** workflow in GitHub Actions to bootstrap workloads on the cluster.
