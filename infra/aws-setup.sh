#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
ENV_FILE="${REPO_ROOT}/.env"

usage() {
  cat <<EOF
Usage: $0 [options]

Bootstraps the AWS S3 Terraform state bucket, GitHub Actions OIDC identity provider,
IAM Role, and least-privilege IAM Policy required by the AWS Terraform deployment workflow.

Options:
  --profile <AWS_PROFILE>               AWS CLI profile to use (e.g., personal-site)
  --region <AWS_REGION>                 AWS region (default: us-east-1 or AWS_REGION from .env)
  --bucket <TF_STATE_BUCKET>            S3 bucket name for Terraform state (default: personal-site-tfstate-<ACCOUNT_ID>)
  --role-name <AWS_ROLE_NAME>           IAM role name for GitHub Actions OIDC (default: personal-site-github-actions-terraform)
  --repo <OWNER/REPO>                   GitHub repository slug (default: josephaw1022/PersonalWebsite)
  --domain <DOMAIN_NAME>                Domain name in Cloudflare for auto-discovering Zone ID (default: jwhiteaker22.com)
  --cloudflare-account-id <ACCOUNT_ID>  Optional: sync CLOUDFLARE_ACCOUNT_ID to GitHub repository secrets
  --cloudflare-zone-id <ZONE_ID>        Optional: sync CLOUDFLARE_ZONE_ID to GitHub repository secrets (auto-detected if token is given)
  --cloudflare-api-token <API_TOKEN>    Optional: sync CLOUDFLARE_API_TOKEN to GitHub repository secrets
  --skip-gh-config                      Do not set GitHub repository variables/secrets via gh CLI
  -h, --help                            Show this help message
EOF
  exit 1
}

load_env_file() {
  if [[ ! -f "${ENV_FILE}" ]]; then
    return 0
  fi

  echo "==> Loading defaults from ${ENV_FILE}..."
  set -a
  # shellcheck disable=SC1090
  source "${ENV_FILE}"
  set +a
}

load_env_file

AWS_PROFILE_ARG="${AWS_PROFILE:-}"
AWS_REGION="${AWS_REGION:-us-east-1}"
TF_STATE_BUCKET="${TF_STATE_BUCKET:-}"
AWS_ROLE_NAME="${AWS_ROLE_NAME:-personal-site-github-actions-terraform}"
AWS_POLICY_NAME="${AWS_POLICY_NAME:-personal-site-terraform-deployer-policy}"
GITHUB_REPO="${GITHUB_REPO:-josephaw1022/PersonalWebsite}"
DOMAIN_NAME="${DOMAIN_NAME:-jwhiteaker22.com}"
CLOUDFLARE_ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-}"
CLOUDFLARE_ZONE_ID="${CLOUDFLARE_ZONE_ID:-}"
CLOUDFLARE_API_TOKEN="${CLOUDFLARE_API_TOKEN:-}"
SKIP_GH_CONFIG="false"

while [[ "$#" -gt 0 ]]; do
  case "$1" in
    --profile) AWS_PROFILE_ARG="$2"; shift ;;
    --region) AWS_REGION="$2"; shift ;;
    --bucket) TF_STATE_BUCKET="$2"; shift ;;
    --role-name) AWS_ROLE_NAME="$2"; shift ;;
    --repo) GITHUB_REPO="$2"; shift ;;
    --domain) DOMAIN_NAME="$2"; shift ;;
    --cloudflare-account-id) CLOUDFLARE_ACCOUNT_ID="$2"; shift ;;
    --cloudflare-zone-id) CLOUDFLARE_ZONE_ID="$2"; shift ;;
    --cloudflare-api-token) CLOUDFLARE_API_TOKEN="$2"; shift ;;
    --skip-gh-config) SKIP_GH_CONFIG="true" ;;
    -h|--help) usage ;;
    *) echo "Error: Unknown parameter passed: $1" >&2; usage ;;
  esac
  shift
done

if [[ -n "${AWS_PROFILE_ARG}" ]]; then
  export AWS_PROFILE="${AWS_PROFILE_ARG}"
fi

if ! command -v aws &>/dev/null; then
  echo "Error: 'aws' CLI is required but not installed." >&2
  exit 1
