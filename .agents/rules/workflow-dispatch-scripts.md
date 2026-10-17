---
trigger: glob
globs: ".github/workflows/*.yaml, .github/workflows/*.yml"
description: "Requires creating a corresponding runner script in the manage-workflows skill for every GitHub Actions workflow with manual dispatch support."
---

# Workflow Dispatch Runner Scripts

Whenever a new GitHub Actions workflow is created (or an existing workflow is updated to support `workflow_dispatch`), a corresponding script to trigger and run the workflow must be created in the `manage-workflows` skill.

## Requirements

1. **Script Location**: All workflow runner scripts must reside in `.agents/skills/manage-workflows/scripts/`.
2. **Naming Convention**: Runner scripts must follow the naming pattern `run-<workflow-name>.sh` (for example, `run-deploy-aws.sh` for `deploy-aws.yml`, `run-build-and-push-ghcr.sh` for `build-and-push-ghcr.yaml`).
3. **CLI Tooling**: Scripts must be executable shell scripts (`chmod +x`) utilizing the GitHub CLI (`gh workflow run <filename>`).
4. **Workflow Inputs**: If the target workflow defines `workflow_dispatch.inputs`, the script must provide reasonable defaults and accept arguments to customize input values.
5. **Ref Support**: Scripts must support specifying an optional git reference or branch name to dispatch against.
6. **Skill Documentation**: All dispatch scripts must be documented in `.agents/skills/manage-workflows/SKILL.md` with instructions on parameter usage.
