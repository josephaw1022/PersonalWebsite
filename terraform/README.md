# AWS ECS + Cloudflare Tunnel Terraform

This directory provisions a lightweight, serverless AWS ECS Fargate deployment for the Personal Website alongside a Cloudflare Zero Trust Tunnel (`cloudflared`) sidecar container and the corresponding Cloudflare DNS and tunnel routing configuration.

## Architecture

1. **AWS ECS Task (Fargate, `awsvpc` network mode)**:
   - **`personal-site` container**: Pulls the public container image from GitHub Container Registry (`ghcr.io/josephaw1022/personalwebsite:latest`) and listens on `localhost:3000`.
   - **`cloudflared` sidecar container**: Waits for the `personal-site` health check to pass, authenticates using the tunnel token stored in AWS SSM Parameter Store (`SecureString`), and proxies incoming Cloudflare Tunnel requests directly to `http://localhost:3000`.
2. **Zero Inbound Ports**:
   - The ECS security group has **no inbound rules**. All external traffic enters through Cloudflare's edge and is delivered over the outbound encrypted Cloudflare Tunnel connection.
3. **Cloudflare Zero Trust & DNS**:
   - Creates a managed Cloudflare Tunnel (`cloudflare_zero_trust_tunnel_cloudflared`).
   - Configures tunnel ingress rules routing `jwhiteaker22.com` and `www.jwhiteaker22.com` to `http://localhost:3000`.
   - Provisions proxied `CNAME` DNS records pointing `@` and `www` to `<tunnel-id>.cfargotunnel.com`.
4. **S3 Remote State Backend**:
   - Uses an encrypted S3 bucket with versioning and native S3 lockfiles (`use_lockfile = true`).

## 1. Bootstrap AWS S3 State Bucket & GitHub OIDC Role

Run the bootstrap script to create the S3 state bucket, GitHub Actions OIDC identity provider, IAM role, and least-privilege IAM policy (and automatically sync `AWS_ROLE_ARN`, `AWS_REGION`, and `TF_STATE_BUCKET` to GitHub repository variables):

```bash
./infra/aws-setup.sh
```

## 2. Deploy via GitHub Actions

Ensure `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, and `CLOUDFLARE_ZONE_ID` are set in GitHub repository secrets, then trigger the workflow:

```bash
gh workflow run deploy-aws.yml -f action=apply
```

## Local Usage

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your Cloudflare Account ID, Zone ID, and API Token

terraform init \
  -backend-config="bucket=personal-site-tfstate-<AWS_ACCOUNT_ID>" \
  -backend-config="region=us-east-1"
terraform plan
terraform apply
```
