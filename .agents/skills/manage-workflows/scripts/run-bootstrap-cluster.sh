#!/usr/bin/env bash
set -euo pipefail

if ! command -v gh &>/dev/null; then
  echo "Error: gh CLI is required but not installed." >&2
  exit 1
fi

TARGET_ENV="${1:-all}"
TAG="${2:-latest}"
SECRET_NAME="${3:-quay-pull-secret}"
REF="${4:-}"

echo "Dispatching 'Cluster Infrastructure - Bootstrap' (bootstrap-cluster.yml)..."
echo "  Target Env:  $TARGET_ENV"
echo "  Tag:         $TAG"
echo "  Secret Name: $SECRET_NAME"

ARGS=(-f "target_env=$TARGET_ENV" -f "tag=$TAG" -f "secret_name=$SECRET_NAME")
if [ -n "$REF" ]; then
  ARGS+=(--ref "$REF")
fi

gh workflow run bootstrap-cluster.yml "${ARGS[@]}"
