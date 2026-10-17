#!/usr/bin/env bash

# Antigravity Lifecycle Hook: enforce-taskfile
# Event: PreToolUse
# Description: Prevents direct CLI invocation of tools (terraform, prettier, eslint, jest, playwright, helm, next)
#              and steers the agent to use Taskfile targets instead.

set -e

# 1. Read JSON input from stdin
HOOK_INPUT=$(cat)

# 2. Extract tool name and command line using jq
TOOL_NAME=$(echo "$HOOK_INPUT" | jq -r '.toolCall.name // .tool_name // empty')

# Only process run_command tool calls
if [ "$TOOL_NAME" != "run_command" ]; then
    echo '{"decision": "allow"}'
    exit 0
fi

COMMAND_LINE=$(echo "$HOOK_INPUT" | jq -r '.toolCall.args.CommandLine // .toolCall.args.command // empty')

if [ -z "$COMMAND_LINE" ]; then
    echo '{"decision": "allow"}'
    exit 0
fi

# Whitelist git and gh CLI operations (e.g., git commit messages or gh pr commands mentioning tools)
if [[ "$COMMAND_LINE" =~ ^[[:space:]]*(git|gh)[[:space:]] ]]; then
    echo '{"decision": "allow"}'
    exit 0
fi

# If the command starts directly with task, allow it
if [[ "$COMMAND_LINE" =~ ^[[:space:]]*task([[:space:]]|$) ]]; then
    echo '{"decision": "allow"}'
    exit 0
fi

# Function to deny with a steer message
deny_with_reason() {
    local reason="$1"
    echo "[hook:enforce-taskfile] Denied command: $COMMAND_LINE" >&2
    jq -n --arg r "$reason" '{"decision": "deny", "reason": $r}'
    exit 0
}

# 1. Terraform commands (except pure version checks)
if [[ "$COMMAND_LINE" =~ (^|[;&|[:space:]])terraform([[:space:]]|$) && ! "$COMMAND_LINE" =~ ^[[:space:]]*terraform[[:space:]]+(-v|--version|version)[[:space:]]*$ ]]; then
    deny_with_reason "Direct execution of 'terraform' CLI is prevented. Use the Taskfile targets instead:
- 'task tf:fmt' or 'task tf:fmt:check' (format / check formatting)
- 'task tf:init' (initialize providers)
- 'task tf:validate' (validate configuration syntax)
- 'task tf:plan' (generate execution plan)
- 'task tf:check' (format check + validate)
Or from within the terraform directory: 'task fmt', 'task validate', 'task plan', 'task check'."
fi

# 2. Prettier formatting
if [[ "$COMMAND_LINE" =~ (^|[;&|[:space:]])(npx[[:space:]]+)?prettier([[:space:]]|$) || "$COMMAND_LINE" =~ (^|[;&|[:space:]])npm[[:space:]]+run[[:space:]]+format(:check)?([[:space:]]|$) ]]; then
    deny_with_reason "Direct execution of Prettier is prevented. Use the Taskfile targets instead:
- 'task format' (format codebase with Prettier)
- 'task format:check' (check code formatting)
- 'task format:all' (format codebase with Prettier and Terraform configurations)"
fi

# 3. ESLint / Linter
if [[ "$COMMAND_LINE" =~ (^|[;&|[:space:]])(npx[[:space:]]+)?eslint([[:space:]]|$) || "$COMMAND_LINE" =~ (^|[;&|[:space:]])npm[[:space:]]+run[[:space:]]+lint([[:space:]]|$) ]]; then
    deny_with_reason "Direct execution of ESLint is prevented. Use the Taskfile targets instead:
- 'task lint' (run ESLint)
- 'task lint:fix' (run ESLint with automatic fixes)"
fi

# 4. Jest unit tests
if [[ "$COMMAND_LINE" =~ (^|[;&|[:space:]])(npx[[:space:]]+)?jest([[:space:]]|$) || "$COMMAND_LINE" =~ (^|[;&|[:space:]])npm[[:space:]]+(run[[:space:]]+)?test(:watch)?([[:space:]]|$) ]]; then
    deny_with_reason "Direct execution of Jest tests is prevented. Use the Taskfile targets instead:
- 'task test' (run Jest unit tests)
- 'task test:all' (run all unit and E2E tests)"
fi

# 5. Playwright E2E tests
if [[ "$COMMAND_LINE" =~ (^|[;&|[:space:]])(npx[[:space:]]+)?playwright([[:space:]]|$) || "$COMMAND_LINE" =~ (^|[;&|[:space:]])npm[[:space:]]+run[[:space:]]+test:e2e([[:space:]]|$) ]]; then
    deny_with_reason "Direct execution of Playwright is prevented. Use the Taskfile targets instead:
- 'task test:e2e' (run Playwright E2E tests)
- 'task test:all' (run all unit and E2E tests)"
fi

# 6. Helm commands
if [[ "$COMMAND_LINE" =~ (^|[;&|[:space:]])helm[[:space:]]+(lint|unittest)([[:space:]]|$) ]]; then
    deny_with_reason "Direct execution of Helm lint/unittest is prevented. Use the Taskfile targets instead:
- 'task helm:lint' (lint Helm charts)
- 'task helm:test' (run Helm unit tests)"
fi

# 7. Next.js build / dev
if [[ "$COMMAND_LINE" =~ (^|[;&|[:space:]])npm[[:space:]]+run[[:space:]]+build([[:space:]]|$) || "$COMMAND_LINE" =~ (^|[;&|[:space:]])next[[:space:]]+build([[:space:]]|$) ]]; then
    deny_with_reason "Direct execution of Next.js build is prevented. Use the Taskfile targets instead:
- 'task build' (build Next.js production bundle)
- 'task build-container' (build container image with Podman)"
fi

if [[ "$COMMAND_LINE" =~ (^|[;&|[:space:]])npm[[:space:]]+run[[:space:]]+dev([[:space:]]|$) || "$COMMAND_LINE" =~ (^|[;&|[:space:]])next[[:space:]]+dev([[:space:]]|$) ]]; then
    deny_with_reason "Direct execution of Next.js dev server is prevented. Use 'task dev' instead."
fi

# Default allow for all other commands
echo '{"decision": "allow"}'
