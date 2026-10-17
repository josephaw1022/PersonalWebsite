---
trigger: glob
globs: ".nvmrc, .devcontainer/devcontainer.json, .github/workflows/*.yaml, .github/workflows/*.yml, package.json, Containerfile"
description: "Guidelines to keep .nvmrc, GitHub Actions workflows, devcontainer configuration, package.json, and Containerfile synchronized with the Node.js version."
---

# Node.js Version Synchronization

This repository standardizes on Node.js 26 (active LTS). Whenever the Node.js runtime version is updated or referenced, the following files MUST be kept strictly in sync:

1. **`.nvmrc`**:
   - The repository root `.nvmrc` must specify the target major Node.js version (e.g., `26`).
2. **GitHub Actions Workflows (`.github/workflows/*.yaml`, `*.yml`)**:
   - All workflow jobs utilizing `actions/setup-node` must configure `node-version: "26"` to match `.nvmrc`.
3. **Dev Container Configuration (`.devcontainer/devcontainer.json`)**:
   - The dev container image tag must specify the corresponding TypeScript Node.js version (e.g., `"image": "mcr.microsoft.com/devcontainers/typescript-node:26"`).
4. **Package Configuration (`package.json`)**:
   - The `engines.node` field must require the appropriate Node.js runtime (e.g., `">=26"`).
   - `@types/node` under `devDependencies` should align with the runtime major version (`^26`).
5. **Containerfile (`Containerfile`)**:
   - The production container base image must specify the corresponding Node.js version using Red Hat's Node.js Hardened Image (HI) (e.g., `FROM registry.access.redhat.com/hi/nodejs:26.11 AS runner`).

## Verification Checklist

When updating the Node.js runtime version:

- Run `npm test` and `npm run build` to confirm test suite and Next.js production builds succeed.
- Run `npm run lint` and `npm run format:check` to ensure code styling and lint rules pass.
- Verify all CI workflow definitions in `.github/workflows/` match the target Node.js version.
- Verify the `Containerfile` base image matches the target Node.js version and can be built via `task build-container` (or `podman build -t personal-site -f Containerfile .`).
