---
name: local-development
description: Use this skill to understand how to perform local development, running, and testing for the PersonalWebsite repository.
---

## Local Development Instructions

For all local development, building, linting, formatting, and testing in this repository, use `task` (Taskfile) rather than invoking CLI tools (`npm`, `npx`, `next`, `podman`, `helm`, `terraform`) directly.

### Discovering Available Tasks

To view all available tasks and their descriptions (including included taskfiles like `tf:*`), run:

```bash
task --list-all
```

### Requirements

- You must have `task` (go-task) installed.
- Container tasks use `podman` via the Taskfile targets.
