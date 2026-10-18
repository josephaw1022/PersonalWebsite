resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/${var.project_name}"
  retention_in_days = var.log_retention_days
}

resource "aws_lambda_permission" "ecs_datadog_forwarder" {
  statement_id  = "AllowCloudWatchLogs-${var.project_name}-ecs"
  action        = "lambda:InvokeFunction"
  function_name = aws_cloudformation_stack.datadog_forwarder.outputs["DatadogForwarderArn"]
  principal     = "logs.${var.aws_region}.amazonaws.com"
  source_arn    = "${aws_cloudwatch_log_group.ecs.arn}:*"
}

resource "aws_cloudwatch_log_subscription_filter" "ecs_datadog_forwarder" {
  name            = "${var.project_name}-ecs-datadog-logs"
  log_group_name  = aws_cloudwatch_log_group.ecs.name
  filter_pattern  = ""
  destination_arn = aws_cloudformation_stack.datadog_forwarder.outputs["DatadogForwarderArn"]

  depends_on = [
    aws_cloudformation_stack.datadog_forwarder,
    aws_lambda_permission.ecs_datadog_forwarder
  ]
}

import {
  to = aws_cloudwatch_log_group.ecs_container_insights
  id = "/aws/ecs/containerinsights/${var.project_name}-cluster/performance"
}

resource "aws_cloudwatch_log_group" "ecs_container_insights" {
  name              = "/aws/ecs/containerinsights/${var.project_name}-cluster/performance"
  retention_in_days = var.log_retention_days
}


resource "aws_lambda_permission" "ecs_container_insights_datadog_forwarder" {
  statement_id  = "AllowCloudWatchLogs-${var.project_name}-container-insights"
  action        = "lambda:InvokeFunction"
  function_name = aws_cloudformation_stack.datadog_forwarder.outputs["DatadogForwarderArn"]
  principal     = "logs.${var.aws_region}.amazonaws.com"
  source_arn    = "${aws_cloudwatch_log_group.ecs_container_insights.arn}:*"
}

resource "aws_cloudwatch_log_subscription_filter" "ecs_container_insights_datadog_forwarder" {
  name            = "${var.project_name}-ecs-ci-datadog-logs"
  log_group_name  = aws_cloudwatch_log_group.ecs_container_insights.name
  filter_pattern  = ""
  destination_arn = aws_cloudformation_stack.datadog_forwarder.outputs["DatadogForwarderArn"]

  depends_on = [
    aws_cloudformation_stack.datadog_forwarder,
    aws_lambda_permission.ecs_container_insights_datadog_forwarder
  ]
}

resource "aws_cloudwatch_event_rule" "ecs_container_insights_events" {
  name        = "${var.project_name}-ecs-container-insights-events"
  description = "Routes ECS Container Insights CloudWatch log group events to the Datadog Forwarder Lambda via EventBridge"

  event_pattern = jsonencode({
    source = ["aws.logs"]
    detail = {
      requestParameters = {
        logGroupName = [aws_cloudwatch_log_group.ecs_container_insights.name]
      }
    }
  })
}

resource "aws_cloudwatch_event_target" "ecs_container_insights_datadog_forwarder" {
  rule      = aws_cloudwatch_event_rule.ecs_container_insights_events.name
  target_id = "${var.project_name}-ecs-ci-forwarder"
  arn       = aws_cloudformation_stack.datadog_forwarder.outputs["DatadogForwarderArn"]
}

resource "aws_lambda_permission" "ecs_container_insights_events_datadog_forwarder" {
  statement_id  = "AllowEventBridge-${var.project_name}-container-insights-events"
  action        = "lambda:InvokeFunction"
  function_name = aws_cloudformation_stack.datadog_forwarder.outputs["DatadogForwarderArn"]
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.ecs_container_insights_events.arn
}

