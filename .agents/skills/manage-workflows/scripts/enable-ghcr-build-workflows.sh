#!/usr/bin/env bash
set -euo pipefail

# Ensure gh CLI is installed
if ! command -v gh &>/dev/null; then
  echo "Error: gh CLI is required but not installed." >&2
  exit 1
fi

# GHCR container build and push workflows
GHCR_WORKFLOWS=(
  "build-and-push-ghcr.yaml"
)

echo "Enabling GHCR build workflows..."

for wf in "${GHCR_WORKFLOWS[@]}"; do
  echo "==> Enabling ${wf}..."
  gh workflow enable "$wf"
done

echo "GHCR build workflows successfully enabled."
