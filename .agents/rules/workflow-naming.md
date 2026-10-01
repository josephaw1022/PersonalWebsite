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

## Key Requirements

1. **Workflow Name**: The `name` field at the top level of the YAML workflow file must strictly adhere to the `<xyz> - <abc>` convention.
2. **`workflow_run` Consistency**: When triggering dependent workflows via `workflow_run`, the referenced workflow names in `workflows: [...]` must match the target workflow's configured name exactly.
