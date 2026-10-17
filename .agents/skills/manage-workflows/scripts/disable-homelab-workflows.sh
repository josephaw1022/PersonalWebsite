#!/usr/bin/env bash
set -euo pipefail

# Ensure gh CLI is installed
if ! command -v gh &>/dev/null; then
  echo "Error: gh CLI is required but not installed." >&2
  exit 1
fi

# Homelab OpenShift workflows that rely on on-prem self-hosted runners ('personal-site-runner')
HOMELAB_WORKFLOWS=(
  "bootstrap-cluster.yml"
  "build-and-push.yaml"
  "deploy-dev.yml"
  "deploy-prod.yml"
)

echo "Disabling homelab / OpenShift cluster workflows..."

for wf in "${HOMELAB_WORKFLOWS[@]}"; do
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

echo "Homelab workflows successfully disabled."
