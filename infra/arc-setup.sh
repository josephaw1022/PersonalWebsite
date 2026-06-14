#!/bin/bash
set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
ENV_FILE="${REPO_ROOT}/.env"

usage() {
  echo "Usage: $0 [--app-id <APP_ID>] [--installation-id <INSTALLATION_ID>] [--private-key-file <PRIVATE_KEY_FILE>]"
  echo ""
  echo "Flags are optional when ${ENV_FILE} defines:"
  echo "  GITHUB_APP_ID, GITHUB_APP_INSTALLATION_ID, GITHUB_APP_PRIVATE_KEY_FILE"
  echo ""
  echo "CLI flags override values from .env."
  exit 1
}

load_env_file() {
  if [[ ! -f "${ENV_FILE}" ]]; then
    return 0
  fi

  echo "==> Loading defaults from ${ENV_FILE}..."
  set -a
  # shellcheck disable=SC1090
  source "${ENV_FILE}"
  set +a
}

GITHUB_APP_ID=""
GITHUB_APP_INSTALLATION_ID=""
GITHUB_APP_PRIVATE_KEY_FILE=""

load_env_file
GITHUB_APP_ID="${GITHUB_APP_ID:-}"
GITHUB_APP_INSTALLATION_ID="${GITHUB_APP_INSTALLATION_ID:-}"
GITHUB_APP_PRIVATE_KEY_FILE="${GITHUB_APP_PRIVATE_KEY_FILE:-}"

while [[ "$#" -gt 0 ]]; do
  case $1 in
    --app-id) GITHUB_APP_ID="$2"; shift ;;
    --installation-id) GITHUB_APP_INSTALLATION_ID="$2"; shift ;;
    --private-key-file) GITHUB_APP_PRIVATE_KEY_FILE="$2"; shift ;;
    -h|--help) usage ;;
    *) echo "Unknown parameter passed: $1"; usage ;;
  esac
  shift
done

if [[ -z "${GITHUB_APP_ID}" || -z "${GITHUB_APP_INSTALLATION_ID}" || -z "${GITHUB_APP_PRIVATE_KEY_FILE}" ]]; then
  echo "Error: GITHUB_APP_ID, GITHUB_APP_INSTALLATION_ID, and GITHUB_APP_PRIVATE_KEY_FILE are required."
  echo "Set them in ${ENV_FILE} or pass --app-id, --installation-id, and --private-key-file."
  usage
fi

if [[ ! -f "${GITHUB_APP_PRIVATE_KEY_FILE}" ]]; then
  echo "Error: Private key file not found: ${GITHUB_APP_PRIVATE_KEY_FILE}"
  exit 1
fi

GITHUB_CONFIG_URL="https://github.com/josephaw1022/PersonalWebsite"
KUBE_CONTEXT="${KUBE_CONTEXT:-admin}"
KUBECTL=(kubectl --context "${KUBE_CONTEXT}")
HELM=(helm --kube-context "${KUBE_CONTEXT}")
CONTROLLER_NS="github-arc"
# Must match the Helm release name for gha-runner-scale-set-controller (see helm upgrade --install below).
CONTROLLER_RELEASE="arc"
CONTROLLER_SA_NAME="${CONTROLLER_RELEASE}-gha-rs-controller"
RUNNER_NS="personal-site"
TARGET_NS="personal-site"
RUNNER_RELEASE="personal-site-runner"
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
"${KUBECTL[@]}" apply -f - <<EOF
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
"${HELM[@]}" upgrade --install "${CONTROLLER_RELEASE}" \
  --namespace "${CONTROLLER_NS}" \
  oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set-controller

echo "==> Cleaning up existing runner scale set (forces fresh GitHub registration)..."
if "${HELM[@]}" status "${RUNNER_RELEASE}" -n "${RUNNER_NS}" >/dev/null 2>&1; then
  "${HELM[@]}" uninstall "${RUNNER_RELEASE}" -n "${RUNNER_NS}" --wait --timeout 5m || true
