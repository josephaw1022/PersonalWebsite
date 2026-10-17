#!/usr/bin/env bash
set -euo pipefail

if ! command -v gh &>/dev/null; then
  echo "Error: gh CLI is required but not installed." >&2
  exit 1
fi

TAG="${1:-}"
REF="${2:-}"

echo "Dispatching 'Deploy Personal Site - Production' (deploy-prod.yml)..."

ARGS=()
if [ -n "$TAG" ]; then
  echo "  Tag: $TAG"
  ARGS+=(-f "tag=$TAG")
fi
if [ -n "$REF" ]; then
  ARGS+=(--ref "$REF")
fi

gh workflow run deploy-prod.yml "${ARGS[@]}"
