#!/usr/bin/env bash
set -euo pipefail

if ! command -v gh &>/dev/null; then
  echo "Error: gh CLI is required but not installed." >&2
  exit 1
fi

REF="${1:-}"

echo "Dispatching 'Pull Request - Format Check' (pr-format.yaml)..."

ARGS=()
if [ -n "$REF" ]; then
  ARGS+=(--ref "$REF")
fi

gh workflow run pr-format.yaml "${ARGS[@]}"
