#!/usr/bin/env bash
set -euo pipefail

# Ensure gh CLI is installed
if ! command -v gh &>/dev/null; then
  echo "Error: gh CLI is required but not installed." >&2
  exit 1
fi

# AWS Terraform deployment workflows
AWS_WORKFLOWS=(
  "deploy-aws.yml"
)

echo "Enabling AWS Terraform workflows..."

for wf in "${AWS_WORKFLOWS[@]}"; do
  echo "==> Enabling ${wf}..."
  gh workflow enable "$wf"
done

echo "AWS Terraform workflows successfully enabled."
