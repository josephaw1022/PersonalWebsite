---
name: container-image-builds
description: Use this skill to understand how container images are built and pushed for the PersonalWebsite repository.
---

## Container Image Builds

Container image builds are fully automated using a **GitHub Actions workflow**.

### Implementation

- **Location:** `.github/workflows/build-and-push.yaml`
- **Triggers:** Pushes to `main` or `master` branches, or manually via `workflow_dispatch`.
- **Process:**
  1. Authenticates to GitHub Container Registry (GHCR) using `GITHUB_TOKEN`.
  2. Builds the container image using the repository's `Containerfile`.
  3. Tags the image with the git commit SHA.
  4. If running on `main` or `master`, it also tags the image as `latest`.
  5. Pushes the built image(s) to `ghcr.io/<owner>/<repo>`.

Do not attempt to build and push production container images manually from a local machine; let the GitHub Action handle it.
