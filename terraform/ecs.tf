resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/${var.project_name}"
  retention_in_days = var.log_retention_days
}

resource "aws_cloudwatch_log_subscription_filter" "ecs_datadog_forwarder" {
  name            = "${var.project_name}-ecs-datadog-logs"
  log_group_name  = aws_cloudwatch_log_group.ecs.name
  filter_pattern  = ""
  destination_arn = aws_cloudformation_stack.datadog_forwarder.outputs["DatadogForwarderArn"]

  depends_on = [
    aws_cloudformation_stack.datadog_forwarder
  ]
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

resource "aws_ecs_task_definition" "personal_site" {
  family                   = var.project_name
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = tostring(var.task_cpu)
  memory                   = tostring(var.task_memory)
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn

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
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "personal-site"
        }
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
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "cloudflared"
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
        }
      ]
      secrets = [
        {
          name      = "DD_API_KEY"
          valueFrom = aws_ssm_parameter.datadog_api_key.arn
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
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "datadog-agent"
        }
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

  depends_on = [
    cloudflare_zero_trust_tunnel_cloudflared_config.personal_site
  ]
}
