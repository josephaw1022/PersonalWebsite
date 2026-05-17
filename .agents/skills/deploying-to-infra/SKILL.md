---
name: deploying-to-infra
description: Use this skill to understand how to deploy the PersonalWebsite application to infrastructure using OKD/OpenShift.
---

## Deploying to Infrastructure

The application is deployed to an OpenShift/OKD cluster using a setup script.

### Implementation

- **Main Deployment:** `./infra/okd-setup.sh`
- **GitHub Actions Runner Controller (ARC) Setup:** `./infra/arc-setup.sh`

#### OKD Setup Process (`okd-setup.sh`):

1. Creates or switches to the `personal-site` namespace/project using `oc new-project` / `oc project`.
2. Applies Kubernetes manifests defined in the script, including:
   - A Deployment (`personal-site`) with 3 replicas running the GHCR image.
   - A ConfigMap (`nginx-config`) containing the custom `default.conf` NGINX configuration.
   - A ClusterIP Service (`personal-site`) exposing port 80 (targetPort 8080).
3. The deployment uses specific volume mounts (`/var/cache/nginx`, `/var/run`) to allow running as non-root, which is required by OpenShift SCCs.

#### ARC Setup Process (`arc-setup.sh`):

1. Configures the GitHub Actions Runner Controller (ARC) on the cluster.
2. Requires `--app-id`, `--installation-id`, and `--private-key-file` arguments for GitHub App authentication.
3. Sets up namespaces (`github-arc`, `personal-site-pipelines`) and installs the controller and runner scale sets using Helm.

To deploy the main application, authenticate to your OKD cluster and run `bash infra/okd-setup.sh`. To set up CI/CD runners, run `bash infra/arc-setup.sh` with the required GitHub App credentials.
