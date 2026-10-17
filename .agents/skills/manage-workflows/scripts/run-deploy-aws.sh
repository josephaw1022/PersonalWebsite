#!/usr/bin/env bash
set -euo pipefail

if ! command -v gh &>/dev/null; then
  echo "Error: gh CLI is required but not installed." >&2
  exit 1
fi

ACTION="${1:-apply}"
IMAGE_TAG="${2:-latest}"
REF="${3:-}"

echo "Dispatching 'Deploy Personal Site - AWS (Terraform)' (deploy-aws.yml)..."
echo "  Action:    $ACTION"
echo "  Image Tag: $IMAGE_TAG"

ARGS=(-f "action=$ACTION" -f "image_tag=$IMAGE_TAG")
if [ -n "$REF" ]; then
  ARGS+=(--ref "$REF")
fi

gh workflow run deploy-aws.yml "${ARGS[@]}"
