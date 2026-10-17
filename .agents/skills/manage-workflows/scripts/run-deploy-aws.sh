#!/usr/bin/env bash
set -euo pipefail

if ! command -v gh &>/dev/null; then
  echo "Error: gh CLI is required but not installed." >&2
  exit 1
fi

ACTION="${1:-apply}"
IMAGE_TAG="${2:-}"
REF="${3:-}"

echo "Dispatching 'Deploy Personal Site - AWS (Terraform)' (deploy-aws.yml)..."
echo "  Action:    $ACTION"
if [ -n "$IMAGE_TAG" ]; then
  echo "  Image Tag: $IMAGE_TAG"
fi

ARGS=(-f "action=$ACTION")
if [ -n "$IMAGE_TAG" ]; then
  ARGS+=(-f "image_tag=$IMAGE_TAG")
fi
if [ -n "$REF" ]; then
  ARGS+=(--ref "$REF")
fi

gh workflow run deploy-aws.yml "${ARGS[@]}"
