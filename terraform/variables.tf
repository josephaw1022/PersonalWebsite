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
  default     = "5acc9fc"
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
  default     = 512
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
