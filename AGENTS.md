# Personal Website

This repository contains a modern, multi-page Next.js App Router application.
It is containerized using a multi-stage Node.js build (Next.js standalone) and hosted on a homelab OpenShift cluster.
Secure external access is provided via a Cloudflare Tunnel.

**Deployment**:
CI/CD runners on the cluster are configured via `./infra/arc-setup.sh`. Initial cluster workloads (deployment, service, image pull secret, dev ingress, pdb) are packaged via Helm (`charts/personal-site`) and bootstrapped via the GitHub Actions `Cluster Infrastructure - Bootstrap` workflow (`.github/workflows/bootstrap-cluster.yml`). Ongoing deployments to the dev environment (`personal-site-dev-envs`) are automated via `.github/workflows/deploy-dev.yml`, and production deployments (`personal-site`) are triggered via `.github/workflows/deploy-prod.yml`. Helm chart unit tests are executed using `helm-unittest`.

**Development**:

- Local Development: `task dev`
- Build Container Image: `task build-container`

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