fi

echo "==> Verifying AWS credentials${AWS_PROFILE:+ (profile: ${AWS_PROFILE})}..."
AWS_ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
echo "    AWS Account ID: ${AWS_ACCOUNT_ID}"
echo "    AWS Region:     ${AWS_REGION}"

if [[ -z "${TF_STATE_BUCKET}" ]]; then
  TF_STATE_BUCKET="personal-site-tfstate-${AWS_ACCOUNT_ID}"
fi

# 1. Create and configure S3 Bucket for Terraform state
echo "==> Ensuring S3 state bucket '${TF_STATE_BUCKET}' exists in ${AWS_REGION}..."
if aws s3api head-bucket --bucket "${TF_STATE_BUCKET}" 2>/dev/null; then
  echo "    Bucket '${TF_STATE_BUCKET}' already exists."
else
  echo "    Creating bucket '${TF_STATE_BUCKET}'..."
  if [[ "${AWS_REGION}" == "us-east-1" ]]; then
    aws s3api create-bucket \
      --bucket "${TF_STATE_BUCKET}" \
      --region "${AWS_REGION}" >/dev/null
  else
    aws s3api create-bucket \
      --bucket "${TF_STATE_BUCKET}" \
      --region "${AWS_REGION}" \
      --create-bucket-configuration LocationConstraint="${AWS_REGION}" >/dev/null
  fi
fi

echo "==> Configuring versioning, encryption, and public access block on '${TF_STATE_BUCKET}'..."
aws s3api put-bucket-versioning \
  --bucket "${TF_STATE_BUCKET}" \
  --versioning-configuration Status=Enabled

aws s3api put-bucket-encryption \
  --bucket "${TF_STATE_BUCKET}" \
  --server-side-encryption-configuration '{
    "Rules": [
      {
        "ApplyServerSideEncryptionByDefault": {
          "SSEAlgorithm": "AES256"
        },
        "BucketKeyEnabled": true
      }
    ]
  }'

aws s3api put-public-access-block \
  --bucket "${TF_STATE_BUCKET}" \
  --public-access-block-configuration \
    BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

# 2. Ensure GitHub Actions OIDC Provider exists in AWS IAM
OIDC_PROVIDER_URL="token.actions.githubusercontent.com"
OIDC_PROVIDER_ARN="arn:aws:iam::${AWS_ACCOUNT_ID}:oidc-provider/${OIDC_PROVIDER_URL}"

echo "==> Checking GitHub Actions OIDC provider (${OIDC_PROVIDER_ARN})..."
if aws iam get-open-id-connect-provider --open-id-connect-provider-arn "${OIDC_PROVIDER_ARN}" >/dev/null 2>&1; then
  echo "    OIDC provider already exists."
else
  echo "    Creating GitHub Actions OIDC provider..."
  aws iam create-open-id-connect-provider \
    --url "https://${OIDC_PROVIDER_URL}" \
    --client-id-list "sts.amazonaws.com" \
    --thumbprint-list "6938fd4d98bab03faadb97b34396831e3780aea1" >/dev/null
fi

# 3. Create or update IAM Role for GitHub Actions OIDC
TRUST_POLICY="$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "${OIDC_PROVIDER_ARN}"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:${GITHUB_REPO}:*"
        }
      }
    }
  ]
}
EOF
)"

echo "==> Ensuring IAM Role '${AWS_ROLE_NAME}' exists..."
if aws iam get-role --role-name "${AWS_ROLE_NAME}" >/dev/null 2>&1; then
  echo "    Updating trust policy on existing role '${AWS_ROLE_NAME}'..."
  aws iam update-assume-role-policy \
    --role-name "${AWS_ROLE_NAME}" \
    --policy-document "${TRUST_POLICY}"
else
  echo "    Creating IAM role '${AWS_ROLE_NAME}'..."
  aws iam create-role \
    --role-name "${AWS_ROLE_NAME}" \
    --assume-role-policy-document "${TRUST_POLICY}" \
    --description "GitHub Actions OIDC role for deploying PersonalWebsite Terraform stack" >/dev/null
fi

