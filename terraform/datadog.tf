data "aws_iam_policy_document" "datadog_aws_integration_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "AWS"
      identifiers = ["arn:${var.aws_partition}:iam::464622532012:root"]
    }

    condition {
      test     = "StringEquals"
      variable = "sts:ExternalId"
      values = [
        datadog_integration_aws_account.datadog_integration.auth_config.aws_auth_config_role.external_id
      ]
    }
  }
}

data "datadog_integration_aws_iam_permissions" "datadog_permissions" {}

locals {
  all_permissions = data.datadog_integration_aws_iam_permissions.datadog_permissions.iam_permissions

  max_policy_size   = 6144
  target_chunk_size = 5900

  permission_sizes = [
    for perm in local.all_permissions :
    length(perm) + 3
  ]
  cumulative_sizes = [
    for i in range(length(local.permission_sizes)) :
    sum(slice(local.permission_sizes, 0, i + 1))
  ]

  chunk_assignments = [
    for cumulative_size in local.cumulative_sizes :
    floor(cumulative_size / local.target_chunk_size)
  ]
  chunk_numbers = distinct(local.chunk_assignments)
  permission_chunks = [
    for chunk_num in local.chunk_numbers : [
      for i, perm in local.all_permissions :
      perm if local.chunk_assignments[i] == chunk_num
    ]
  ]
}

data "aws_iam_policy_document" "datadog_aws_integration" {
  count = length(local.permission_chunks)

  statement {
    actions   = local.permission_chunks[count.index]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "datadog_aws_integration" {
  count = length(local.permission_chunks)

  name   = "DatadogAWSIntegrationPolicy-${count.index + 1}"
  policy = data.aws_iam_policy_document.datadog_aws_integration[count.index].json
}

resource "aws_iam_role" "datadog_aws_integration" {
  name               = var.datadog_role_name
  description        = "Role for Datadog AWS Integration"
  assume_role_policy = data.aws_iam_policy_document.datadog_aws_integration_assume_role.json
}

resource "aws_iam_role_policy_attachment" "datadog_aws_integration" {
  count = length(local.permission_chunks)

  role       = aws_iam_role.datadog_aws_integration.name
  policy_arn = aws_iam_policy.datadog_aws_integration[count.index].arn
}

resource "aws_iam_role_policy_attachment" "datadog_aws_integration_security_audit" {
  role       = aws_iam_role.datadog_aws_integration.name
  policy_arn = "arn:${var.aws_partition}:iam::aws:policy/SecurityAudit"
}

resource "aws_cloudformation_stack" "datadog_forwarder" {
  name             = "${var.project_name}-datadog-forwarder"
  template_url     = var.datadog_forwarder_template_url
  capabilities     = ["CAPABILITY_IAM", "CAPABILITY_NAMED_IAM", "CAPABILITY_AUTO_EXPAND"]
  disable_rollback = false

  parameters = {
    DdApiKey           = var.datadog_api_key
    DdSite             = var.datadog_site
    FunctionName       = "${var.project_name}-datadog-forwarder"
    LogRetentionInDays = var.log_retention_days
    DdTags             = join(",", var.datadog_account_tags)
  }
}

resource "datadog_integration_aws_account" "datadog_integration" {
  account_tags   = var.datadog_account_tags
  aws_account_id = var.aws_account_id
  aws_partition  = var.aws_partition

  aws_regions {
    include_all = true
  }

  auth_config {
    aws_auth_config_role {
      role_name = var.datadog_role_name
    }
  }

  resources_config {
    cloud_security_posture_management_collection = true
    extended_collection                          = true
  }

  traces_config {
    xray_services {}
  }

  logs_config {
    lambda_forwarder {
      lambdas = [
        aws_cloudformation_stack.datadog_forwarder.outputs["DatadogForwarderArn"]
      ]
    }
  }



  metrics_config {
    namespace_filters {}
  }
}

moved {
  from = datadog_integration_aws_account.main
  to   = datadog_integration_aws_account.datadog_integration
}

moved {
  from = aws_iam_policy.datadog_aws_integration
  to   = aws_iam_policy.datadog_aws_integration[0]
}

moved {
  from = aws_iam_role_policy_attachment.datadog_aws_integration
  to   = aws_iam_role_policy_attachment.datadog_aws_integration[0]
}
