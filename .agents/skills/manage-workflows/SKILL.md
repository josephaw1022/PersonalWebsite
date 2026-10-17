---
name: manage-workflows
description: Manage GitHub Actions workflow states (enable/disable) for PersonalWebsite. Use when toggling homelab OpenShift cluster workflows on or off during temporary hosting transitions (such as running on AWS ECS Fargate while the homelab cluster is offline), or when inspecting and managing workflow availability using the GitHub CLI.
paths:
  - ".github/workflows/**"
  - ".agents/skills/manage-workflows/**"
---

## Workflow Management

Manage GitHub Actions workflow activation states using the GitHub CLI (`gh`). This is primarily used to toggle off homelab OpenShift workflows while the site is temporarily hosted on AWS ECS Fargate, preventing failed or stuck job runs on offline self-hosted runners.

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

### Scripts

The skill provides scripts to toggle all homelab workflows:

#### Disable Homelab Workflows

Disables all OpenShift and self-hosted runner workflows idempotently using `gh workflow disable`:

```bash
bash .agents/skills/manage-workflows/scripts/disable-homelab-workflows.sh
```

#### Enable Homelab Workflows

Re-enables all OpenShift and self-hosted runner workflows using `gh workflow enable` once the homelab cluster is back online:

```bash
bash .agents/skills/manage-workflows/scripts/enable-homelab-workflows.sh
```

### Manual Inspection & Management

To view current workflow states:

```bash
gh workflow list --all
```

To enable or disable individual workflows manually:

```bash
gh workflow disable <workflow-filename>
gh workflow enable <workflow-filename>
```
