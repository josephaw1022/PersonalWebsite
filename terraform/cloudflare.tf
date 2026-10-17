resource "random_id" "tunnel_secret" {
  byte_length = 35
}

resource "cloudflare_zero_trust_tunnel_cloudflared" "personal_site" {
  account_id = var.cloudflare_account_id
  name       = "${var.project_name}-aws-ecs"
  secret     = random_id.tunnel_secret.b64_std
  config_src = "cloudflare"
}

resource "cloudflare_zero_trust_tunnel_cloudflared_config" "personal_site" {
  account_id = var.cloudflare_account_id
  tunnel_id  = cloudflare_zero_trust_tunnel_cloudflared.personal_site.id

  config {
    ingress_rule {
      hostname = var.domain_name
      service  = "http://localhost:${var.container_port}"
    }

    dynamic "ingress_rule" {
      for_each = var.create_www_record ? [1] : []
      content {
        hostname = "www.${var.domain_name}"
        service  = "http://localhost:${var.container_port}"
      }
    }

    ingress_rule {
      service = "http_status:404"
    }
  }
}

resource "cloudflare_record" "root" {
  zone_id         = var.cloudflare_zone_id
  name            = "@"
  type            = "CNAME"
  content         = "${cloudflare_zero_trust_tunnel_cloudflared.personal_site.id}.cfargotunnel.com"
  proxied         = true
  allow_overwrite = true
  comment         = "Managed by Terraform - routes root domain to AWS ECS Cloudflare Tunnel"
}

resource "cloudflare_record" "www" {
  count           = var.create_www_record ? 1 : 0
  zone_id         = var.cloudflare_zone_id
  name            = "www"
  type            = "CNAME"
  content         = "${cloudflare_zero_trust_tunnel_cloudflared.personal_site.id}.cfargotunnel.com"
  proxied         = true
  allow_overwrite = true
  comment         = "Managed by Terraform - routes www subdomain to AWS ECS Cloudflare Tunnel"
}
