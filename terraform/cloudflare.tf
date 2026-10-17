resource "random_id" "tunnel_secret" {
  byte_length = 35
}

resource "cloudflare_zero_trust_tunnel_cloudflared" "personal_site" {
  account_id    = var.cloudflare_account_id
  name          = "${var.project_name}-aws-ecs"
  tunnel_secret = random_id.tunnel_secret.b64_std
  config_src    = "cloudflare"
}

resource "cloudflare_zero_trust_tunnel_cloudflared_config" "personal_site" {
  account_id = var.cloudflare_account_id
  tunnel_id  = cloudflare_zero_trust_tunnel_cloudflared.personal_site.id

  config = {
    ingress = concat(
      [
        {
          hostname = var.domain_name
          service  = "http://localhost:${var.container_port}"
        }
      ],
      var.create_www_record ? [
        {
          hostname = "www.${var.domain_name}"
          service  = "http://localhost:${var.container_port}"
        }
      ] : [],
      [
        {
          service = "http_status:404"
        }
      ]
    )
  }
}

data "cloudflare_zero_trust_tunnel_cloudflared_token" "personal_site" {
  account_id = var.cloudflare_account_id
  tunnel_id  = cloudflare_zero_trust_tunnel_cloudflared.personal_site.id
}

moved {
  from = cloudflare_record.root
  to   = cloudflare_dns_record.root
}

resource "cloudflare_dns_record" "root" {
  zone_id = var.cloudflare_zone_id
  name    = "@"
  type    = "CNAME"
  content = "${cloudflare_zero_trust_tunnel_cloudflared.personal_site.id}.cfargotunnel.com"
  ttl     = 1
  proxied = true
  comment = "Managed by Terraform - routes root domain to AWS ECS Cloudflare Tunnel"
}

moved {
  from = cloudflare_record.www
  to   = cloudflare_dns_record.www
}

resource "cloudflare_dns_record" "www" {
  count   = var.create_www_record ? 1 : 0
  zone_id = var.cloudflare_zone_id
  name    = "www"
  type    = "CNAME"
  content = "${cloudflare_zero_trust_tunnel_cloudflared.personal_site.id}.cfargotunnel.com"
  ttl     = 1
  proxied = true
  comment = "Managed by Terraform - routes www subdomain to AWS ECS Cloudflare Tunnel"
}
