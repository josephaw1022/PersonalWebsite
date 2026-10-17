---
name: manage-workflows
description: Manage GitHub Actions workflow states (enable/disable) and manually dispatch workflow runs for PersonalWebsite. Use when toggling homelab OpenShift workflows on or off during temporary hosting transitions (such as running on AWS ECS Fargate while the homelab cluster is offline), inspecting workflow availability, or running manual workflow dispatch scripts using the GitHub CLI.
paths:
  - ".github/workflows/**"
  - ".agents/skills/manage-workflows/**"
---

## Workflow Management

Manage GitHub Actions workflow activation states and manually trigger workflows using the GitHub CLI (`gh`).

### Workflow Categories

#### Homelab / OpenShift Cluster Workflows

These workflows depend on the self-hosted GitHub Actions Runner Controller (ARC) runner (`personal-site-runner`) deployed inside the homelab OpenShift cluster:

- `.github/workflows/bootstrap-cluster.yml` (**Cluster Infrastructure - Bootstrap**): Bootstraps cluster namespaces, quotas, pull secrets, and Helm releases.
- `.github/workflows/build-and-push.yaml` (**Container Image - Build & Push**): Builds container images on self-hosted runners and triggers dev deployment.
- `.github/workflows/deploy-dev.yml` (**Deploy Personal Site - Development**): Deploys the Helm chart to the `personal-site-dev-envs` OpenShift namespace.
- `.github/workflows/deploy-prod.yml` (**Deploy Personal Site - Production**): Deploys the Helm chart to the `personal-site` OpenShift namespace.

When the homelab cluster is offline, these workflows must be disabled so pushes to `main` do not queue indefinitely or fail.

#### AWS Cloud Workflows (Active During Temporary Hosting)

These workflows run on GitHub-hosted runners (`ubuntu-latest`) and manage the temporary AWS infrastructure:

- `.github/workflows/build-and-push-ghcr.yaml` (**Container Image - Build & Push (GHCR)**): Builds and pushes images to GHCR.
- `.github/workflows/deploy-aws.yml` (**Deploy Personal Site - AWS (Terraform)**): Provisions AWS ECS Fargate and Cloudflare Tunnel resources.
- `.github/workflows/update-ecs-image-tag.yml` (**Deploy Personal Site - Update ECS Image Tag**): Automatically opens a pull request updating the ECS image tag in Terraform when a GHCR container build finishes (requires "Allow GitHub Actions to create and approve pull requests" enabled in repo settings or configured via `aws-setup.sh`).

#### Pull Request & CI Verification Workflows

These workflows run on GitHub-hosted runners (`ubuntu-latest`) to test and validate PRs:

- `.github/workflows/pr-build.yaml` (**Pull Request - Build Check**): Validates Next.js build.
- `.github/workflows/pr-codeql.yaml` (**Pull Request - CodeQL Scan**): Performs security analysis.
- `.github/workflows/pr-e2e-tests.yaml` (**Pull Request - E2E Tests**): Runs Playwright end-to-end tests.
- `.github/workflows/pr-format.yaml` (**Pull Request - Format Check**): Validates Prettier and ESLint formatting.
- `.github/workflows/pr-gitleaks.yaml` (**Pull Request - GitLeaks Scan**): Scans for hardcoded secrets.
- `.github/workflows/pr-helm-unit-tests.yaml` (**Pull Request - Helm Unit Tests**): Lints and tests Helm charts.
- `.github/workflows/pr-trivy.yaml` (**Pull Request - Trivy Security Scan**): Scans repository vulnerabilities.
- `.github/workflows/pr-unit-tests.yaml` (**Pull Request - Unit Tests**): Runs Jest unit tests.

---

## State Toggle Scripts

Use these scripts to toggle workflow categories en masse:

### Homelab Workflows

#### Disable Homelab Workflows
Disables all OpenShift self-hosted runner workflows idempotently using `gh workflow disable`:
```bash
bash .agents/skills/manage-workflows/scripts/disable-homelab-workflows.sh
```

#### Enable Homelab Workflows
Re-enables all OpenShift self-hosted runner workflows using `gh workflow enable`:
```bash
bash .agents/skills/manage-workflows/scripts/enable-homelab-workflows.sh
```

### AWS Terraform Workflows

