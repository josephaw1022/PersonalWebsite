# Personal Website

This repository contains a modern, multi-page Next.js App Router application.
It is containerized using a multi-stage Node.js build (Next.js standalone) and hosted on a homelab OpenShift cluster.
Secure external access is provided via a Cloudflare Tunnel.

**Deployment**:
CI/CD runners on the cluster are configured via `./infra/arc-setup.sh`. Initial cluster workloads (deployment, service, image pull secret) are bootstrapped via the GitHub Actions `Bootstrap Cluster Infrastructure` workflow (`.github/workflows/bootstrap-cluster.yml`), and ongoing deployments are handled by the `Deploy Personal Site` workflow.

**Development**:

- Local Development: `task dev`
- Build Container Image: `task build-container`