AWS_ROLE_ARN="$(aws iam get-role --role-name "${AWS_ROLE_NAME}" --query 'Role.Arn' --output text)"

# 4. Create or update least-privilege inline IAM Policy on the Role
PERMISSIONS_POLICY="$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "TerraformStateBucketAccess",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetBucketVersioning",
        "s3:GetBucketLocation"
      ],
      "Resource": "arn:aws:s3:::${TF_STATE_BUCKET}"
    },
    {
      "Sid": "TerraformStateObjectAccess",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::${TF_STATE_BUCKET}/*"
    },
    {
      "Sid": "VPCAndNetworkingManagement",
      "Effect": "Allow",
      "Action": [
        "ec2:CreateVpc",
        "ec2:DeleteVpc",
        "ec2:DescribeVpcs",
        "ec2:ModifyVpcAttribute",
        "ec2:DescribeVpcAttribute",
        "ec2:CreateInternetGateway",
        "ec2:DeleteInternetGateway",
        "ec2:AttachInternetGateway",
        "ec2:DetachInternetGateway",
        "ec2:DescribeInternetGateways",
        "ec2:CreateSubnet",
        "ec2:DeleteSubnet",
        "ec2:DescribeSubnets",
        "ec2:ModifySubnetAttribute",
        "ec2:CreateRouteTable",
        "ec2:DeleteRouteTable",
        "ec2:DescribeRouteTables",
        "ec2:CreateRoute",
        "ec2:ReplaceRoute",
        "ec2:DeleteRoute",
        "ec2:AssociateRouteTable",
        "ec2:DisassociateRouteTable",
        "ec2:CreateSecurityGroup",
        "ec2:DeleteSecurityGroup",
        "ec2:DescribeSecurityGroups",
        "ec2:DescribeSecurityGroupRules",
        "ec2:AuthorizeSecurityGroupIngress",
        "ec2:RevokeSecurityGroupIngress",
        "ec2:AuthorizeSecurityGroupEgress",
        "ec2:RevokeSecurityGroupEgress",
        "ec2:DescribeAvailabilityZones",
        "ec2:DescribeNetworkInterfaces",
        "ec2:DescribeAccountAttributes",
        "ec2:CreateTags",
        "ec2:DeleteTags",
        "ec2:DescribeTags"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ECSManagement",
      "Effect": "Allow",
      "Action": [
        "ecs:*"
      ],
      "Resource": "*"
    },
    {
      "Sid": "CloudWatchLogsManagement",
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:DeleteLogGroup",
        "logs:DescribeLogGroups",
        "logs:PutRetentionPolicy",
        "logs:DeleteRetentionPolicy",
        "logs:ListTagsForResource",
        "logs:ListTagsLogGroup",
        "logs:TagResource",
        "logs:UntagResource",
        "logs:TagLogGroup",
        "logs:UntagLogGroup"
      ],
      "Resource": "*"
    },
    {
      "Sid": "SSMParameterStoreManagement",
      "Effect": "Allow",
      "Action": [
        "ssm:PutParameter",
        "ssm:GetParameter",
        "ssm:GetParameters",
        "ssm:DeleteParameter",
        "ssm:DescribeParameters",
        "ssm:AddTagsToResource",
        "ssm:RemoveTagsFromResource",
        "ssm:ListTagsForResource"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ECSTaskExecutionRoleManagement",
      "Effect": "Allow",
      "Action": [
        "iam:CreateRole",
        "iam:DeleteRole",
        "iam:GetRole",
        "iam:UpdateRole",
        "iam:UpdateAssumeRolePolicy",
        "iam:TagRole",
        "iam:UntagRole",
        "iam:ListRolePolicies",
        "iam:ListAttachedRolePolicies",
        "iam:ListInstanceProfilesForRole",
        "iam:PutRolePolicy",
        "iam:GetRolePolicy",
        "iam:DeleteRolePolicy",
        "iam:AttachRolePolicy",
        "iam:DetachRolePolicy",
        "iam:PassRole"
      ],
      "Resource": "arn:aws:iam::${AWS_ACCOUNT_ID}:role/*personal-site*"
    },
    {
      "Sid": "ECSServiceLinkedRoleCreation",
      "Effect": "Allow",
      "Action": [
        "iam:CreateServiceLinkedRole"
      ],
      "Resource": "arn:aws:iam::*:role/aws-service-role/ecs.amazonaws.com/AWSServiceRoleForECS*",
      "Condition": {
        "StringLike": {
          "iam:AWSServiceName": "ecs.amazonaws.com"
        }
      }
    }
  ]
}
EOF
)"

echo "==> Attaching inline IAM policy '${AWS_POLICY_NAME}' to role '${AWS_ROLE_NAME}'..."
aws iam put-role-policy \
  --role-name "${AWS_ROLE_NAME}" \
  --policy-name "${AWS_POLICY_NAME}" \
  --policy-document "${PERMISSIONS_POLICY}"

# Auto-discover Cloudflare Zone ID if token is provided and zone ID is omitted
if [[ -n "${CLOUDFLARE_API_TOKEN}" && -z "${CLOUDFLARE_ZONE_ID}" ]] && command -v curl &>/dev/null && command -v jq &>/dev/null; then
  echo "==> Discovering Cloudflare Zone ID for '${DOMAIN_NAME}'..."
  CLOUDFLARE_ZONE_ID="$(curl -fsSL "https://api.cloudflare.com/client/v4/zones?name=${DOMAIN_NAME}" \
    -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" | jq -r '.result[0].id // empty')"
  if [[ -n "${CLOUDFLARE_ZONE_ID}" ]]; then
    echo "    Found Cloudflare Zone ID: ${CLOUDFLARE_ZONE_ID}"
  fi
fi

# 5. Optionally configure GitHub variables/secrets if gh CLI is available
if [[ "${SKIP_GH_CONFIG}" == "false" ]] && command -v gh &>/dev/null; then
  if gh auth status >/dev/null 2>&1; then
    echo "==> Syncing AWS configuration to GitHub repository variables (${GITHUB_REPO})..."
    gh variable set AWS_REGION --body "${AWS_REGION}" --repo "${GITHUB_REPO}"
    gh variable set TF_STATE_BUCKET --body "${TF_STATE_BUCKET}" --repo "${GITHUB_REPO}"
    gh variable set AWS_ROLE_ARN --body "${AWS_ROLE_ARN}" --repo "${GITHUB_REPO}"

    if [[ -n "${CLOUDFLARE_ACCOUNT_ID}" ]]; then
      gh secret set CLOUDFLARE_ACCOUNT_ID --body "${CLOUDFLARE_ACCOUNT_ID}" --repo "${GITHUB_REPO}"
    fi
    if [[ -n "${CLOUDFLARE_ZONE_ID}" ]]; then
      gh secret set CLOUDFLARE_ZONE_ID --body "${CLOUDFLARE_ZONE_ID}" --repo "${GITHUB_REPO}"
    fi
    if [[ -n "${CLOUDFLARE_API_TOKEN}" ]]; then
      gh secret set CLOUDFLARE_API_TOKEN --body "${CLOUDFLARE_API_TOKEN}" --repo "${GITHUB_REPO}"
    fi

    echo "==> Ensuring GitHub Actions workflow permissions allow creating pull requests..."
    gh api -X PUT "repos/${GITHUB_REPO}/actions/permissions/workflow" \
      -F default_workflow_permissions=read \
      -F can_approve_pull_request_reviews=true >/dev/null 2>&1 || true
  else
    echo "Warning: 'gh' CLI is not authenticated. Skipping automatic GitHub variable/secret setup."
  fi
fi

echo ""
echo "================================================================================"
echo "AWS Terraform Backend & GitHub OIDC Role Bootstrap Complete!"
echo "================================================================================"
echo "S3 State Bucket : ${TF_STATE_BUCKET}"
echo "AWS Region      : ${AWS_REGION}"
echo "IAM Role ARN    : ${AWS_ROLE_ARN}"
if [[ -n "${CLOUDFLARE_ZONE_ID}" ]]; then
  echo "CF Zone ID      : ${CLOUDFLARE_ZONE_ID} (${DOMAIN_NAME})"
fi
echo "================================================================================"
