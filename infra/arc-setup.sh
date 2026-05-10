#!/bin/bash
set -eo pipefail

usage() {
  echo "Usage: $0 --app-id <APP_ID> --installation-id <INSTALLATION_ID> --private-key-file <PRIVATE_KEY_FILE>"
  exit 1
}

GITHUB_APP_ID=""
GITHUB_APP_INSTALLATION_ID=""
GITHUB_APP_PRIVATE_KEY_FILE=""

while [[ "$#" -gt 0 ]]; do
  case $1 in
    --app-id) GITHUB_APP_ID="$2"; shift ;;
    --installation-id) GITHUB_APP_INSTALLATION_ID="$2"; shift ;;
    --private-key-file) GITHUB_APP_PRIVATE_KEY_FILE="$2"; shift ;;
    *) echo "Unknown parameter passed: $1"; usage ;;
  esac
  shift
done

if [[ -z "${GITHUB_APP_ID}" || -z "${GITHUB_APP_INSTALLATION_ID}" || -z "${GITHUB_APP_PRIVATE_KEY_FILE}" ]]; then
  echo "Error: --app-id, --installation-id, and --private-key-file are required."
  usage
fi

GITHUB_CONFIG_URL="https://github.com/josephaw1022/PersonalWebsite"
CONTROLLER_NS="github-arc"
RUNNER_NS="personal-site-pipelines"
TARGET_NS="personal-site"
SA_NAME="personal-site-runner-sa"
SECRET_NAME="personal-site-runner-secret"
GH_ENV_NAME="production"

echo "==> Checking if GitHub environment '${GH_ENV_NAME}' exists..."
if gh api -X GET "/repos/josephaw1022/PersonalWebsite/environments/${GH_ENV_NAME}" >/dev/null 2>&1; then
  echo "GitHub environment '${GH_ENV_NAME}' already exists. Skipping creation."
else
  echo "==> Creating GitHub environment '${GH_ENV_NAME}'..."
  gh api -X PUT "/repos/josephaw1022/PersonalWebsite/environments/${GH_ENV_NAME}" >/dev/null || {
    echo "Warning: Failed to create GitHub environment. Ensure you have 'gh' CLI authenticated with appropriate scopes."
  }
fi

echo "==> Creating namespaces..."
kubectl apply -f - <<EOF
apiVersion: v1
kind: Namespace
metadata:
  name: ${CONTROLLER_NS}
---
apiVersion: v1
kind: Namespace
metadata:
  name: ${RUNNER_NS}
EOF

echo "==> Setting up Helm repository for Actions Runner Controller..."
helm repo add actions-runner-controller https://actions-runner-controller.github.io/actions-runner-controller || true
# Modern charts are actually in OCI registry, so we don't need the repo add for the new ones, 
# but let's use the OCI registry directly.
# Helm OCI charts for ARC: oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set-controller
# and oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set

echo "==> Installing/Upgrading gha-runner-scale-set-controller..."
helm upgrade --install arc \
  --namespace "${CONTROLLER_NS}" \
  oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set-controller

echo "==> Creating ServiceAccount for the runner..."
kubectl apply -f - <<EOF
apiVersion: v1
kind: ServiceAccount
metadata:
  name: ${SA_NAME}
  namespace: ${RUNNER_NS}
EOF

echo "==> Creating RoleBinding for the runner ServiceAccount in the target namespace..."
kubectl apply -f - <<EOF
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: runner-admin-binding
  namespace: ${TARGET_NS}
subjects:
- kind: ServiceAccount
  name: ${SA_NAME}
  namespace: ${RUNNER_NS}
roleRef:
  kind: ClusterRole
  name: admin
  apiGroup: rbac.authorization.k8s.io
EOF

echo "==> Creating secret for GitHub App Authentication..."
kubectl create secret generic "${SECRET_NAME}" \
  --namespace "${RUNNER_NS}" \
  --from-literal=github_app_id="${GITHUB_APP_ID}" \
  --from-literal=github_app_installation_id="${GITHUB_APP_INSTALLATION_ID}" \
  --from-file=github_app_private_key="${GITHUB_APP_PRIVATE_KEY_FILE}" \
  --dry-run=client -o yaml | kubectl apply -f -

echo "==> Installing/Upgrading gha-runner-scale-set..."
helm upgrade --install personal-site-runner \
  --namespace "${RUNNER_NS}" \
  oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set \
  --set githubConfigUrl="${GITHUB_CONFIG_URL}" \
  --set githubConfigSecret="${SECRET_NAME}" \
  --set template.spec.serviceAccountName="${SA_NAME}"

echo "==> ARC Setup Complete!"
