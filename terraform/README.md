# AWS ECS + Cloudflare Tunnel Terraform

This directory provisions a lightweight, serverless AWS ECS Fargate deployment for the Personal Website alongside a Cloudflare Zero Trust Tunnel (`cloudflared`) sidecar container and the corresponding Cloudflare DNS and tunnel routing configuration.

## Architecture

1. **AWS ECS Task (Fargate, `awsvpc` network mode)**:
   - **`personal-site` container**: Pulls the public container image from GitHub Container Registry (`ghcr.io/josephaw1022/personalwebsite:latest`), listens on `localhost:3000`, mounts the shared `dd-sockets` volume at `/var/run/datadog` (`DD_TRACE_AGENT_URL=unix:///var/run/datadog/apm.socket`, `DD_PROFILING_ENABLED=true`), and streams logs directly to Datadog via AWS FireLens (`awsfirelens`).
   - **`cloudflared` sidecar container**: Waits for the `personal-site` health check to pass, authenticates using the tunnel token stored in AWS SSM Parameter Store (`SecureString`), proxies incoming Cloudflare Tunnel requests directly to `http://localhost:3000` while exposing Prometheus metrics on `127.0.0.1:2000/metrics`, and streams logs to Datadog via AWS FireLens.
   - **`datadog-log-router` sidecar container**: Runs AWS for Fluent Bit (`public.ecr.aws/aws-observability/aws-for-fluent-bit:stable`) with FireLens (`enable-ecs-log-metadata=true`) to enrich container logs with ECS task and container metadata (`provider=ecs`) and forward them over HTTPS to Datadog (`http-intake.logs.${var.datadog_site}`).
   - **`datadog-agent` sidecar container**: Runs the Datadog Agent in ECS Fargate mode (`ECS_FARGATE=true`) with an ECS task IAM role (`ecs:ListClusters`, `ecs:ListContainerInstances`, `ecs:DescribeContainerInstances`) and shared `/var/run/datadog` (`dd-sockets`) volume, authenticates using `DD_API_KEY` from AWS SSM Parameter Store (`SecureString`), collects ECS task and container resources for Datadog ECS Explorer (`DD_ECS_TASK_COLLECTION_ENABLED=true`), and monitors both `personal-site` (via `http_check` autodiscovery) and `cloudflared` (via `openmetrics` autodiscovery on `http://127.0.0.1:2000/metrics`).
2. **Datadog AWS Account Integration & Log / Event Forwarding**:
   - Provisions `datadog_integration_aws_account` along with the `DatadogIntegrationRole` IAM role, dynamically chunked `DatadogAWSIntegrationPolicy-*` policies (sourced from `datadog_integration_aws_iam_permissions`), and AWS `SecurityAudit` managed policy attachment for full account-level cloud observability and CSPM.
   - Deploys the official Datadog Forwarder Lambda function (`aws_cloudformation_stack.datadog_forwarder`) using Datadog's official CloudFormation template (`https://datadog-cloudformation-template.s3.amazonaws.com/aws/forwarder/latest.yaml`), registered with `datadog_integration_aws_account` via `logs_config.lambda_forwarder`.
   - Provisions CloudWatch Logs Subscription Filters with explicit Lambda resource-based permissions (`aws_lambda_permission`) for both the application container logs (`/ecs/${var.project_name}`) and cluster performance logs (`/aws/ecs/containerinsights/${var.project_name}-cluster/performance`), ensuring logs stream continuously to Datadog and appear as configured triggers in the AWS Lambda console.
   - Provisions EventBridge rules and Lambda permissions routing AWS events to the Datadog Forwarder:
     - **ECS Task State Changes**: Captures task and container stop/failure events on the ECS cluster.
     - **ECS Container Insights Events**: Routes Container Insights performance log group events from CloudWatch to the Datadog Forwarder via EventBridge.
     - **Route 53 Health Check Alarms**: Captures CloudWatch Alarm state changes for the Route 53 health check (`site_down` alarm).
   - Subscribes the Datadog Forwarder Lambda directly to the `site_alerts` SNS topic with `aws_lambda_permission`, ensuring Route 53 health check alert state transitions trigger Datadog events alongside SMS/email notifications.
   - Enforces a 1-day retention policy (`var.log_retention_days`) across CloudWatch log groups (`/ecs/${var.project_name}`, `/aws/ecs/containerinsights/...`, and `/aws/lambda/...`) to eliminate unnecessary AWS storage costs while archiving logs in Datadog.
3. **Zero Inbound Ports**:
   - The ECS security group has **no inbound rules**. All external traffic enters through Cloudflare's edge and is delivered over the outbound encrypted Cloudflare Tunnel connection.
4. **Application Auto Scaling & Multi-Replica Tunnel Routing**:
   - Provisions AWS Application Auto Scaling (`aws_appautoscaling_target` and `aws_appautoscaling_policy`) targeting the ECS Fargate service, scaling dynamically between `min_capacity` (1) and `max_capacity` (5) tasks based on target tracking policies for CPU (70%) and Memory (80%).
   - Because `cloudflared` runs as a sidecar container in each ECS task alongside `personal-site`, scaling the ECS service from 1 to N tasks automatically scales the active Cloudflare Tunnel connectors from 1 to N.
   - All active `cloudflared` replicas authenticate with Cloudflare's edge using the shared tunnel token. Cloudflare's global Anycast edge automatically balances incoming traffic across all healthy connected replicas, with each replica routing directly to its co-located `personal-site` container over loopback (`http://localhost:3000`).
   - Maintains zero inbound ports and eliminates the need for expensive AWS Application Load Balancers or NAT Gateways.
5. **Cloudflare Zero Trust & DNS**:
   - Creates a managed Cloudflare Tunnel (`cloudflare_zero_trust_tunnel_cloudflared`).
   - Configures tunnel ingress rules routing `jwhiteaker22.com` and `www.jwhiteaker22.com` to `http://localhost:3000`.
   - Provisions proxied `CNAME` DNS records pointing `@` and `www` to `<tunnel-id>.cfargotunnel.com`.
6. **Route 53 Health Check & Downtime Alerts**:
   - Provisions an `HTTPS` Route 53 health check querying the public endpoint (`https://${var.domain_name}/`).
   - CloudWatch metric alarm evaluates `HealthCheckStatus < 1` in `us-east-1` (breaching if the site fails probes).
   - Triggers an AWS SNS topic configured with optional SMS text (`alert_phone_number`) and email (`alert_email`) subscriptions, notifying immediately on downtime and recovery.
7. **S3 Remote State Backend**:
   - Uses an encrypted S3 bucket with versioning and native S3 lockfiles (`use_lockfile = true`).

## 1. Bootstrap AWS S3 State Bucket & GitHub OIDC Role

Run the bootstrap script to create the S3 state bucket, GitHub Actions OIDC identity provider, IAM role, and least-privilege IAM policy (and automatically sync `AWS_ROLE_ARN`, `AWS_REGION`, and `TF_STATE_BUCKET` to GitHub repository variables):

```bash
./infra/aws-setup.sh
```

## 2. Deploy via GitHub Actions

- Container builds pushed to GHCR automatically trigger `.github/workflows/update-ecs-image-tag.yml`, which opens a pull request updating `ghcr_image_tag` in `terraform/variables.tf`.
- Once merged, `.github/workflows/deploy-aws.yml` automatically triggers and applies the updated task definition to the ECS cluster.
- Alternatively, trigger the workflow manually using GitHub CLI:

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
