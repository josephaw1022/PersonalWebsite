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

echo "Disabling AWS Terraform workflows..."

for wf in "${AWS_WORKFLOWS[@]}"; do
  echo "==> Disabling ${wf}..."
  if output=$(gh workflow disable "$wf" 2>&1); then
    echo "    $output"
  else
    if echo "$output" | grep -qi "not active"; then
      echo "    Workflow ${wf} is already disabled."
    else
      echo "    Failed to disable ${wf}: $output" >&2
      exit 1
    fi
  fi
done

echo "AWS Terraform workflows successfully disabled."
