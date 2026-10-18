---
name: testing-standards
description: Update and run unit and E2E tests after making changes to the site.
---

# Testing Standards

After making any changes to the site content, structure, or design, you MUST update and run both unit and end-to-end (E2E) tests using the repository's Taskfile targets to ensure no regressions were introduced. Do not invoke `jest`, `playwright`, `npm test`, or `npx` test commands directly.

## Test Commands

### Unit Tests (Jest)
- **Run unit tests:** `task test`

### E2E Tests (Playwright)
- **Run E2E tests:** `task test:e2e`
- **Install Playwright browser binaries:** `task playwright:install`
- **Capture UI screenshots across light/dark modes:** `task screenshots`

### Combined & Quality Checks
- **Run all unit and E2E tests:** `task test:all`
- **Run pre-PR checks (format check, lint, unit tests, build, Terraform check):** `task pr:check`
- **Run all repository quality checks:** `task check`

## Workflow

1. **Identify Impact:** Determine if your changes affect individual components (unit tests) or user flows (E2E tests).
2. **Update Tests:**
   - Update unit tests in `__tests__/` or adjacent to components.
   - Update E2E tests in the `e2e/` directory.
3. **Execute Tests:** Run `task test` and `task test:e2e` (or `task test:all`) and ensure all tests pass.
4. **Fix Failures:** If any tests fail, investigate whether it's a bug in the site or if the tests themselves need updating.

