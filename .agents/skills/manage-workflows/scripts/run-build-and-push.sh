#!/usr/bin/env bash
set -euo pipefail

if ! command -v gh &>/dev/null; then
  echo "Error: gh CLI is required but not installed." >&2
  exit 1
fi

REF="${1:-}"

echo "Dispatching 'Container Image - Build & Push' (build-and-push.yaml)..."

ARGS=()
if [ -n "$REF" ]; then
  ARGS+=(--ref "$REF")
fi

gh workflow run build-and-push.yaml "${ARGS[@]}"
