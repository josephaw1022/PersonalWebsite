output "ecs_cluster_name" {
  description = "Name of the AWS ECS cluster"
  value       = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  description = "Name of the AWS ECS Fargate service"
  value       = aws_ecs_service.personal_site.name
}

output "cloudwatch_log_group" {
  description = "CloudWatch Log Group for the personal-site and cloudflared containers"
  value       = aws_cloudwatch_log_group.ecs.name
}

output "cloudflare_tunnel_id" {
  description = "ID of the Cloudflare Zero Trust Tunnel"
  value       = cloudflare_zero_trust_tunnel_cloudflared.personal_site.id
}

output "cloudflare_tunnel_cname" {
  description = "Cloudflare Argo Tunnel target hostname"
  value       = "${cloudflare_zero_trust_tunnel_cloudflared.personal_site.id}.cfargotunnel.com"
}

output "site_url" {
  description = "Public HTTPS URL of the site routed via Cloudflare Tunnel"
  value       = "https://${var.domain_name}"
}
