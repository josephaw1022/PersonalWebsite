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
helm upgrade --install "${CONTROLLER_RELEASE}" \
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
helm upgrade --install "${RUNNER_RELEASE}" \
  --namespace "${RUNNER_NS}" \
  oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set \
  -f - <<EOF
githubConfigUrl: "${GITHUB_CONFIG_URL}"
githubConfigSecret: "${SECRET_NAME}"
minRunners: 1
# Applies to chart-managed resources wherever the Helm template allows OpenShift-safe extras (part-of/name/instance stay chart-owned on AutoscalingRunnerSet).
annotations:
  app.openshift.io/vcs-uri: "${GITHUB_CONFIG_URL}"
  app.openshift.io/vcs-ref: main
labels:
  app.openshift.io/runtime: github
# Scale set chart searches for the controller in-cluster; set explicitly when controller runs in another namespace.
controllerServiceAccount:
  namespace: "${CONTROLLER_NS}"
  name: "${CONTROLLER_SA_NAME}"
resourceMeta:
  autoscalingRunnerSet:
    annotations:
      app.openshift.io/vcs-uri: "${GITHUB_CONFIG_URL}"
      app.openshift.io/vcs-ref: main
# Propagate OpenShift Dev Console labels to EphemeralRunner* objects (chart reserves app.kubernetes.io/part-of on AutoscalingRunnerSet only).
  ephemeralRunnerSet:
    labels:
      app.kubernetes.io/part-of: personal-website-app
      app.kubernetes.io/name: github-actions-runner
      app.kubernetes.io/component: ci
      app.openshift.io/runtime: github
  ephemeralRunner:
    labels:
      app.kubernetes.io/part-of: personal-website-app
      app.kubernetes.io/name: github-actions-runner
      app.kubernetes.io/component: ci
      app.openshift.io/runtime: github
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

# Developer Topology renders standard Services reliably; ARC AutoscalingRunnerSet CRDs are not workload nodes there.
# A headless Service matching runner pod labels gives `app.openshift.io/connects-to: '["personal-site-runner"]'` a visible target keyed by app.kubernetes.io/instance.
echo "==> Applying headless Service so OpenShift Topology can represent the ARC runner scale set as a grouped component..."
kubectl apply -f - <<EOF
apiVersion: v1
kind: Service
metadata:
  name: ${RUNNER_RELEASE}-topology
  namespace: ${RUNNER_NS}
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
  clusterIP: None
  sessionAffinity: None
  ports:
    - name: noop
      port: 9443
      protocol: TCP
      targetPort: 9443
  selector:
    app.kubernetes.io/part-of: personal-website-app
    app.kubernetes.io/name: github-actions-runner
    app.kubernetes.io/component: ci
    app.kubernetes.io/instance: ${RUNNER_RELEASE}
EOF

echo "==> ARC Setup Complete!"
