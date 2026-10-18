---
name: local-development
description: Use this skill to understand how to perform local development, running, and testing for the PersonalWebsite repository.
---

## Local Development Instructions

For all local development, building, linting, formatting, and testing in this repository, use `task` (Taskfile) rather than invoking CLI tools (`npm`, `npx`, `next`, `podman`, `helm`, `terraform`) directly.

### Tasks Available

- `task dev`: Runs the Next.js local development server.
- `task build`: Builds the Next.js production bundle.
- `task build-container`: Builds the Next.js production container image using Podman.
- `task run-container`: Builds and runs the production container in the background on port `3000`.
- `task stop`: Stops and removes the running development container.
- `task test`: Runs Jest unit tests.
- `task test:e2e`: Runs Playwright end-to-end tests.
- `task test:all`: Runs all unit and E2E tests.
- `task lint` / `task lint:fix`: Runs ESLint (or ESLint with automatic fixes).
- `task format` / `task format:check` / `task format:all`: Formats or checks formatting with Prettier (and Terraform).
- `task pr:check`: Runs essential pre-PR checks (format check, lint, unit tests, Next.js build, and Terraform validation).
- `task check`: Runs all quality checks across the repository (including Helm and E2E tests).
- `task clean`: Cleans build artifacts and temporary test output.
- `task default`: Lists all available tasks.

### Requirements

- You must have `task` (go-task) installed.
- Container tasks use `podman` via the Taskfile targets.
