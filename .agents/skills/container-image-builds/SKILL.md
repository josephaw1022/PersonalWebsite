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
   - **Jobs:**
     1. **`build`:** Authenticates to Quay registry, builds the Next.js application & container image with Podman, tags with commit SHA/short SHA/latest, pushes image(s) to `quay.kubesoar.com/<user>/personalwebsite`, and passes image details & digest to downstream jobs.
     2. **`scan`:** Uses `.github/actions/container-scan-attestation` to scan the pushed image for vulnerabilities with Grype, publish SARIF to GitHub Security, upload reports, and create in-toto vulnerability attestations.
     3. **`sbom`:** Uses `.github/actions/container-sbom-attestation` to generate an SPDX SBOM with Syft, create artifact attestations, and upload SBOM artifacts.

2. **Actions:**
   - **Container Scan & Attestation:** `.github/actions/container-scan-attestation/action.yml`
   - **Container SBOM & Attestation:** `.github/actions/container-sbom-attestation/action.yml`

Do not attempt to build and push production container images manually from a local machine; let the GitHub Action handle it.
