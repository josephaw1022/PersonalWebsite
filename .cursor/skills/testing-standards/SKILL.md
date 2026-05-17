---
name: testing-standards
description: Update and run unit and E2E tests after making changes to the site.
paths:
  - "src/**"
  - "e2e/**"
  - "__tests__/**"
  - "**/*.test.ts"
  - "**/*.spec.ts"
---

# Testing Standards

After making any changes to the site content, structure, or design, you MUST update and run both unit and end-to-end (E2E) tests to ensure no regressions were introduced.

## Test Commands

### Unit Tests (Jest)
- **Run all unit tests:** `npm test` (runs `jest`)
- **Run tests in watch mode:** `npm run test:watch`
- **Run specific test file:** `npx jest path/to/file.test.ts`

### E2E Tests (Playwright)
- **Run all E2E tests:** `npm run test:e2e` (runs `playwright test`)
- **Run specific E2E test file:** `npx playwright test e2e/filename.spec.ts`

## Workflow

1. **Identify Impact:** Determine if your changes affect individual components (unit tests) or user flows (E2E tests).
2. **Update Tests:** 
   - Update unit tests in `__tests__` or adjacent to components.
   - Update E2E tests in the `e2e/` directory.
3. **Execute Tests:** Run both `npm test` and `npm run test:e2e` and ensure all tests pass.
4. **Fix Failures:** If any tests fail, investigate whether it's a bug in the site or if the tests themselves need updating.

