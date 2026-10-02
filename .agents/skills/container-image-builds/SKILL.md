---
name: container-image-builds
description: Use this skill to understand how container images are built, pushed, scanned, and attested for the PersonalWebsite repository.
---

## Container Image Builds

Container image builds, SBOM generation, and security scan attestations are fully automated using **GitHub Actions workflows**.

### Workflows

1. **Build & Push:**
   - **Location:** `.github/workflows/build-and-push.yaml`
   - **Triggers:** Pushes to `main` or `master` branches, or manually via `workflow_dispatch`.
   - **Runs on:** `personal-site-runner` (local Actions Runner Controller scale set)
   - **Process:**
     1. Authenticates to Quay container registry (`quay.kubesoar.com`) using `QUAY_USERNAME` and `QUAY_PASSWORD` secrets.
     2. Builds the container image using Podman and the repository's `Containerfile`.
     3. Tags the image with the git commit SHA and short SHA.
     4. If running on `main` or `master`, it also tags the image as `latest`.
     5. Pushes the built image(s) to `quay.kubesoar.com/<user>/personalwebsite`.

2. **SBOM Generation & Attestation:**
   - **Location:** `.github/workflows/container-sbom.yaml`
   - **Triggers:** Automatically runs after `Container Image - Build & Push` completion or manually via `workflow_dispatch`.
   - **Process:** Generates an SPDX Software Bill of Materials (SBOM) for the built container image tag using Anchore Syft (`anchore/sbom-action`), creates signed GitHub artifact attestations (`actions/attest-sbom`), and uploads the SBOM artifact.

3. **Security Scan & Attestation:**
   - **Location:** `.github/workflows/container-scan-attestation.yaml`
   - **Triggers:** Automatically runs after `Container Image - Build & Push` completion or manually via `workflow_dispatch`.
   - **Process:** Scans the pushed container image for vulnerabilities using Anchore Grype (`anchore/scan-action`), publishes results to GitHub Security (SARIF), creates signed in-toto vulnerability scan attestations (`actions/attest`), and uploads the scan report artifact.

Do not attempt to build and push production container images manually from a local machine; let the GitHub Action handle it.


