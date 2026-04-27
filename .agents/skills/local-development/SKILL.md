---
name: local-development
description: Use this skill to understand how to perform local development, running, and testing for the PersonalWebsite repository.
---

## Local Development Instructions

For local development in this repository, use `task` (Taskfile).

### Tasks Available:

- `task dev`: Runs the NGINX development container with live volume mounts using Podman. This mounts `./site/pages` and `./site/nginx.conf` directly into the container so that edits are reflected without rebuilding. The site will be available on port `8080`.
- `task stop`: Stops and removes the development container.
- `task default`: Lists all available tasks.

### Requirements
- You must have `task` (go-task) installed.
- You must use `podman` as the container runtime, as specified in the Taskfile.
