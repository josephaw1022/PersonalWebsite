---
name: aws-cloudflare-terraform
description: Provision and manage AWS ECS Fargate, Cloudflare Zero Trust Tunnel, and S3 backend infrastructure using Terraform and GitHub Actions.
---

## AWS & Cloudflare Terraform Infrastructure

Manages temporary cloud infrastructure powering the website on AWS ECS Fargate with Cloudflare Zero Trust Tunnel routing while the homelab cluster is offline.

### Directory Structure

- `terraform/network.tf`: VPC, subnets, route tables, and ECS security groups.
- `terraform/ecs.tf`: ECS cluster (`containerInsights` disabled), task execution and task IAM roles, task definitions (`personal-site`, `cloudflared`, `datadog-log-router` FireLens Fluent Bit sidecar, and `datadog-agent` sidecar with shared `dd-sockets` volume), service, Application Auto Scaling target and policies (CPU and memory target tracking up to 5 tasks), CloudWatch subscription filter and Lambda permission for the `/ecs/${var.project_name}` FireLens router log group, and EventBridge rule routing ECS task, deployment, and service state changes to Datadog Forwarder.
- `terraform/datadog.tf`: Datadog AWS account-level integration (`datadog_integration_aws_account`), IAM integration role/policies, and Datadog Forwarder CloudFormation stack (`aws_cloudformation_stack.datadog_forwarder`).
- `terraform/cloudflare.tf`: Zero Trust Tunnel, ingress rules, and DNS records.
- `terraform/health_check.tf`: Datadog Synthetics HTTP API test (`datadog_synthetics_test.site_health`) monitoring the public HTTPS endpoint and alerting via Datadog monitor notifications.
- `terraform/versions.tf`: Provider requirements and S3 remote backend configuration.
- `terraform/variables.tf` / `outputs.tf`: Variable definitions and output values.

### Prerequisite Setup

- `./infra/aws-setup.sh`: Bootstraps the S3 remote state bucket, GitHub Actions OIDC IAM role, and repository secrets/variables.

### Workflows

- `.github/workflows/build-and-push-ghcr.yaml`: Builds and pushes Next.js container image to GHCR.
- `.github/workflows/update-ecs-image-tag.yml`: Automatically creates a PR updating the ECS image tag in Terraform when a GHCR image build finishes.
- `.github/workflows/deploy-aws.yml`: Runs Terraform plan and apply to provision infrastructure and update ECS tasks via GitHub Actions OIDC.
