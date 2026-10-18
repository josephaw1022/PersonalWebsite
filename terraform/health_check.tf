resource "datadog_synthetics_test" "site_health" {
  name      = "${var.project_name} HTTPS Health Check"
  type      = "api"
  subtype   = "http"
  status    = "live"
  message   = var.alert_email != null && var.alert_email != "" ? "Site https://${var.domain_name}${var.health_check_path} is unreachable or failing health checks. @${var.alert_email}" : "Site https://${var.domain_name}${var.health_check_path} is unreachable or failing health checks."
  locations = var.health_check_locations

  tags = [
    "env:${coalesce(var.env, var.datadog_env, "prod")}",
    "service:${coalesce(var.service, var.project_name)}",
    "managed_by:terraform"
  ]

  request_definition {
    method  = "GET"
    url     = "https://${var.domain_name}${var.health_check_path}"
    timeout = 10
  }

  assertion {
    type     = "statusCode"
    operator = "is"
    target   = "200"
  }

  options_list {
    tick_every           = var.health_check_request_interval
    min_failure_duration = 0
    min_location_failed  = 1

    retry {
      count    = var.health_check_failure_threshold - 1
      interval = 1000
    }

    monitor_options {
      renotify_interval = 0
    }
  }
}
