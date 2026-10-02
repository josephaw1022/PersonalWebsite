---
name: deploying-to-infra
description: Configure cluster runner infrastructure with arc-setup.sh and bootstrap/deploy workloads on OKD/OpenShift with Helm. Use when working with runner infrastructure or deploying cluster workloads.
paths:
  - "infra/**"
  - "charts/**"
---

## Deploying to Infrastructure

Cluster runner infrastructure is managed via `./infra/arc-setup.sh`, while application workloads (Deployment, Service, Ingress, PodDisruptionBudget, HorizontalPodAutoscaler) are packaged as a Helm chart in `charts/personal-site` and deployed using GitHub Actions workflows.

### Implementation

- **GitHub Actions Runner Controller (ARC) Setup:** `./infra/arc-setup.sh`
- **Application Helm Chart:** `charts/personal-site/`
- **Helm Unit Tests:** `charts/personal-site/tests/` (run with `helm unittest charts/personal-site`)
- **Workload Bootstrap:** `.github/workflows/bootstrap-cluster.yml`
- **Continuous Deployment (Dev):** `.github/workflows/deploy-dev.yml`
- **Manual Deployment (Production):** `.github/workflows/deploy-prod.yml`
- **Shared Tag Resolution Action:** `.github/actions/resolve-image-tag`
- **Shared Deployment Action:** `.github/actions/deploy-workload`

#### Application Packaging & Helm Chart:
1. Chart definition: `charts/personal-site/Chart.yaml`
2. Environment values: `values-dev.yaml` (1 replica, Ingress enabled, PDB disabled) and `values-prod.yaml` (3 replicas, Ingress disabled, PDB enabled with minAvailable: 1).
3. PodDisruptionBudget (PDB): Configurable via `.Values.podDisruptionBudget` for high availability and zero-downtime maintenance.
4. Testing: Tested locally and in CI (`.github/workflows/pr-helm-unit-tests.yaml`) using `helm unittest` plugin.

#### ARC Setup Process (`arc-setup.sh`):

1. Configures the GitHub Actions Runner Controller (ARC) scale set on the cluster in the `personal-site-runners` namespace.
2. Requires `--app-id`, `--installation-id`, and `--private-key-file` arguments for GitHub App authentication (or loaded from `.env`). Supports optional `--arc-version` (auto-detected from controller if omitted, defaulting to 0.15.0).
3. Sets up the ServiceAccount, RoleBindings (`admin`), ClusterRole/ClusterRoleBinding for namespace, limit range, and resource quota management, runner authentication Secret, and installs/upgrades the runner scale set using Helm.

#### Bootstrap Workflow (`bootstrap-cluster.yml`):

1. Triggered automatically on `push` to `main` impacting `infra/namespaces/**` or manually via `workflow_dispatch`.
2. Runs on the self-hosted `personal-site-runner`.
3. Idempotently provisions target namespaces (`infra/namespaces/`), ResourceQuotas, and LimitRanges using `kubectl apply`.
4. Idempotently creates or updates the container registry pull secret (`quay-pull-secret`).
5. Deploys the `personal-site` Helm chart to production and/or dev namespaces if no successful release is currently deployed.
6. Verifies release rollout status.

To set up CI/CD runners, run `bash infra/arc-setup.sh` with the required GitHub App credentials. Once runners are online, trigger the **Cluster Infrastructure - Bootstrap** workflow in GitHub Actions to bootstrap workloads on the cluster.
