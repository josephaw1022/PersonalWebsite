resource "aws_route53_health_check" "site" {
  fqdn              = var.domain_name
  port              = 443
  type              = "HTTPS"
  resource_path     = var.health_check_path
  failure_threshold = var.health_check_failure_threshold
  request_interval  = var.health_check_request_interval
  enable_sni        = true

  tags = {
    Name = "${var.project_name}-health-check"
  }
}

resource "aws_sns_topic" "site_alerts" {
  name         = "${var.project_name}-health-alerts"
  display_name = "SiteAlerts"
}


resource "aws_sns_topic_subscription" "email" {
  count     = var.alert_email != null && var.alert_email != "" ? 1 : 0
  topic_arn = aws_sns_topic.site_alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

resource "aws_sns_topic_subscription" "sms" {
  count     = var.alert_phone_number != null && var.alert_phone_number != "" ? 1 : 0
  topic_arn = aws_sns_topic.site_alerts.arn
  protocol  = "sms"
  endpoint  = var.alert_phone_number
}

resource "aws_cloudwatch_metric_alarm" "site_down" {
  alarm_name          = "${var.project_name}-site-down"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 1
  metric_name         = "HealthCheckStatus"
  namespace           = "AWS/Route53"
  period              = 60
  statistic           = "Minimum"
  threshold           = 1
  alarm_description   = "Triggered when Route 53 health check fails for ${var.domain_name} (site is down)."
  treat_missing_data  = "breaching"

  dimensions = {
    HealthCheckId = aws_route53_health_check.site.id
  }

  alarm_actions = [aws_sns_topic.site_alerts.arn]
  ok_actions    = [aws_sns_topic.site_alerts.arn]
}
