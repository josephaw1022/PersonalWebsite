---
name: prettier-formatting
description: Ensure codebase is formatted with Prettier before submitting a PR.
paths:
  - "**/*.{js,jsx,ts,tsx,json,css,md}"
---

# Prettier Formatting

Before submitting a pull request, you MUST ensure that the codebase is correctly formatted using Prettier.

## Formatting Commands

- **Format all files:** `npm run format` (runs `prettier --write .`)
- **Check formatting:** `npm run format:check` (runs `prettier --check .`)

## Workflow

1. After completing your changes, run `npm run format`.
2. Verify that all files match the project's style guidelines.
3. Include the formatted changes in your commit.
