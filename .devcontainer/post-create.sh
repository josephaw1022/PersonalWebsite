#!/usr/bin/env bash
set -euo pipefail

echo "==> Installing Node.js dependencies..."
npm install

echo "==> Installing Helm unittest plugin..."
if command -v helm >/dev/null 2>&1; then
    helm plugin install https://github.com/helm-unittest/helm-unittest.git 2>/dev/null || true
fi

echo "==> Dev container setup complete!"
