# Personal Website

This repository contains a modern, multi-page Next.js App Router application.
It is containerized using a multi-stage Node.js build (Next.js standalone) and hosted on a homelab OpenShift cluster.
Secure external access is provided via a Cloudflare Tunnel.

**Deployment**:
The site is deployed via `./infra/okd-setup.sh` and uses a NetworkPolicy to restrict traffic to the cloudflared connector.

**Development**:

- Local Development: `task dev`
- Build Container Image: `task build-container`
