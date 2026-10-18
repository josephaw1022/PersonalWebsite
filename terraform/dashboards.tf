resource "datadog_dashboard" "personal_site" {
  title       = "${local.dd_service} - Service & Infrastructure Dashboard"
  description = "Unified Datadog dashboard for ${local.dd_service} covering APM, Next.js runtime performance, ECS Fargate infrastructure metrics, Cloudflare Tunnel connector status, and HTTP health checks."
  layout_type = "ordered"
  tags = [
    "team:platform"
  ]

  template_variable {
    name     = "env"
    prefix   = "env"
    defaults = [local.dd_env]
  }

  template_variable {
    name     = "service"
    prefix   = "service"
    defaults = [local.dd_service]
  }

  template_variable {
    name     = "version"
    prefix   = "version"
    defaults = [local.dd_version]
  }

  # ----------------------------------------------------------------------------
  # Group: Service APM & Performance
  # ----------------------------------------------------------------------------
  widget {
    group_definition {
      title            = "APM & Application Performance (Next.js)"
      layout_type      = "ordered"
      background_color = "vivid_purple"

      widget {
        timeseries_definition {
          title = "APM Request Volume (Hits / sec)"
          request {
            q            = "sum:trace.next.request.hits{$service, $env}.as_count() / 60"
            display_type = "bars"
          }
        }
      }

      widget {
        timeseries_definition {
          title = "APM Errors (Errors / sec)"
          request {
            q            = "sum:trace.next.request.errors{$service, $env}.as_count() / 60"
            display_type = "bars"
          }
        }
      }

      widget {
        timeseries_definition {
          title = "APM Latency (p50, p95, p99)"
          request {
            q            = "p50:trace.next.request{$service, $env}"
            display_type = "line"
          }
          request {
            q            = "p95:trace.next.request{$service, $env}"
            display_type = "line"
          }
          request {
            q            = "p99:trace.next.request{$service, $env}"
            display_type = "line"
          }
        }
      }

      widget {
        timeseries_definition {
          title = "Node.js Process Heap Usage"
          request {
            q            = "avg:runtime.node.mem.heap_used{$service, $env}"
            display_type = "area"
          }
          request {
            q            = "avg:runtime.node.mem.heap_total{$service, $env}"
            display_type = "line"
          }
        }
      }

      widget {
        timeseries_definition {
          title = "Node.js Event Loop Lag"
          request {
            q            = "avg:runtime.node.event_loop.delay.avg{$service, $env} / 1000000"
            display_type = "line"
          }
        }
      }

      widget {
        timeseries_definition {
          title = "Node.js Process CPU Utilization"
          request {
            q            = "avg:runtime.node.cpu.total{$service, $env}"
            display_type = "line"
          }
        }
      }
    }
  }

  # ----------------------------------------------------------------------------
  # Group: ECS Fargate Infrastructure
  # ----------------------------------------------------------------------------
  widget {
    group_definition {
      title            = "ECS Fargate Infrastructure & Resource Utilization"
      layout_type      = "ordered"
      background_color = "vivid_blue"

      widget {
        timeseries_definition {
          title = "Task CPU Utilization (%)"
          request {
            q            = "avg:ecs.fargate.cpu.usage{ecs_service:${aws_ecs_service.personal_site.name}, ecs_cluster:${aws_ecs_cluster.main.name}} / avg:ecs.fargate.cpu.task.limit{ecs_service:${aws_ecs_service.personal_site.name}, ecs_cluster:${aws_ecs_cluster.main.name}} * 100"
            display_type = "line"
          }
        }
      }

      widget {
        timeseries_definition {
          title = "Task Memory Utilization (%)"
          request {
            q            = "avg:ecs.fargate.mem.usage{ecs_service:${aws_ecs_service.personal_site.name}, ecs_cluster:${aws_ecs_cluster.main.name}} / avg:ecs.fargate.mem.task.limit{ecs_service:${aws_ecs_service.personal_site.name}, ecs_cluster:${aws_ecs_cluster.main.name}} * 100"
            display_type = "line"
          }
        }
      }

      widget {
        timeseries_definition {
          title = "Task Ephemeral Storage Utilization (%)"
          request {
            q            = "avg:ecs.fargate.ephemeral_storage.utilized{ecs_service:${aws_ecs_service.personal_site.name}, ecs_cluster:${aws_ecs_cluster.main.name}} / avg:ecs.fargate.ephemeral_storage.reserved{ecs_service:${aws_ecs_service.personal_site.name}, ecs_cluster:${aws_ecs_cluster.main.name}} * 100"
            display_type = "line"
          }
        }
      }

      widget {
        timeseries_definition {
          title = "Network Throughput (Bytes Sent / Rcvd)"
          request {
            q            = "sum:ecs.fargate.net.bytes_sent{ecs_service:${aws_ecs_service.personal_site.name}, ecs_cluster:${aws_ecs_cluster.main.name}}"
            display_type = "line"
          }
          request {
            q            = "sum:ecs.fargate.net.bytes_rcvd{ecs_service:${aws_ecs_service.personal_site.name}, ecs_cluster:${aws_ecs_cluster.main.name}}"
            display_type = "line"
          }
        }
      }

      widget {
        timeseries_definition {
          title = "ECS Service Running vs Desired Task Count"
          request {
            q            = "avg:aws.ecs.service.running{servicename:${aws_ecs_service.personal_site.name}, clustername:${aws_ecs_cluster.main.name}}"
            display_type = "line"
          }
          request {
            q            = "avg:aws.ecs.service.desired{servicename:${aws_ecs_service.personal_site.name}, clustername:${aws_ecs_cluster.main.name}}"
            display_type = "line"
          }
        }
      }

      widget {
        check_status_definition {
          title    = "Container HTTP Check Status"
          check    = "http.can_connect"
          grouping = "check"
          group_by = ["instance", "env"]
          tags     = ["service:${local.dd_service}"]
        }
      }
    }
  }

  # ----------------------------------------------------------------------------
  # Group: Ingress & Cloudflare Zero Trust Tunnel
  # ----------------------------------------------------------------------------
  widget {
    group_definition {
      title            = "Ingress & Cloudflare Zero Trust Tunnel"
      layout_type      = "ordered"
      background_color = "vivid_orange"

      widget {
        timeseries_definition {
          title = "Synthetics Uptime & Response Time"
          request {
            q            = "avg:synthetics.http.response.time{check_id:${datadog_synthetics_test.site_health.id}}"
            display_type = "line"
          }
        }
      }

      widget {
        timeseries_definition {
          title = "Cloudflare Tunnel Requests & Status"
          request {
            q            = "sum:cloudflared.cloudflared_tunnel_total_requests.count{*} by {user_hostname}"
            display_type = "line"
          }
        }
      }

      widget {
        timeseries_definition {
          title = "Cloudflare Tunnel Active TCP Streams"
          request {
            q            = "sum:cloudflared.cloudflared_tcp_active_sessions{*}"
            display_type = "line"
          }
        }
      }

      widget {
        manage_status_definition {
          title               = "Monitors Status"
          query               = "type:monitor (service:${local.dd_service} OR clustername:${aws_ecs_cluster.main.name})"
          sort                = "status,asc"
          display_format      = "countsAndList"
          color_preference    = "text"
          hide_zero_counts    = false
          show_last_triggered = true
        }
      }
    }
  }
}
