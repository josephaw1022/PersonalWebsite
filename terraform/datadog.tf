data "aws_caller_identity" "current" {}

data "aws_partition" "current" {}

locals {
  datadog_integration_actions = [
    "apigateway:GET",
    "aoss:BatchGetCollection",
    "aoss:ListCollections",
    "autoscaling:Describe*",
    "backup:List*",
    "bcm-data-exports:GetExport",
    "bcm-data-exports:ListExports",
    "bedrock:GetAgent",
    "bedrock:GetAgentAlias",
    "bedrock:GetFlow",
    "bedrock:GetFlowAlias",
    "bedrock:GetGuardrail",
    "bedrock:GetImportedModel",
    "bedrock:GetInferenceProfile",
    "bedrock:GetMarketplaceModelEndpoint",
    "bedrock:ListAgentAliases",
    "bedrock:ListAgents",
    "bedrock:ListFlowAliases",
    "bedrock:ListFlows",
    "bedrock:ListGuardrails",
    "bedrock:ListImportedModels",
    "bedrock:ListInferenceProfiles",
    "bedrock:ListMarketplaceModelEndpoints",
    "bedrock:ListPromptRouters",
    "bedrock:ListProvisionedModelThroughputs",
    "budgets:ViewBudget",
    "cassandra:Select",
    "cloudfront:GetDistributionConfig",
    "cloudfront:ListDistributions",
    "cloudtrail:DescribeTrails",
    "cloudtrail:GetTrailStatus",
    "cloudtrail:LookupEvents",
    "cloudwatch:Describe*",
    "cloudwatch:Get*",
    "cloudwatch:List*",
    "codeartifact:DescribeDomain",
    "codeartifact:DescribePackageGroup",
    "codeartifact:DescribeRepository",
    "codeartifact:ListDomains",
    "codeartifact:ListPackageGroups",
    "codeartifact:ListPackages",
    "codedeploy:BatchGet*",
    "codedeploy:List*",
    "codepipeline:ListWebhooks",
    "cur:DescribeReportDefinitions",
    "directconnect:Describe*",
    "dynamodb:Describe*",
    "dynamodb:List*",
    "ec2:Describe*",
    "ec2:GetAllowedImagesSettings",
    "ec2:GetEbsDefaultKmsKeyId",
    "ec2:GetInstanceMetadataDefaults",
    "ec2:GetSerialConsoleAccessStatus",
    "ec2:GetSnapshotBlockPublicAccessState",
    "ec2:GetTransitGatewayPrefixListReferences",
    "ec2:SearchTransitGatewayRoutes",
    "ecs:Describe*",
    "ecs:List*",
    "elasticache:Describe*",
    "elasticache:List*",
    "elasticfilesystem:DescribeAccessPoints",
    "elasticfilesystem:DescribeFileSystems",
    "elasticfilesystem:DescribeTags",
    "elasticloadbalancing:Describe*",
    "elasticmapreduce:Describe*",
    "elasticmapreduce:List*",
    "emr-containers:ListManagedEndpoints",
    "emr-containers:ListSecurityConfigurations",
    "emr-containers:ListVirtualClusters",
    "es:DescribeElasticsearchDomains",
    "es:ListDomainNames",
    "es:ListTags",
    "events:CreateEventBus",
    "fsx:DescribeFileSystems",
    "fsx:ListTagsForResource",
    "glacier:GetVaultNotifications",
    "glue:ListRegistries",
    "grafana:DescribeWorkspace",
    "greengrass:GetComponent",
    "greengrass:GetConnectivityInfo",
    "greengrass:GetCoreDevice",
    "greengrass:GetDeployment",
    "health:DescribeAffectedEntities",
    "health:DescribeEventDetails",
    "health:DescribeEvents",
    "kinesis:Describe*",
    "kinesis:List*",
    "lambda:GetPolicy",
    "lambda:List*",
    "lightsail:GetInstancePortStates",
    "logs:DeleteSubscriptionFilter",
    "logs:DescribeLogGroups",
    "logs:DescribeLogStreams",
    "logs:DescribeSubscriptionFilters",
    "logs:FilterLogEvents",
    "logs:PutSubscriptionFilter",
    "logs:TestMetricFilter",
    "macie2:GetAllowList",
    "macie2:GetCustomDataIdentifier",
    "macie2:ListAllowLists",
    "macie2:ListCustomDataIdentifiers",
    "macie2:ListMembers",
    "macie2:GetMacieSession",
    "managedblockchain:GetAccessor",
    "managedblockchain:GetMember",
    "managedblockchain:GetNetwork",
    "managedblockchain:GetNode",
    "managedblockchain:GetProposal",
    "managedblockchain:ListAccessors",
    "managedblockchain:ListInvitations",
    "managedblockchain:ListMembers",
    "managedblockchain:ListNodes",
    "managedblockchain:ListProposals",
    "memorydb:DescribeAcls",
    "memorydb:DescribeMultiRegionClusters",
    "memorydb:DescribeParameterGroups",
    "memorydb:DescribeReservedNodes",
    "memorydb:DescribeSnapshots",
    "memorydb:DescribeSubnetGroups",
    "memorydb:DescribeUsers",
    "oam:ListAttachedLinks",
    "oam:ListSinks",
    "organizations:Describe*",
    "organizations:List*",
    "osis:GetPipeline",
    "osis:GetPipelineBlueprint",
    "osis:ListPipelineBlueprints",
    "osis:ListPipelines",
    "proton:GetComponent",
    "proton:GetDeployment",
    "proton:GetEnvironment",
    "proton:GetEnvironmentAccountConnection",
    "proton:GetEnvironmentTemplate",
    "proton:GetEnvironmentTemplateVersion",
    "proton:GetRepository",
    "proton:GetService",
    "proton:GetServiceInstance",
    "proton:GetServiceTemplate",
    "proton:GetServiceTemplateVersion",
    "proton:ListComponents",
    "proton:ListDeployments",
    "proton:ListEnvironmentAccountConnections",
    "proton:ListEnvironmentTemplateVersions",
    "proton:ListEnvironmentTemplates",
    "proton:ListEnvironments",
    "proton:ListRepositories",
    "proton:ListServiceInstances",
    "proton:ListServiceTemplateVersions",
    "proton:ListServiceTemplates",
    "proton:ListServices",
    "qldb:ListJournalKinesisStreamsForLedger",
    "rds:Describe*",
    "rds:List*",
    "redshift:DescribeClusters",
    "redshift:DescribeLoggingStatus",
    "redshift-serverless:ListEndpointAccess",
    "redshift-serverless:ListManagedWorkgroups",
    "redshift-serverless:ListNamespaces",
    "redshift-serverless:ListRecoveryPoints",
    "redshift-serverless:ListSnapshots",
    "route53:List*",
    "s3:GetBucketLocation",
    "s3:GetBucketLogging",
    "s3:GetBucketNotification",
    "s3:GetBucketTagging",
    "s3:ListAccessGrants",
    "s3:ListAllMyBuckets",
    "s3:PutBucketNotification",
    "s3express:GetBucketPolicy",
    "s3express:GetEncryptionConfiguration",
    "s3express:ListAllMyDirectoryBuckets",
    "s3tables:GetTableBucketMaintenanceConfiguration",
    "s3tables:ListTableBuckets",
    "s3tables:ListTables",
    "savingsplans:DescribeSavingsPlanRates",
    "savingsplans:DescribeSavingsPlans",
    "secretsmanager:GetResourcePolicy",
    "ses:Get*",
    "ses:ListAddonInstances",
    "ses:ListAddonSubscriptions",
    "ses:ListAddressLists",
    "ses:ListArchives",
    "ses:ListContactLists",
    "ses:ListCustomVerificationEmailTemplates",
    "ses:ListMultiRegionEndpoints",
    "ses:ListIngressPoints",
    "ses:ListRelays",
    "ses:ListRuleSets",
    "ses:ListTemplates",
    "ses:ListTrafficPolicies",
    "sns:GetSubscriptionAttributes",
    "sns:List*",
    "sns:Publish",
    "sqs:ListQueues",
    "states:DescribeStateMachine",
    "states:ListStateMachines",
    "support:DescribeTrustedAdvisor*",
    "support:RefreshTrustedAdvisorCheck",
    "tag:GetResources",
    "tag:GetTagKeys",
    "tag:GetTagValues",
    "timestream:DescribeEndpoints",
    "timestream:ListTables",
    "waf-regional:GetRule",
    "waf-regional:GetRuleGroup",
    "waf-regional:ListRuleGroups",
    "waf-regional:ListRules",
    "waf:GetRule",
    "waf:GetRuleGroup",
    "waf:ListRuleGroups",
    "waf:ListRules",
    "wafv2:GetIPSet",
    "wafv2:GetLoggingConfiguration",
    "wafv2:GetRegexPatternSet",
    "wafv2:GetRuleGroup",
    "wafv2:ListLoggingConfigurations",
    "workmail:DescribeOrganization",
    "workmail:ListOrganizations",
    "xray:BatchGetTraces",
    "xray:GetTraceSummaries",
  ]
}

