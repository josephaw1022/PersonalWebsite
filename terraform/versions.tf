terraform {
  required_version = ">= 1.10.0"

  backend "s3" {
    key          = "personal-site/terraform.tfstate"
    encrypt      = true
    use_lockfile = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.68"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.28"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
    datadog = {
      source  = "DataDog/datadog"
      version = "~> 3.71"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project   = var.project_name
      ManagedBy = "terraform"
      env       = coalesce(var.env, var.datadog_env, "prod")
      service   = coalesce(var.service, var.project_name)
      version   = coalesce(var.app_version, var.ghcr_image_tag)
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

provider "datadog" {
  api_key = var.datadog_api_key
  app_key = var.datadog_app_key
  api_url = "https://api.${var.datadog_site}/"
}
