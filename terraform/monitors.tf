locals {
  monitor_notification_suffix = var.alert_email != null && var.alert_email != "" ? "\n\n@${var.alert_email}" : ""

  common_monitor_tags = [
    "env:${coalesce(var.env, var.datadog_env, "prod")}",
    "service:${coalesce(var.service, var.project_name)}",
    "managed_by:terraform"
  ]

  ecs_monitor_tags = concat(
    local.common_monitor_tags,
    [
      "ecs_cluster:${aws_ecs_cluster.main.name}",
      "clustername:${aws_ecs_cluster.main.name}",
      "ecs_service:${aws_ecs_service.personal_site.name}",
      "servicename:${aws_ecs_service.personal_site.name}"
    ]
  )
}

# ==============================================================================
# ECS Fargate Suggested Monitors (integration:ecs_fargate)
# ==============================================================================

resource "datadog_monitor" "ecs_fargate_cpu_utilization" {
  name            = "[ECS Fargate] AWS ECS Task CPU utilization is high"
  type            = "query alert"
  query           = "avg(last_15m):sum:ecs.fargate.cpu.usage{*} by {ecs_cluster,task_arn,ecs_service} / sum:ecs.fargate.cpu.task.limit{*} by {ecs_cluster,task_arn,ecs_service} * 100 > 80"
  include_tags    = true
  new_group_delay = 300
  notify_audit    = false
  on_missing_data = "default"

  monitor_thresholds {
    critical = 80
  }

  message = <<-EOT
    {{#is_warning}}
    AWS ECS Task {{task_arn.name}} in service {{ecs_service.name}} (cluster {{ecs_cluster.name}}) is approaching CPU Utilization threshold
    {{/is_warning}}

    {{#is_alert}}
    AWS ECS Task {{task_arn.name}} in service {{ecs_service.name}} (cluster {{ecs_cluster.name}}) has crossed CPU Utilization threshold
    {{/is_alert}}

    To investigate further, view the affected task in the [ECS Explorer](/orchestration/explorer/ecsTask?inspect={{task_arn.name}})${local.monitor_notification_suffix}
  EOT

  tags = concat(local.ecs_monitor_tags, ["integration:ecs_fargate"])
}

resource "datadog_monitor" "ecs_fargate_memory_utilization" {
  name            = "[ECS Fargate] AWS ECS Task Memory utilization is high"
  type            = "query alert"
  query           = "avg(last_15m):sum:ecs.fargate.mem.usage{*} by {ecs_cluster,task_arn,ecs_service} / sum:ecs.fargate.mem.task.limit{*} by {ecs_cluster,task_arn,ecs_service} * 100 > 80"
  include_tags    = true
  new_group_delay = 300
  notify_audit    = false
  on_missing_data = "default"

  monitor_thresholds {
    critical = 80
  }

  message = <<-EOT
    {{#is_warning}}
    AWS ECS Task {{task_arn.name}} in service {{ecs_service.name}} (cluster {{ecs_cluster.name}}) is approaching Memory Utilization threshold
    {{/is_warning}}

    {{#is_alert}}
    AWS ECS Task {{task_arn.name}} in service {{ecs_service.name}} (cluster {{ecs_cluster.name}}) has crossed Memory Utilization threshold
    {{/is_alert}}

    To investigate further, view the affected task in the [ECS Explorer](/orchestration/explorer/ecsTask?inspect={{task_arn.name}})${local.monitor_notification_suffix}
  EOT

  tags = concat(local.ecs_monitor_tags, ["integration:ecs_fargate"])
}

resource "datadog_monitor" "ecs_fargate_ephemeral_storage_utilization" {
  name            = "[ECS Fargate] Ephemeral storage utilization is high for task {{task_arn.name}} in service {{ecs_service.name}} (cluster {{ecs_cluster.name}})"
  type            = "query alert"
  query           = "avg(last_15m):sum:ecs.fargate.ephemeral_storage.utilized{*} by {ecs_cluster,task_arn,ecs_service} / sum:ecs.fargate.ephemeral_storage.reserved{*} by {ecs_cluster,task_arn,ecs_service} * 100 > 80"
  include_tags    = true
  new_group_delay = 300
  notify_audit    = false
  on_missing_data = "default"

  monitor_thresholds {
    critical = 80
  }

  message = <<-EOT
    {{#is_warning}}
    AWS ECS Fargate task {{task_arn.name}} in service {{ecs_service.name}} (cluster {{ecs_cluster.name}}) is approaching ephemeral storage utilization threshold

    Current Usage: {{value}}%
    {{/is_warning}}

    {{#is_alert}}
    AWS ECS Fargate task {{task_arn.name}} in service {{ecs_service.name}} (cluster {{ecs_cluster.name}}) has exceeded ephemeral storage utilization threshold

    Current Usage: {{value}}%
    {{/is_alert}}

    To investigate further, view the affected task in the [ECS Explorer](/orchestration/explorer/ecsTask?inspect={{task_arn.name}})${local.monitor_notification_suffix}
  EOT

  tags = concat(local.ecs_monitor_tags, ["integration:ecs_fargate"])
}

resource "datadog_monitor" "ecs_fargate_network_received_error_rate" {
  name            = "[ECS Fargate] Network received error rate is high for service: {{ecs_service.name}} in cluster: {{ecs_cluster.name}}"
  type            = "query alert"
  query           = "sum(last_5m):sum:ecs.fargate.net.rcvd_errors{*} by {ecs_service,ecs_cluster} / sum:ecs.fargate.net.bytes_rcvd{*} by {ecs_service,ecs_cluster} * 100 > 5"
  include_tags    = true
  new_group_delay = 60
  notify_audit    = false
  on_missing_data = "default"

  monitor_thresholds {
    critical = 5
  }

  message = <<-EOT
    ECS Fargate service {{ecs_service.name}} in cluster {{ecs_cluster.name}} has a network received error rate of {{value}}%, which exceeds the 5% threshold.

    This indicates potential network connectivity issues. To investigate further, view the affected service in the [ECS Explorer](/orchestration/explorer/ecsService?query=ecs_service:{{ecs_service.name}}+ecs_cluster:{{ecs_cluster.name}})${local.monitor_notification_suffix}
  EOT

  tags = concat(local.ecs_monitor_tags, ["integration:ecs_fargate"])
}

resource "datadog_monitor" "ecs_fargate_network_sent_error_rate" {
  name            = "[ECS Fargate] Network sent error rate is high for service: {{ecs_service.name}} in cluster: {{ecs_cluster.name}}"
  type            = "query alert"
  query           = "sum(last_5m):sum:ecs.fargate.net.sent_errors{*} by {ecs_service,ecs_cluster} / sum:ecs.fargate.net.bytes_sent{*} by {ecs_service,ecs_cluster} * 100 > 5"
  include_tags    = true
  new_group_delay = 60
  notify_audit    = false
  on_missing_data = "default"

  monitor_thresholds {
    critical = 5
  }

  message = <<-EOT
    ECS Fargate service {{ecs_service.name}} in cluster {{ecs_cluster.name}} has a network sent error rate of {{value}}%, which exceeds the 5% threshold.

    This indicates potential network connectivity issues. To investigate further, view the affected service in the [ECS Explorer](/orchestration/explorer/ecsService?query=ecs_service:{{ecs_service.name}}+ecs_cluster:{{ecs_cluster.name}})${local.monitor_notification_suffix}
  EOT

  tags = concat(local.ecs_monitor_tags, ["integration:ecs_fargate"])
}

# ==============================================================================
# Amazon ECS Suggested Monitors (integration:amazon_ecs)
# ==============================================================================

resource "datadog_monitor" "ecs_cpu_reservation" {
  name                = "[AWS] ECS CPU Reservation Exceeds Threshold"
  type                = "query alert"
  query               = "min(last_30m):sum:aws.ecs.cpureservation{*} by {clustername,aws_account,region} > 90"
  evaluation_delay    = 900
  include_tags        = true
  new_group_delay     = 60
  notify_audit        = false
  on_missing_data     = "show_no_data"
  renotify_interval   = 0
  require_full_window = false

  monitor_thresholds {
    warning  = 80
    critical = 90
  }

  message = <<-EOT
    {{#is_warning}}
    CPU Reservation for ECS cluster {{clustername.name}} is approaching the threshold of {{threshold}}%
    {{/is_warning}}

    {{#is_alert}}
    CPU Reservation for ECS cluster {{clustername.name}} has exceeded the threshold of {{threshold}}%
    {{/is_alert}}

    To investigate further, view the affected cluster in the [ECS Explorer](/orchestration/explorer/ecsCluster?query=ecs_cluster:{{clustername.name}}+aws_account:{{aws_account.name}}+region:{{region.name}})${local.monitor_notification_suffix}
  EOT

  tags = concat(local.ecs_monitor_tags, ["integration:amazon_ecs"])
}

resource "datadog_monitor" "ecs_memory_reservation" {
  name                 = "[AWS] ECS Memory Reservation Exceeds Threshold"
  type                 = "query alert"
  query                = "min(last_30m):sum:aws.ecs.memory_reservation{*} by {clustername,aws_account,region} > 90"
  escalation_message   = ""
  evaluation_delay     = 900
  include_tags         = true
  new_group_delay      = 60
  notify_audit         = false
  on_missing_data      = "show_no_data"
  renotify_interval    = 1440
  renotify_occurrences = 0
  renotify_statuses    = ["alert"]
  require_full_window  = false

  monitor_thresholds {
    warning  = 80
    critical = 90
  }

  message = <<-EOT
    {{#is_warning}}
    Memory Reservation for ECS cluster {{clustername.name}} is approaching the threshold of {{threshold}}%
    {{/is_warning}}

    {{#is_alert}}
    Memory Reservation for ECS cluster {{clustername.name}} has exceeded the threshold of {{threshold}}%
    {{/is_alert}}

    To investigate further, view the affected cluster in the [ECS Explorer](/orchestration/explorer/ecsCluster?query=ecs_cluster:{{clustername.name}}+aws_account:{{aws_account.name}}+region:{{region.name}})${local.monitor_notification_suffix}
  EOT

  tags = concat(local.ecs_monitor_tags, ["integration:amazon_ecs"])
}

resource "datadog_monitor" "ecs_running_task_count_differs_from_desired" {
  name                = "[AWS] ECS Running Task Count differs from Desired Count"
  type                = "query alert"
  query               = "min(last_1h):sum:aws.ecs.service.desired{*} by {servicename,clustername,aws_account,region} - sum:aws.ecs.service.running{*} by {servicename,clustername,aws_account,region} >= 1"
  evaluation_delay    = 900
  include_tags        = true
  new_group_delay     = 60
  notify_audit        = false
  on_missing_data     = "show_no_data"
  renotify_interval   = 0
  require_full_window = false

  monitor_thresholds {
    critical = 1
  }

  message = <<-EOT
    {{#is_alert}}
    ECS Running Task Count is not equal to Desired Task Count for {{servicename.name}} in cluster {{clustername.name}}.
    {{/is_alert}}

    To investigate further, view the affected service in the [ECS Explorer](/orchestration/explorer/ecsService?query=ecs_service:{{servicename.name}}+ecs_cluster:{{clustername.name}}+aws_account:{{aws_account.name}}+region:{{region.name}})${local.monitor_notification_suffix}
  EOT

  tags = concat(local.ecs_monitor_tags, ["integration:amazon_ecs"])
}

resource "datadog_monitor" "ecs_task_placement_failed" {
  name                   = "[AWS] ECS Task Placement Failed"
  type                   = "event-v2 alert"
  query                  = "events(\"source:amazon_ecs \\\"was unable to place a task\\\"\").rollup(\"count\").by(\"servicename,clustername,aws_account,region\").last(\"30m\") > 1"
  evaluation_delay       = 900
  groupby_simple_monitor = false
  include_tags           = true
  new_group_delay        = 60
  notify_audit           = false
  on_missing_data        = "show_no_data"
  renotify_interval      = 0
  require_full_window    = false

  monitor_thresholds {
    critical = 1
  }

  message = <<-EOT
    {{#is_alert}}
    ECS service:{{servicename.name}} (cluster:{{clustername.name}}) was unable to place a task.
    {{/is_alert}}

    To investigate further, view the affected service in the [ECS Explorer](/orchestration/explorer/ecsService?query=ecs_service:{{servicename.name}}+ecs_cluster:{{clustername.name}}+aws_account:{{aws_account.name}}+region:{{region.name}})${local.monitor_notification_suffix}
  EOT

  tags = concat(local.ecs_monitor_tags, ["integration:amazon_ecs"])
}

resource "datadog_monitor" "ecs_tasks_failed_to_start" {
  name                   = "[AWS] ECS Tasks Failed to Start Successfully"
  type                   = "event-v2 alert"
  query                  = "events(\"source:amazon_ecs \\\"unable to consistently start tasks successfully\\\"\").rollup(\"count\").by(\"servicename,clustername,aws_account,region\").last(\"30m\") > 1"
  evaluation_delay       = 900
  groupby_simple_monitor = false
  include_tags           = true
  new_group_delay        = 60
  notify_audit           = false
  on_missing_data        = "show_no_data"
  renotify_interval      = 0
  require_full_window    = false

  monitor_thresholds {
    critical = 1
  }

  message = <<-EOT
    {{#is_alert}}
    ECS service:{{servicename.name}} (cluster:{{clustername.name}}) was unable to start successfully.
    {{/is_alert}}

    To investigate further, view the affected service in the ECS Explorer](/orchestration/explorer/ecsService?query=ecs_service:{{servicename.name}}+ecs_cluster:{{clustername.name}}+aws_account:{{aws_account.name}}+region:{{region.name}})${local.monitor_notification_suffix}
  EOT

  tags = concat(local.ecs_monitor_tags, ["integration:amazon_ecs"])
}

# ==============================================================================
# GitHub Actions CI Pipeline Monitors (ci-pipelines alert)
# ==============================================================================

resource "datadog_monitor" "gh_workflow_build_and_push_ghcr" {
  name                   = "[CI/CD] Container Image - Build & Push (GHCR) failed on main"
  type                   = "ci-pipelines alert"
  query                  = "ci-pipelines(\"ci_level:pipeline @git.repository.id_v2:${var.github_repository_id} @git.branch:main @ci.status:error @ci.pipeline.name:\\\"Container Image - Build & Push (GHCR)\\\"\").rollup(\"count\").by(\"@ci.pipeline.name,@git.branch\").last(\"15m\") > 0"
  groupby_simple_monitor = false
  include_tags           = true
  notify_audit           = false
  on_missing_data        = "default"
  require_full_window    = false

  monitor_thresholds {
    critical = 0
  }

  message = <<-EOT
    {{#is_alert}}
    GitHub Actions workflow **Container Image - Build & Push (GHCR)** failed on the `main` branch in `${var.github_repository_id}`.

    Inspect the failed execution in [Datadog CI Visibility](/ci/pipeline-executions?query=ci_level%3Apipeline%20%40git.repository.id_v2%3A${var.github_repository_id}%20%40git.branch%3Amain%20%40ci.status%3Aerror).
    {{/is_alert}}${local.monitor_notification_suffix}
  EOT

  tags = concat(
    local.common_monitor_tags,
    [
      "integration:github_actions",
      "workflow:build-and-push-ghcr",
      "branch:main"
    ]
  )
}

resource "datadog_monitor" "gh_workflow_deploy_aws_terraform" {
  name                   = "[CI/CD] Deploy Personal Site - AWS (Terraform) failed on main"
  type                   = "ci-pipelines alert"
  query                  = "ci-pipelines(\"ci_level:pipeline @git.repository.id_v2:${var.github_repository_id} @git.branch:main @ci.status:error @ci.pipeline.name:\\\"Deploy Personal Site - AWS (Terraform)\\\"\").rollup(\"count\").by(\"@ci.pipeline.name,@git.branch\").last(\"15m\") > 0"
  groupby_simple_monitor = false
  include_tags           = true
  notify_audit           = false
  on_missing_data        = "default"
  require_full_window    = false

  monitor_thresholds {
    critical = 0
  }

  message = <<-EOT
    {{#is_alert}}
    GitHub Actions workflow **Deploy Personal Site - AWS (Terraform)** failed on the `main` branch in `${var.github_repository_id}`.

    Inspect the failed execution in [Datadog CI Visibility](/ci/pipeline-executions?query=ci_level%3Apipeline%20%40git.repository.id_v2%3A${var.github_repository_id}%20%40git.branch%3Amain%20%40ci.status%3Aerror).
    {{/is_alert}}${local.monitor_notification_suffix}
  EOT

  tags = concat(
    local.common_monitor_tags,
    [
      "integration:github_actions",
      "workflow:deploy-aws",
      "branch:main"
    ]
  )
}
