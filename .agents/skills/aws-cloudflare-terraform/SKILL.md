---
name: aws-cloudflare-terraform
description: Provision and manage AWS ECS Fargate, Cloudflare Zero Trust Tunnel, and S3 backend infrastructure using Terraform and GitHub Actions.
---

## AWS & Cloudflare Terraform Infrastructure

Manages temporary cloud infrastructure powering the website on AWS ECS Fargate with Cloudflare Zero Trust Tunnel routing while the homelab cluster is offline.

### Directory Structure

- `terraform/network.tf`: VPC, subnets, route tables, and ECS security groups.
- `terraform/ecs.tf`: ECS cluster, task definitions (`personal-site`, `cloudflared`, and `datadog-agent` sidecars), and service.
- `terraform/datadog.tf`: Datadog AWS account-level integration (`datadog_integration_aws_account`) and IAM integration role/policies.
- `terraform/cloudflare.tf`: Zero Trust Tunnel, ingress rules, and DNS records.
- `terraform/health_check.tf`: Route 53 health check, CloudWatch alarm, and SNS topic/subscriptions.
- `terraform/versions.tf`: Provider requirements and S3 remote backend configuration.
- `terraform/variables.tf` / `outputs.tf`: Variable definitions and output values.

### Prerequisite Setup

- `./infra/aws-setup.sh`: Bootstraps the S3 remote state bucket, GitHub Actions OIDC IAM role, and repository secrets/variables.

### Workflows

- `.github/workflows/build-and-push-ghcr.yaml`: Builds and pushes Next.js container image to GHCR.
- `.github/workflows/update-ecs-image-tag.yml`: Automatically creates a PR updating the ECS image tag in Terraform when a GHCR image build finishes.
- `.github/workflows/deploy-aws.yml`: Runs Terraform plan and apply to provision infrastructure and update ECS tasks via GitHub Actions OIDC.
