variable "project_name" {
  description = "Name prefix used for AWS and Cloudflare resources"
  type        = string
  default     = "personal-site"
}

variable "aws_region" {
  description = "AWS region to deploy ECS resources into"
  type        = string
  default     = "us-east-1"
}

variable "aws_account_id" {
  description = "AWS Account ID for the Datadog AWS account integration"
  type        = string
}

variable "aws_partition" {
  description = "AWS partition (e.g. aws, aws-cn, aws-us-gov)"
  type        = string
  default     = "aws"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.20.0.0/16"
}

variable "ghcr_image" {
  description = "Public GHCR container image for the Next.js personal website"
  type        = string
  default     = "ghcr.io/josephaw1022/personalwebsite"
}

variable "ghcr_image_tag" {
  description = "Tag of the GHCR container image to deploy"
  type        = string
  default     = "3c60313"
}

variable "cloudflared_image" {
  description = "Container image for the Cloudflare Tunnel connector"
  type        = string
  default     = "cloudflare/cloudflared:latest"
}

variable "container_port" {
  description = "Port exposed by the Next.js application container"
  type        = number
  default     = 3000
}

variable "task_cpu" {
  description = "Fargate task CPU units (256 = 0.25 vCPU, 512 = 0.5 vCPU)"
  type        = number
  default     = 256
}

variable "task_memory" {
  description = "Fargate task memory in MiB"
  type        = number
  default     = 1024
}

variable "desired_count" {
  description = "Number of ECS tasks to run"
  type        = number
  default     = 1
}

variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 14
}

variable "cloudflare_api_token" {
  description = "Cloudflare API token with Cloudflare Tunnel:Edit and DNS:Edit permissions (can also be set via CLOUDFLARE_API_TOKEN env var)"
  type        = string
  sensitive   = true
  default     = null
}

variable "cloudflare_account_id" {
  description = "Cloudflare Account ID where the Zero Trust tunnel will be created"
  type        = string
}

variable "cloudflare_zone_id" {
  description = "Cloudflare Zone ID for the domain"
  type        = string
}

variable "domain_name" {
  description = "Primary root domain name hosted on Cloudflare"
  type        = string
  default     = "jwhiteaker22.com"
}

variable "create_www_record" {
  description = "Whether to also configure and route the www subdomain through the tunnel"
  type        = bool
  default     = true
}

variable "health_check_path" {
  description = "URL path for the Route 53 health check"
  type        = string
  default     = "/"
}

variable "health_check_request_interval" {
  description = "The number of seconds between Route 53 health check probes (30 for standard, 10 for fast)"
  type        = number
  default     = 30
}

variable "health_check_failure_threshold" {
  description = "The number of consecutive health check probe failures before marking the endpoint unhealthy"
  type        = number
  default     = 3
}

variable "alert_email" {
  description = "Email address to receive alerts when the site goes down (leave empty or null to disable email alerts)"
  type        = string
  default     = null
}

variable "alert_phone_number" {
  description = "Phone number in E.164 format (e.g. +12345678901) to receive SMS text alerts when the site goes down (leave empty or null to disable SMS alerts)"
  type        = string
  default     = null
}

variable "datadog_api_key" {
  description = "Datadog API key for account integration and the ECS Fargate agent"
  type        = string
  sensitive   = true
}

variable "datadog_app_key" {
  description = "Datadog Application key for managing the AWS account integration"
  type        = string
  sensitive   = true
}

variable "datadog_site" {
  description = "Datadog site domain (e.g. us5.datadoghq.com)"
  type        = string
  default     = "us5.datadoghq.com"
}

variable "datadog_env" {
  description = "Datadog environment tag for ECS tasks and containers"
  type        = string
  default     = "prod"
}

variable "datadog_agent_image" {
  description = "Container image for the Datadog Agent sidecar"
  type        = string
  default     = "public.ecr.aws/datadog/agent:latest"
}

variable "datadog_role_name" {
  description = "Name of the IAM role assumed by Datadog for the AWS account integration"
  type        = string
  default     = "DatadogIntegrationRole"
}

variable "datadog_account_tags" {
  description = "Tags to associate with the Datadog AWS account integration"
  type        = list(string)
  default = [
    "env:prod",
    "account:personal-site",
    "project:personal-site"
  ]
}
