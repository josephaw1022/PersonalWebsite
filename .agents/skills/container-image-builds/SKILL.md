---
name: container-image-builds
description: Use this skill to understand how container images are built, pushed, scanned, and attested for the PersonalWebsite repository.
---

## Container Image Builds

Container image builds, SBOM generation, and security scan attestations are fully automated within the unified **Container Image - Build & Push** workflow using reusable composite actions.

### Workflow & Actions

1. **Build, Push, Scan & Attest Workflow:**
   - **Location:** `.github/workflows/build-and-push.yaml`
   - **Triggers:** Pushes to `main` or `master` branches, or manually via `workflow_dispatch`.
   - **Runs on:** `personal-site-runner` (local Actions Runner Controller scale set)
   - **Process:**
     1. Authenticates to Quay container registry (`quay.kubesoar.com`) using `QUAY_USERNAME` and `QUAY_PASSWORD` secrets.
     2. Builds the container image using Podman and the repository's `Containerfile`.
     3. Tags the image with the git commit SHA and short SHA.
     4. If running on `main` or `master`, tags the image as `latest`.
     5. Pushes the built image(s) to `quay.kubesoar.com/<user>/personalwebsite` and captures the image digest.
     6. Invokes `.github/actions/container-scan-attestation` with the resolved image and digest to scan for vulnerabilities with Grype, publish SARIF to GitHub Security, upload reports, and create in-toto vulnerability attestations.
     7. Invokes `.github/actions/container-sbom-attestation` to generate an SPDX SBOM with Syft, create artifact attestations, and upload SBOM artifacts.

2. **Actions:**
   - **Container Scan & Attestation:** `.github/actions/container-scan-attestation/action.yml`
   - **Container SBOM & Attestation:** `.github/actions/container-sbom-attestation/action.yml`

Do not attempt to build and push production container images manually from a local machine; let the GitHub Action handle it.
