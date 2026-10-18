# AWS ECS + Cloudflare Tunnel Terraform

This directory provisions a lightweight, serverless AWS ECS Fargate deployment for the Personal Website alongside a Cloudflare Zero Trust Tunnel (`cloudflared`) sidecar container and the corresponding Cloudflare DNS and tunnel routing configuration.

## Architecture

1. **AWS ECS Task (Fargate, `awsvpc` network mode, `pid_mode = "task"`)**:
   - **`personal-site` container**: Pulls the public container image from GitHub Container Registry (`ghcr.io/josephaw1022/personalwebsite:<tag>`), preloads `dd-trace/init` at Node.js startup (`node --require dd-trace/init server.js`), listens on `localhost:3000`, mounts the shared `dd-sockets` volume at `/var/run/datadog` (`DD_TRACE_ENABLED=true`, `DD_TRACE_AGENT_URL=unix:///var/run/datadog/apm.socket`, `DD_DOGSTATSD_URL=unix:///var/run/datadog/dsd.socket`, `DD_PROFILING_ENABLED=true`, `DD_RUNTIME_METRICS_ENABLED=true`, `DD_LOGS_INJECTION=true`, `DD_GIT_REPOSITORY_URL`), configures Unified Service Tagging via both environment variables (`DD_ENV`, `DD_SERVICE`, `DD_VERSION`) and Docker labels (`com.datadoghq.tags.env`, `com.datadoghq.tags.service`, `com.datadoghq.tags.version`), and streams logs directly to Datadog via AWS FireLens (`awsfirelens`).
   - **`cloudflared` sidecar container**: Waits for the `personal-site` health check to pass, authenticates using the tunnel token stored in AWS SSM Parameter Store (`SecureString`), proxies incoming Cloudflare Tunnel requests directly to `http://localhost:3000` while exposing Prometheus metrics on `127.0.0.1:2000/metrics`, and streams logs to Datadog via AWS FireLens.
   - **`datadog-log-router` sidecar container**: Runs AWS for Fluent Bit (`public.ecr.aws/aws-observability/aws-for-fluent-bit:stable`) with FireLens (`enable-ecs-log-metadata=true`) to enrich container logs with ECS task and container metadata (`provider=ecs`) and forward them over HTTPS to Datadog (`http-intake.logs.${var.datadog_site}`).
   - **`datadog-agent` sidecar container**: Runs the Datadog Agent in ECS Fargate mode (`ECS_FARGATE=true`) with the `DatadogAgentRole` ECS task IAM role (`aws_iam_role.datadog_agent`, equipped with the full set of Datadog AWS integration policies, `SecurityAudit`, `bedrock-agentcore:ListRegistries`, `s3:GetIntelligentTieringConfiguration`, and `ecs:ListClusters`/`ecs:ListContainerInstances`/`ecs:DescribeContainerInstances`) and shared `/var/run/datadog` (`dd-sockets`) volume (`DD_APM_RECEIVER_SOCKET=/var/run/datadog/apm.socket`, `DD_DOGSTATSD_SOCKET=/var/run/datadog/dsd.socket`, `DD_DOGSTATSD_ORIGIN_DETECTION=true`, `DD_DOGSTATSD_ORIGIN_DETECTION_CLIENT=true`), authenticates using `DD_API_KEY` from AWS SSM Parameter Store (`SecureString`), collects ECS task, container, and live process resources (`DD_ECS_TASK_COLLECTION_ENABLED=true`, `DD_PROCESS_AGENT_ENABLED=true`), and monitors both `personal-site` (via `http_check` autodiscovery) and `cloudflared` (via `openmetrics` autodiscovery on `http://127.0.0.1:2000/metrics`).
2. **Datadog AWS Account Integration & Log / Event Forwarding**:
   - Provisions `datadog_integration_aws_account` along with the `DatadogIntegrationRole` IAM role (and matching `DatadogAgentRole` for the ECS Datadog Agent container), dynamically chunked `DatadogAWSIntegrationPolicy-*` policies (sourced from `datadog_integration_aws_iam_permissions` plus `bedrock-agentcore:ListRegistries` and `s3:GetIntelligentTieringConfiguration`), `DatadogAWSIntegrationExtraPolicy`, and AWS `SecurityAudit` managed policy attachment for full account-level cloud observability and CSPM.
   - Deploys the official Datadog Forwarder Lambda function (`aws_cloudformation_stack.datadog_forwarder`) using Datadog's official CloudFormation template (`https://datadog-cloudformation-template.s3.amazonaws.com/aws/forwarder/latest.yaml`), registered with `datadog_integration_aws_account` via `logs_config.lambda_forwarder`.
   - Application and sidecar container logs (`personal-site`, `cloudflared`, `datadog-agent`) bypass CloudWatch and stream directly to Datadog via AWS FireLens (`datadog-log-router`). AWS ECS Container Insights is disabled (`containerInsights = "disabled"`) since container and task metrics/logs are collected directly by Datadog.
   - Provisions a CloudWatch Logs Subscription Filter with explicit Lambda resource-based permission (`aws_lambda_permission`) for the ECS FireLens router log group (`/ecs/${var.project_name}`), ensuring ECS-level log output streams to Datadog via the Lambda forwarder.
   - Provisions an EventBridge rule (`aws_cloudwatch_event_rule.ecs_task_events`) and Lambda permission routing ECS control-plane events (`ECS Task State Change`, `ECS Deployment State Change`, and `ECS Service Action`) to the Datadog Forwarder.
   - Enforces a 1-day retention policy (`var.log_retention_days`) across CloudWatch log groups (`/ecs/${var.project_name}` and `/aws/lambda/...`) to eliminate unnecessary AWS storage costs while archiving logs in Datadog.
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
6. **Datadog Synthetics Health Check, ECS Monitors & CI/CD Pipeline Alerts**:
   - Provisions a Datadog Synthetics HTTP API test (`datadog_synthetics_test.site_health`) probing the public endpoint (`https://${var.domain_name}${var.health_check_path}`) from Datadog's managed locations (`var.health_check_locations`).
   - Asserts HTTP `200` status code with configurable retry threshold (`var.health_check_failure_threshold`) and probe interval (`var.health_check_request_interval`).
   - Provisions the 10 recommended Datadog ECS & Fargate monitors (`terraform/monitors.tf`) covering Fargate task CPU, memory, ephemeral storage, and network error rates (`integration:ecs_fargate`), as well as ECS cluster CPU/memory reservation, running vs. desired task count, task placement failures, and task startup failures (`integration:amazon_ecs`).
   - Provisions Datadog CI Pipeline monitors (`type = "ci-pipelines alert"`) watching the `main` branch for failures in the `Container Image - Build & Push (GHCR)` and `Deploy Personal Site - AWS (Terraform)` GitHub Actions workflows.
   - Automatically routes alert notifications to `@${var.alert_email}` when configured.
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
