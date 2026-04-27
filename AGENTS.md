# Personal Website

This repository contains a simple static website served by NGINX.
It is containerized and hosted on a homelab OpenShift cluster.
Secure external access is provided via a Cloudflare Tunnel.

**Deployment**:
The site is deployed via `./infra/okd-setup.sh` and uses a NetworkPolicy to restrict traffic to the cloudflared connector.
