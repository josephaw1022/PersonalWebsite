---
name: prettier-formatting
description: Ensure codebase is formatted with Prettier before submitting a PR.
---

# Prettier Formatting

Before submitting a pull request, you MUST ensure that the codebase is correctly formatted using Prettier via the repository's Taskfile targets. Do not run `prettier` or `npm run format` directly.

## Formatting Commands

- **Format all files:** `task format`
- **Check formatting:** `task format:check`
- **Format codebase and Terraform configs:** `task format:all`

## Git Worktrees & `node_modules`

All formatting (and other Node.js) tasks in `Taskfile.yaml` depend on an internal `ensure-deps` task. When running in a new Git worktree where `node_modules` is not yet present, `task format` and `task format:check` (as well as the `format-repo` PostToolUse hook) automatically symlink `node_modules` from the main repository checkout—or run `npm ci` if no main repository `node_modules` exists—so Prettier works out of the box in every worktree.

## Workflow

1. After completing your changes, run `task format` (or `task format:all` if Terraform files were also modified).
2. Verify that all files match the project's style guidelines using `task format:check`.
3. Include the formatted changes in your commit.
