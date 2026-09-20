# Personal Website

This repository contains a modern, multi-page Next.js App Router application.
It is containerized using a multi-stage Node.js build (Next.js standalone) and hosted on a homelab OpenShift cluster.
Secure external access is provided via a Cloudflare Tunnel.

**Deployment**:
CI/CD runners on the cluster are configured via `./infra/arc-setup.sh`. Initial cluster workloads (deployment, service, image pull secret, dev ingress) are bootstrapped via the GitHub Actions `Bootstrap Cluster Infrastructure` workflow (`.github/workflows/bootstrap-cluster.yml`). Ongoing deployments to the dev environment (`personal-site-dev-envs`) are automated via `.github/workflows/deploy-dev.yml`, and production deployments (`personal-site`) are triggered via `.github/workflows/deploy-prod.yml`.

**Development**:

- Local Development: `task dev`
- Build Container Image: `task build-container`