fi
# Stale runner-scale-set-id annotations survive helm upgrade and break listener/runner registration.
"${KUBECTL[@]}" delete autoscalingrunnersets,ephemeralrunnersets,ephemeralrunners \
  -n "${RUNNER_NS}" --all --ignore-not-found --wait --timeout 3m || true
"${KUBECTL[@]}" delete autoscalinglisteners \
  -n "${CONTROLLER_NS}" \
  -l "actions.github.com/scale-set-namespace=${RUNNER_NS}" \
  --ignore-not-found --wait --timeout 3m || true

echo "==> Creating ServiceAccount for the runner..."
"${KUBECTL[@]}" apply -f - <<EOF
apiVersion: v1
kind: ServiceAccount
metadata:
  name: ${SA_NAME}
  namespace: ${RUNNER_NS}
EOF

echo "==> Creating RoleBinding for the runner ServiceAccount in the target namespace..."
"${KUBECTL[@]}" apply -f - <<EOF
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
"${KUBECTL[@]}" create secret generic "${SECRET_NAME}" \
  --namespace "${RUNNER_NS}" \
  --from-literal=github_app_id="${GITHUB_APP_ID}" \
  --from-literal=github_app_installation_id="${GITHUB_APP_INSTALLATION_ID}" \
  --from-file=github_app_private_key="${GITHUB_APP_PRIVATE_KEY_FILE}" \
  --dry-run=client -o yaml | "${KUBECTL[@]}" apply -f -

echo "==> Granting anyuid SCC to runner ServiceAccount (required for actions-runner on OpenShift)..."
oc --context "${KUBE_CONTEXT}" adm policy add-scc-to-user anyuid \
  -z "${SA_NAME}" -n "${RUNNER_NS}" 2>/dev/null || true

echo "==> Installing/Upgrading gha-runner-scale-set..."
"${HELM[@]}" upgrade --install "${RUNNER_RELEASE}" \
  --namespace "${RUNNER_NS}" \
  oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set \
  -f - <<EOF
githubConfigUrl: "${GITHUB_CONFIG_URL}"
githubConfigSecret: "${SECRET_NAME}"
minRunners: 1
# Scale set chart searches for the controller in-cluster; set explicitly when controller runs in another namespace.
controllerServiceAccount:
  namespace: "${CONTROLLER_NS}"
  name: "${CONTROLLER_SA_NAME}"
# Propagate OpenShift Dev Console labels to EphemeralRunner* objects (chart reserves app.kubernetes.io/part-of on AutoscalingRunnerSet only).
# Non-empty annotations are required on these blocks: ARC 0.14.x mergeAnnotations(nil, ...) panics ("assignment to entry in nil map")
# when metadata exists with labels only (Helm omits annotations:), breaking createEphemeralRunnerSet.
resourceMeta:
  ephemeralRunnerSet:
    labels:
      app.kubernetes.io/part-of: personal-website-app
      app.kubernetes.io/name: github-actions-runner
      app.kubernetes.io/component: ci
      app.openshift.io/runtime: github
    annotations:
      personal-website.io/arc-managed: "true"
  ephemeralRunner:
    labels:
      app.kubernetes.io/part-of: personal-website-app
      app.kubernetes.io/name: github-actions-runner
      app.kubernetes.io/component: ci
      app.openshift.io/runtime: github
    annotations:
      personal-website.io/arc-managed: "true"
template:
  metadata:
    labels:
      app.kubernetes.io/part-of: personal-website-app
      app.kubernetes.io/name: github-actions-runner
      app.kubernetes.io/component: ci
      app.kubernetes.io/instance: ${RUNNER_RELEASE}
      app.openshift.io/runtime: github
    annotations:
      app.openshift.io/vcs-uri: "${GITHUB_CONFIG_URL}"
      app.openshift.io/vcs-ref: main
  spec:
    serviceAccountName: "${SA_NAME}"
EOF

echo "==> ARC Setup Complete!"