resource "datadog_integration_aws_account" "main" {
  account_tags   = var.datadog_account_tags
  aws_account_id = data.aws_caller_identity.current.account_id
  aws_partition  = data.aws_partition.current.partition

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
    lambda_forwarder {}
  }

  metrics_config {
    namespace_filters {}
  }
}

data "aws_iam_policy_document" "datadog_aws_integration_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "AWS"
      identifiers = ["arn:${data.aws_partition.current.partition}:iam::464622532012:root"]
    }

    condition {
      test     = "StringEquals"
      variable = "sts:ExternalId"
      values = [
        datadog_integration_aws_account.main.auth_config.aws_auth_config_role.external_id
      ]
    }
  }
}

data "aws_iam_policy_document" "datadog_aws_integration" {
  statement {
    actions   = local.datadog_integration_actions
    resources = ["*"]
  }
}

resource "aws_iam_policy" "datadog_aws_integration" {
  name   = "DatadogAWSIntegrationPolicy"
  policy = data.aws_iam_policy_document.datadog_aws_integration.json
}

resource "aws_iam_role" "datadog_aws_integration" {
  name               = var.datadog_role_name
  description        = "Role for Datadog AWS Account Integration"
  assume_role_policy = data.aws_iam_policy_document.datadog_aws_integration_assume_role.json
}

resource "aws_iam_role_policy_attachment" "datadog_aws_integration" {
  role       = aws_iam_role.datadog_aws_integration.name
  policy_arn = aws_iam_policy.datadog_aws_integration.arn
}

resource "aws_iam_role_policy_attachment" "datadog_aws_integration_security_audit" {
  role       = aws_iam_role.datadog_aws_integration.name
  policy_arn = "arn:${data.aws_partition.current.partition}:iam::aws:policy/SecurityAudit"
}