resource "aws_cloudwatch_event_rule" "ecs_task_events" {
  name        = "${var.project_name}-ecs-task-state-changes"
  description = "Routes ECS task and container state change events to the Datadog Forwarder Lambda"

  event_pattern = jsonencode({
    source      = ["aws.ecs"]
    detail-type = ["ECS Task State Change"]
    detail = {
      clusterArn = [aws_ecs_cluster.main.arn]
    }
  })
}

resource "aws_cloudwatch_event_target" "ecs_task_events_datadog_forwarder" {
  rule      = aws_cloudwatch_event_rule.ecs_task_events.name
  target_id = "${var.project_name}-ecs-task-datadog-forwarder"
  arn       = aws_cloudformation_stack.datadog_forwarder.outputs["DatadogForwarderArn"]
}

resource "aws_lambda_permission" "ecs_events_datadog_forwarder" {
  statement_id  = "AllowEventBridge-${var.project_name}-ecs-events"
  action        = "lambda:InvokeFunction"
  function_name = aws_cloudformation_stack.datadog_forwarder.outputs["DatadogForwarderArn"]
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.ecs_task_events.arn
}



resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_ssm_parameter" "cloudflared_tunnel_token" {
  name        = "/${var.project_name}/cloudflared/tunnel-token"
  description = "Cloudflare Zero Trust Tunnel token for ${var.project_name}"
  type        = "SecureString"
  value       = data.cloudflare_zero_trust_tunnel_cloudflared_token.personal_site.token
}

resource "aws_ssm_parameter" "datadog_api_key" {
  name        = "/${var.project_name}/datadog/api-key"
  description = "Datadog API key for the ${var.project_name} ECS Fargate agent"
  type        = "SecureString"
  value       = var.datadog_api_key
}

