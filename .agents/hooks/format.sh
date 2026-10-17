#!/usr/bin/env bash

# Antigravity Lifecycle Hook: format-repo
# Event: PostToolUse
# Description: Automatically formats the repository using Prettier after file-modifying tools.

set -e

# 1. Consume the JSON input from stdin
HOOK_INPUT=$(cat)

# 2. Extract context using jq
TOOL_NAME=$(echo "$HOOK_INPUT" | jq -r '.toolCall.name // .tool_name // "unknown"')
WORKSPACE_PATH=$(echo "$HOOK_INPUT" | jq -r '.workspacePaths[0] // empty')

# 3. Log debug information to stderr (stdout is reserved for the JSON protocol)
echo "[hook:format-repo] Triggered by tool: $TOOL_NAME" >&2

# 4. Check if the tool execution reported an error
TOOL_ERROR=$(echo "$HOOK_INPUT" | jq -r '.error // .tool_response.error // empty')
if [ -n "$TOOL_ERROR" ]; then
    echo "[hook:format-repo] Tool reported an error. Skipping formatting." >&2
    echo '{}'
    exit 0
fi

# 5. Navigate to the project root directory
if [ -n "$WORKSPACE_PATH" ] && [ -d "$WORKSPACE_PATH" ]; then
    cd "$WORKSPACE_PATH"
elif [ -d ".." ] && [ -f "../package.json" ]; then
    cd ..
fi

# 6. Execute the formatting command
if npm run format >&2 2>&1; then
    echo "[hook:format-repo] Repository automatically formatted with Prettier." >&2
else
    echo "[hook:format-repo] Formatting failed. Check stderr for details." >&2
fi

# 7. PostToolUse expects an empty JSON object on stdout
echo '{}'
