output "ecs_cluster_name" {
  description = "Name of the AWS ECS cluster"
  value       = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  description = "Name of the AWS ECS Fargate service"
  value       = aws_ecs_service.personal_site.name
}

output "cloudwatch_log_group" {
  description = "CloudWatch Log Group for the ECS task and FireLens log router"
  value       = aws_cloudwatch_log_group.ecs.name
}

output "ecs_task_role_arn" {
  description = "ARN of the ECS Task IAM role used by the Datadog Agent"
  value       = aws_iam_role.datadog_agent.arn
}

output "datadog_agent_role_arn" {
  description = "ARN of the Datadog Agent ECS IAM role"
  value       = aws_iam_role.datadog_agent.arn
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

output "datadog_synthetics_test_id" {
  description = "Public ID of the Datadog Synthetics HTTP health check test"
  value       = datadog_synthetics_test.site_health.id
}

output "datadog_synthetics_monitor_id" {
  description = "Monitor ID associated with the Datadog Synthetics HTTP health check"
  value       = datadog_synthetics_test.site_health.monitor_id
}

output "datadog_integration_role_arn" {
  description = "ARN of the Datadog AWS integration IAM role"
  value       = aws_iam_role.datadog_aws_integration.arn
}

output "datadog_integration_policy_arns" {
  description = "ARNs of the chunked Datadog AWS integration IAM policies"
  value       = concat(aws_iam_policy.datadog_aws_integration[*].arn, [aws_iam_policy.datadog_extra_permissions.arn])
}

output "datadog_external_id" {
  description = "External ID that Datadog uses when assuming the AWS integration role"
  value       = datadog_integration_aws_account.datadog_integration.auth_config.aws_auth_config_role.external_id
  sensitive   = true
}

output "datadog_forwarder_stack_id" {
  description = "CloudFormation stack ID of the Datadog Forwarder"
  value       = aws_cloudformation_stack.datadog_forwarder.id
}

output "datadog_forwarder_lambda_arn" {
  description = "ARN of the Datadog Forwarder Lambda function"
  value       = aws_cloudformation_stack.datadog_forwarder.outputs["DatadogForwarderArn"]
}

output "autoscaling_target_id" {
  description = "Resource ID of the Application Auto Scaling target"
  value       = aws_appautoscaling_target.personal_site.resource_id
}

output "autoscaling_min_capacity" {
  description = "Configured minimum task capacity for autoscaling"
  value       = aws_appautoscaling_target.personal_site.min_capacity
}

output "autoscaling_max_capacity" {
  description = "Configured maximum task capacity for autoscaling"
  value       = aws_appautoscaling_target.personal_site.max_capacity
}

output "ecs_task_events_rule_arn" {
  description = "ARN of the EventBridge rule routing ECS task, service, and deployment state changes to Datadog Forwarder"
  value       = aws_cloudwatch_event_rule.ecs_task_events.arn
}
