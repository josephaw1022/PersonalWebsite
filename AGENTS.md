# Personal Website

This repository contains a modern, multi-page Next.js App Router application.
It is containerized using a multi-stage Node.js build (Next.js standalone) and hosted on a homelab OpenShift cluster.
Secure external access is provided via a Cloudflare Tunnel.

**Deployment**:
The site is deployed via `./infra/okd-setup.sh` and uses a NetworkPolicy to restrict traffic to the cloudflared connector.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
