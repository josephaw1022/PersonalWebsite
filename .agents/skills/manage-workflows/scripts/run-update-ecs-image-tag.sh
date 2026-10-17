#!/usr/bin/env bash
set -euo pipefail

if ! command -v gh &>/dev/null; then
  echo "Error: gh CLI is required but not installed." >&2
  exit 1
fi

IMAGE_TAG="${1:-}"
REF="${2:-}"

echo "Dispatching 'Deploy Personal Site - Update ECS Image Tag' (update-ecs-image-tag.yml)..."
if [ -n "$IMAGE_TAG" ]; then
  echo "  Image Tag: $IMAGE_TAG"
fi

ARGS=()
if [ -n "$IMAGE_TAG" ]; then
  ARGS+=(-f "image_tag=$IMAGE_TAG")
fi
if [ -n "$REF" ]; then
  ARGS+=(--ref "$REF")
fi

gh workflow run update-ecs-image-tag.yml "${ARGS[@]}"
