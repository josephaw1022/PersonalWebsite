---
globs: ".github/workflows/*.{yaml,yml}"
---

# GitHub Workflows Naming Convention

All GitHub Actions workflows must follow a consistent `<xyz> - <abc>` naming convention where `<xyz>` represents the noun, domain, or primary category and `<abc>` represents the verb, specific action, or deployment target.

## Format

```text
<Category / Domain> - <Action / Target>
```

- `<Category / Domain>`: The primary subject or scope of the workflow (e.g., `Deploy Personal Site`, `Container Image`, `Cluster Infrastructure`, `Pull Request`, `Dependabot`).
- `<Action / Target>`: The specific action, environment, or check being executed (e.g., `Development`, `Production`, `Build & Push`, `Bootstrap`, `Unit Tests`, `Auto-Merge`).

## Standard Workflow Naming Reference

| Workflow File                | Workflow Name                        | Description                                                     |
| :--------------------------- | :----------------------------------- | :-------------------------------------------------------------- |
| `deploy-dev.yml`             | `Deploy Personal Site - Development` | Continuous deployment to the development environment            |
| `deploy-prod.yml`            | `Deploy Personal Site - Production`  | Manual / gated deployment to production environment             |
| `build-and-push.yaml`        | `Container Image - Build & Push`     | Builds and pushes application container image to registry       |
| `bootstrap-cluster.yml`      | `Cluster Infrastructure - Bootstrap` | Bootstraps initial cluster workloads and configuration via Helm |
| `dependabot-auto-merge.yaml` | `Dependabot - Auto-Merge`            | Automatically merges approved Dependabot pull requests          |
| `pr-build.yaml`              | `Pull Request - Build Check`         | Validates Next.js build on PRs                                  |
| `pr-codeql.yaml`             | `Pull Request - CodeQL Scan`         | Runs CodeQL security analysis on PRs                            |
| `pr-e2e-tests.yaml`          | `Pull Request - E2E Tests`           | Executes Playwright end-to-end tests                            |
| `pr-format.yaml`             | `Pull Request - Format Check`        | Checks Prettier code formatting                                 |
| `pr-gitleaks.yaml`           | `Pull Request - GitLeaks Scan`       | Scans for secret leaks on PRs                                   |
| `pr-helm-tests.yaml`         | `Pull Request - Helm Chart Tests`    | Executes Helm chart unit tests                                  |
| `pr-trivy.yaml`              | `Pull Request - Trivy Security Scan` | Runs Trivy vulnerability scans on PRs                           |
| `pr-unit-tests.yaml`         | `Pull Request - Unit Tests`          | Runs Jest unit tests on PRs                                     |

## Key Requirements

1. **Workflow Name**: The `name` field at the top level of the YAML workflow file must strictly adhere to the `<xyz> - <abc>` convention.
2. **`workflow_run` Consistency**: When triggering dependent workflows via `workflow_run`, the referenced workflow names in `workflows: [...]` must match the target workflow's updated name exactly.
