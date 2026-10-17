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

echo "Disabling GHCR build workflows..."

for wf in "${GHCR_WORKFLOWS[@]}"; do
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

echo "GHCR build workflows successfully disabled."