#### Disable AWS Terraform Workflows
Disables `deploy-aws.yml` and `update-ecs-image-tag.yml` using `gh workflow disable`:
```bash
bash .agents/skills/manage-workflows/scripts/disable-aws-terraform-workflows.sh
```

#### Enable AWS Terraform Workflows
Re-enables `deploy-aws.yml` and `update-ecs-image-tag.yml` using `gh workflow enable`:
```bash
bash .agents/skills/manage-workflows/scripts/enable-aws-terraform-workflows.sh
```

### GHCR Container Image Build Workflows

#### Disable GHCR Build Workflows
Disables `build-and-push-ghcr.yaml` using `gh workflow disable`:
```bash
bash .agents/skills/manage-workflows/scripts/disable-ghcr-build-workflows.sh
```

#### Enable GHCR Build Workflows
Re-enables `build-and-push-ghcr.yaml` using `gh workflow enable`:
```bash
bash .agents/skills/manage-workflows/scripts/enable-ghcr-build-workflows.sh
```

---

## Manual Workflow Dispatch Scripts

Per the project rule, every workflow supporting `workflow_dispatch` has a corresponding runner script in `.agents/skills/manage-workflows/scripts/`:

### Cloud & Deployment Workflows

#### `run-deploy-aws.sh`
Dispatches `deploy-aws.yml`.
```bash
# Usage: run-deploy-aws.sh [action: apply|plan|destroy] [image_tag] [ref]
bash .agents/skills/manage-workflows/scripts/run-deploy-aws.sh apply latest
```

#### `run-update-ecs-image-tag.sh`
Dispatches `update-ecs-image-tag.yml`.
```bash
# Usage: run-update-ecs-image-tag.sh [image_tag] [ref]
bash .agents/skills/manage-workflows/scripts/run-update-ecs-image-tag.sh
```

#### `run-build-and-push-ghcr.sh`
Dispatches `build-and-push-ghcr.yaml`.
```bash
# Usage: run-build-and-push-ghcr.sh [ref]
bash .agents/skills/manage-workflows/scripts/run-build-and-push-ghcr.sh
```

#### `run-deploy-dev.sh`
Dispatches `deploy-dev.yml`.
```bash
# Usage: run-deploy-dev.sh [tag] [ref]
bash .agents/skills/manage-workflows/scripts/run-deploy-dev.sh
```

#### `run-deploy-prod.sh`
Dispatches `deploy-prod.yml`.
```bash
# Usage: run-deploy-prod.sh [tag] [ref]
bash .agents/skills/manage-workflows/scripts/run-deploy-prod.sh
```

#### `run-bootstrap-cluster.sh`
Dispatches `bootstrap-cluster.yml`.
```bash
# Usage: run-bootstrap-cluster.sh [target_env: all|production|development|runners] [tag] [secret_name] [ref]
bash .agents/skills/manage-workflows/scripts/run-bootstrap-cluster.sh all latest quay-pull-secret
```

#### `run-build-and-push.sh`
Dispatches `build-and-push.yaml`.
```bash
# Usage: run-build-and-push.sh [ref]
bash .agents/skills/manage-workflows/scripts/run-build-and-push.sh
```

### PR & Quality Check Workflows

Trigger PR workflows on-demand against any branch or commit ref:

```bash
# Usage: <script> [ref]
bash .agents/skills/manage-workflows/scripts/run-pr-build.sh [ref]
bash .agents/skills/manage-workflows/scripts/run-pr-codeql.sh [ref]
bash .agents/skills/manage-workflows/scripts/run-pr-e2e-tests.sh [ref]
bash .agents/skills/manage-workflows/scripts/run-pr-format.sh [ref]
bash .agents/skills/manage-workflows/scripts/run-pr-gitleaks.sh [ref]
bash .agents/skills/manage-workflows/scripts/run-pr-helm-unit-tests.sh [ref]
bash .agents/skills/manage-workflows/scripts/run-pr-trivy.sh [ref]
bash .agents/skills/manage-workflows/scripts/run-pr-unit-tests.sh [ref]
```

---

## Manual Inspection & Management

To view current workflow states:

```bash
gh workflow list --all
```

To enable or disable individual workflows manually:

```bash
gh workflow disable <workflow-filename>
gh workflow enable <workflow-filename>
```
