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

echo "Enabling homelab / OpenShift cluster workflows..."

for wf in "${HOMELAB_WORKFLOWS[@]}"; do
  echo "==> Enabling ${wf}..."
  gh workflow enable "$wf"
done

echo "Homelab workflows successfully enabled."
