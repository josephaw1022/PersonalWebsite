---
trigger: glob
globs: "infra/**, charts/**, terraform/**"
description: "Infrastructure deployment guidelines distinguishing OpenShift homelab cluster workloads and AWS cloud fallback hosting."
---

# Infrastructure Deployment

Deployments are divided into two distinct infrastructure environments:

## OpenShift Infrastructure

Responsible for the primary homelab OpenShift cluster:

- Runner infrastructure configured via `./infra/arc-setup.sh`.
- Workload infrastructure (Deployment, Service, Ingress, PodDisruptionBudget) packaged as a Helm chart in `charts/personal-site/` with unit tests executed via `helm-unittest`.
- Cluster workloads bootstrapped via `.github/workflows/bootstrap-cluster.yml`.
- Deployments automated to dev (`personal-site-dev-envs`) via `.github/workflows/deploy-dev.yml` and production (`personal-site`) via `.github/workflows/deploy-prod.yml` using `.github/actions/deploy-workload`.

## AWS Infrastructure

Responsible for temporary AWS ECS Fargate and Cloudflare fallback hosting:

- Cloud infrastructure and Cloudflare Zero Trust Tunnel managed via Terraform in `terraform/`.
- Prerequisite AWS S3 state bucket and GitHub Actions OIDC role bootstrapped via `./infra/aws-setup.sh`.
- Container images built and pushed to GitHub Container Registry (GHCR) via `.github/workflows/build-and-push-ghcr.yaml`.
- Infrastructure provisioning and ECS task deployments automated via `.github/workflows/deploy-aws.yml`.