data "aws_iam_policy_document" "ecs_task_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ecs_task_execution" {
  name               = "${var.project_name}-ecs-execution-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume_role.json
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_managed" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

data "aws_iam_policy_document" "ecs_ssm_access" {
  statement {
    effect = "Allow"
    actions = [
      "ssm:GetParameters"
    ]
    resources = [
      aws_ssm_parameter.cloudflared_tunnel_token.arn,
      aws_ssm_parameter.datadog_api_key.arn
    ]
  }
}

resource "aws_iam_role_policy" "ecs_ssm_access" {
  name   = "${var.project_name}-ssm-tunnel-token"
  role   = aws_iam_role.ecs_task_execution.id
  policy = data.aws_iam_policy_document.ecs_ssm_access.json
}

resource "aws_iam_role" "ecs_task" {
  name               = "${var.project_name}-ecs-task-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume_role.json
}

data "aws_iam_policy_document" "ecs_task_policy" {
  statement {
    effect = "Allow"
    actions = [
      "ecs:ListClusters",
      "ecs:ListContainerInstances",
      "ecs:DescribeContainerInstances"
    ]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "ecs_task" {
  name   = "fargate-task-role-default-policy"
  role   = aws_iam_role.ecs_task.id
  policy = data.aws_iam_policy_document.ecs_task_policy.json
}

resource "aws_ecs_task_definition" "personal_site" {
  family                   = var.project_name
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = tostring(var.task_cpu)
  memory                   = tostring(var.task_memory)
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  volume {
    name = "dd-sockets"
  }

  container_definitions = jsonencode([
    {
      name      = "personal-site"
      image     = "${var.ghcr_image}:${var.ghcr_image_tag}"
      essential = true
      portMappings = [
        {
          containerPort = var.container_port
          hostPort      = var.container_port
          protocol      = "tcp"
        }
      ]
      environment = [
        {
          name  = "NODE_ENV"
          value = "production"
        },
        {
          name  = "PORT"
          value = tostring(var.container_port)
        },
        {
          name  = "HOSTNAME"
          value = "0.0.0.0"
        },
        {
          name  = "DD_ENV"
          value = var.datadog_env
        },
        {
          name  = "DD_SERVICE"
          value = var.project_name
        },
        {
          name  = "DD_VERSION"
          value = var.ghcr_image_tag
        },
        {
          name  = "DD_TRACE_AGENT_URL"
          value = "unix:///var/run/datadog/apm.socket"
        },
        {
          name  = "DD_PROFILING_ENABLED"
          value = "true"
        }
      ]
      mountPoints = [
        {
          containerPath = "/var/run/datadog"
          sourceVolume  = "dd-sockets"
        }
      ]
      dockerLabels = {
        "com.datadoghq.tags.env"     = var.datadog_env
        "com.datadoghq.tags.service" = var.project_name
        "com.datadoghq.tags.version" = var.ghcr_image_tag
        "com.datadoghq.ad.checks" = jsonencode({
          http_check = {
            init_config = {}
            instances = [
              {
                name                  = var.project_name
                url                   = "http://127.0.0.1:${var.container_port}/"
                timeout               = 5
                collect_response_time = true
              }
            ]
          }
        })
      }
      healthCheck = {
        command = [
          "CMD-SHELL",
          "node -e \"fetch('http://127.0.0.1:${var.container_port}/').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))\""
        ]
        interval    = 15
        timeout     = 5
        retries     = 3
        startPeriod = 15
      }
      restartPolicy = {
        enabled              = true
        restartAttemptPeriod = 300
      }
      logConfiguration = {
        logDriver = "awsfirelens"
        options = {
          Name       = "datadog"
          Host       = "http-intake.logs.${var.datadog_site}"
          TLS        = "on"
          provider   = "ecs"
          dd_service = var.project_name
          dd_source  = "nextjs"
          dd_tags    = "env:${var.datadog_env},version:${var.ghcr_image_tag}"
        }
        secretOptions = [
          {
            name      = "apikey"
            valueFrom = aws_ssm_parameter.datadog_api_key.arn
          }
        ]
      }
    },
    {
      name      = "cloudflared"
      image     = var.cloudflared_image
      essential = true
      command = [
        "tunnel",
        "--metrics",
        "127.0.0.1:2000",
        "--no-autoupdate",
        "run"
      ]
      secrets = [
        {
          name      = "TUNNEL_TOKEN"
          valueFrom = aws_ssm_parameter.cloudflared_tunnel_token.arn
        }
      ]
      dockerLabels = {
        "com.datadoghq.tags.env"     = var.datadog_env
        "com.datadoghq.tags.service" = "cloudflared"
        "com.datadoghq.ad.checks" = jsonencode({
          openmetrics = {
            init_config = {}
            instances = [
              {
                openmetrics_endpoint = "http://127.0.0.1:2000/metrics"
                namespace            = "cloudflared"
                metrics              = ["cloudflared_.*"]
              }
            ]
          }
        })
      }
      dependsOn = [
        {
          containerName = "personal-site"
          condition     = "HEALTHY"
        }
      ]
      healthCheck = {
        command = [
          "CMD",
          "cloudflared",
          "tunnel",
          "--metrics",
          "127.0.0.1:2000",
          "ready"
        ]
        interval    = 15
        timeout     = 5
        retries     = 3
        startPeriod = 15
      }
      restartPolicy = {
        enabled              = true
        restartAttemptPeriod = 300
      }
      logConfiguration = {
        logDriver = "awsfirelens"
        options = {
          Name       = "datadog"
          Host       = "http-intake.logs.${var.datadog_site}"
          TLS        = "on"
          provider   = "ecs"
          dd_service = "cloudflared"
          dd_source  = "cloudflared"
          dd_tags    = "env:${var.datadog_env}"
        }
        secretOptions = [
          {
            name      = "apikey"
            valueFrom = aws_ssm_parameter.datadog_api_key.arn
          }
        ]
      }
    },
    {
      name      = "datadog-log-router"
      image     = var.datadog_log_router_image
      essential = true
      firelensConfiguration = {
        type = "fluentbit"
        options = {
          enable-ecs-log-metadata = "true"
        }
      }
      restartPolicy = {
        enabled              = true
        restartAttemptPeriod = 300
      }
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "datadog-log-router"
        }
      }
    },
    {
      name      = "datadog-agent"
      image     = var.datadog_agent_image
      essential = false
      portMappings = [
        {
          containerPort = 8126
          hostPort      = 8126
          protocol      = "tcp"
        },
        {
          containerPort = 8125
          hostPort      = 8125
          protocol      = "udp"
        }
      ]
      environment = [
        {
          name  = "ECS_FARGATE"
          value = "true"
        },
        {
          name  = "DD_SITE"
          value = var.datadog_site
        },
        {
          name  = "DD_ENV"
          value = var.datadog_env
        },
        {
          name  = "DD_SERVICE"
          value = var.project_name
        },
        {
          name  = "DD_DOGSTATSD_NON_LOCAL_TRAFFIC"
          value = "true"
        },
        {
          name  = "DD_APM_ENABLED"
          value = "true"
        },
        {
          name  = "DD_APM_NON_LOCAL_TRAFFIC"
          value = "true"
        },
        {
          name  = "DD_PROCESS_AGENT_ENABLED"
          value = "true"
        },
        {
          name  = "DD_ECS_TASK_COLLECTION_ENABLED"
          value = "true"
        }
      ]
      secrets = [
        {
          name      = "DD_API_KEY"
          valueFrom = aws_ssm_parameter.datadog_api_key.arn
        }
      ]
      mountPoints = [
        {
          containerPath = "/var/run/datadog"
          sourceVolume  = "dd-sockets"
        }
      ]
      dockerLabels = {
        "com.datadoghq.tags.env"     = var.datadog_env
        "com.datadoghq.tags.service" = "datadog-agent"
      }
      healthCheck = {
        command = [
          "CMD-SHELL",
          "agent health"
        ]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 15
      }
      restartPolicy = {
        enabled              = true
        restartAttemptPeriod = 300
      }
      logConfiguration = {
        logDriver = "awsfirelens"
        options = {
          Name       = "datadog"
          Host       = "http-intake.logs.${var.datadog_site}"
          TLS        = "on"
          provider   = "ecs"
          dd_service = "datadog-agent"
          dd_source  = "datadog-agent"
          dd_tags    = "env:${var.datadog_env}"
        }
        secretOptions = [
          {
            name      = "apikey"
            valueFrom = aws_ssm_parameter.datadog_api_key.arn
          }
        ]
      }
    }
  ])
}

resource "aws_ecs_service" "personal_site" {
  name            = "${var.project_name}-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.personal_site.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.public[*].id
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = true
  }

  lifecycle {
    ignore_changes = [desired_count]
  }

  depends_on = [
    cloudflare_zero_trust_tunnel_cloudflared_config.personal_site
  ]
}

resource "aws_appautoscaling_target" "personal_site" {
  max_capacity       = var.max_capacity
  min_capacity       = var.min_capacity
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.personal_site.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "personal_site_cpu" {
  name               = "${var.project_name}-cpu-autoscaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.personal_site.resource_id
  scalable_dimension = aws_appautoscaling_target.personal_site.scalable_dimension
  service_namespace  = aws_appautoscaling_target.personal_site.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }

    target_value       = var.autoscaling_cpu_target
    scale_in_cooldown  = var.autoscaling_scale_in_cooldown
    scale_out_cooldown = var.autoscaling_scale_out_cooldown
  }
}

resource "aws_appautoscaling_policy" "personal_site_memory" {
  name               = "${var.project_name}-memory-autoscaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.personal_site.resource_id
  scalable_dimension = aws_appautoscaling_target.personal_site.scalable_dimension
  service_namespace  = aws_appautoscaling_target.personal_site.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }

    target_value       = var.autoscaling_memory_target
    scale_in_cooldown  = var.autoscaling_scale_in_cooldown
    scale_out_cooldown = var.autoscaling_scale_out_cooldown
  }
}
