---
name: aws-cloudflare-terraform
description: Provision and manage AWS ECS Fargate, Cloudflare Zero Trust Tunnel, and S3 backend infrastructure using Terraform and GitHub Actions. Use when modifying terraform configurations, running aws-setup.sh bootstrap, or deploying to AWS ECS.
paths:
  - "terraform/**"
  - "infra/aws-setup.sh"
  - ".github/workflows/deploy-aws.yml"
  - ".github/workflows/build-and-push-ghcr.yaml"
---

## AWS ECS & Cloudflare Terraform Infrastructure

This skill covers the temporary cloud infrastructure powering the website while the homelab OpenShift cluster is offline. It deploys a low-cost, serverless AWS ECS Fargate task with a Cloudflare Zero Trust Tunnel (`cloudflared`) sidecar container.

### Architecture

1. **AWS ECS Fargate (`terraform/ecs.tf`)**:
   - Runs in `awsvpc` network mode across public VPC subnets (`terraform/network.tf`).
   - Sized minimally (0.25 vCPU, 512 MiB RAM) to minimize hosting expenses.
   - Dual container task definition:
     - `personal-site`: Next.js standalone application pulling public image from GitHub Container Registry (`ghcr.io/josephaw1022/personalwebsite:latest`) listening on port 3000.
     - `cloudflared`: Sidecar running `cloudflare/cloudflared:latest` that starts after the application health check passes. It connects outbound to Cloudflare's edge using the tunnel token stored in AWS SSM Parameter Store (`/personal-site/cloudflare-tunnel-token`).
2. **Zero Inbound Security Group Rules**:
   - The ECS security group allows only outbound HTTPS/DNS traffic; there are no inbound ingress rules. All incoming web requests arrive securely through the encrypted Cloudflare Tunnel.
3. **Cloudflare Zero Trust & DNS (`terraform/cloudflare.tf`)**:
   - Provisions a Cloudflare Tunnel (`cloudflare_zero_trust_tunnel_cloudflared`) and tunnel configuration routing `jwhiteaker22.com` and `www.jwhiteaker22.com` to `http://localhost:3000`.
   - Creates proxied `CNAME` records pointing `@` and `www` to `<tunnel-id>.cfargotunnel.com`.
4. **Remote State Backend (`terraform/versions.tf`)**:
   - Encrypted S3 bucket with versioning and native S3 lockfiles (`use_lockfile = true`), eliminating DynamoDB costs.

### Automation & Workflows

- **Bootstrap AWS & GitHub OIDC (`./infra/aws-setup.sh`)**:
  - Sets up the S3 state bucket, IAM role with least-privilege policy, GitHub Actions OIDC provider, and updates GitHub repository variables/secrets (`AWS_ROLE_ARN`, `AWS_REGION`, `TF_STATE_BUCKET`, Cloudflare credentials).
  - Accepts flags such as `--profile`, `--region`, `--bucket`, `--role-name`, and Cloudflare parameters.
- **Build & Push GHCR Container Image (`.github/workflows/build-and-push-ghcr.yaml`)**:
  - Builds Next.js container image and pushes to `ghcr.io/josephaw1022/personalwebsite` with short SHA, full SHA, and `latest` tags on push to `main` or manual trigger.
- **Deploy Infrastructure Workflow (`.github/workflows/deploy-aws.yml`)**:
  - Assumes AWS IAM role via GitHub OIDC without static AWS credentials.
  - Runs Terraform fmt check, init, validate, plan, and apply (supports `destroy` via `workflow_dispatch`).

### Local Terraform Operations

To run terraform commands locally:
```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Provide Cloudflare account and zone IDs

terraform init \
  -backend-config="bucket=<TF_STATE_BUCKET>" \
  -backend-config="region=us-east-1"
terraform plan
terraform apply
```
