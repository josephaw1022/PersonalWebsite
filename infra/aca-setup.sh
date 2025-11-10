#!/usr/bin/env bash
set -euo pipefail


## Just running this script locally for the sake of simplicity and getting this site up in one sitting.
## In a real-world scenario, this would be part of a more robust CI/CD pipeline or be done via IaC tools.


# ==== CONFIG ====
RG="personal-site"
LOCATION="eastus"
ENV_NAME="personal-site"
APP_NAME="website"
IMAGE="ghcr.io/josephaw1022/personalwebsite:latest"
PORT="80"
INGRESS="external"
CPU="0.5"
MEMORY="1Gi"
GHCR_SERVER="ghcr.io"
# =================

az config set extension.use_dynamic_install=yes_without_prompt >/dev/null
az extension add -n containerapp --upgrade >/dev/null || true

if [[ "${1:-}" == "--teardown" ]]; then
  if az group exists --name "$RG" | grep -q true; then
    echo "Deleting resource group: $RG"
    az group delete --name "$RG" --yes --no-wait
    echo "Delete initiated."
  else
    echo "Resource group '$RG' not found; nothing to delete."
  fi
  exit 0
fi

# Resource Group
if az group exists --name "$RG" | grep -q true; then
  echo "Resource group '$RG' exists."
else
  echo "Creating resource group '$RG' in '$LOCATION'..."
  az group create --name "$RG" --location "$LOCATION" >/dev/null
fi

# Container Apps Environment
if az containerapp env show -g "$RG" -n "$ENV_NAME" >/dev/null 2>&1; then
  echo "Environment '$ENV_NAME' exists."
else
  echo "Creating environment '$ENV_NAME'..."
  az containerapp env create \
    --name "$ENV_NAME" \
    --resource-group "$RG" \
    --location "$LOCATION" \
    --logs-destination none \
    >/dev/null
fi

# Container App
if az containerapp show -g "$RG" -n "$APP_NAME" >/dev/null 2>&1; then
  echo "Updating app '$APP_NAME'..."
  az containerapp update \
    --name "$APP_NAME" \
    --resource-group "$RG" \
    --image "$IMAGE" \
    >/dev/null

  # ensure ingress matches desired state
  # if ingress not enabled yet, enable it
  if ! az containerapp show -g "$RG" -n "$APP_NAME" --query "properties.configuration.ingress" -o tsv >/dev/null 2>&1; then
    az containerapp ingress enable \
      --name "$APP_NAME" \
      --resource-group "$RG" \
      --type "$INGRESS" \
      --target-port "$PORT" \
      >/dev/null
  fi
else
  echo "Creating app '$APP_NAME'..."

  echo -n "Enter your GHCR username: "
  read GHCR_USERNAME
  echo -n "Enter your GHCR token: "
  read GHCR_TOKEN

  az containerapp create \
    --name "$APP_NAME" \
    --resource-group "$RG" \
    --environment "$ENV_NAME" \
    --image "$IMAGE" \
    --ingress "$INGRESS" \
    --target-port "$PORT" \
    --cpu "$CPU" \
    --memory "$MEMORY" \
    --registry-server "$GHCR_SERVER" \
    --registry-username "$GHCR_USERNAME" \
    --registry-password "$GHCR_TOKEN" \
    >/dev/null
fi


if [[ "$INGRESS" == "external" ]]; then
  FQDN=$(az containerapp show -g "$RG" -n "$APP_NAME" --query properties.configuration.ingress.fqdn -o tsv)
  echo "App URL: https://${FQDN}"
else
  echo "App '$APP_NAME' deployed with '$INGRESS' ingress."
fi

echo "Done."
