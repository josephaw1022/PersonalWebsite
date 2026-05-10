#!/bin/bash

# Gemini CLI Hook: format-repo
# Event: AfterTool
# Description: Automatically formats the repository using Prettier after file-modifying tools.

set -e

# 1. Consume the JSON input from stdin
# This is required by the protocol to ensure the hook can access tool context.
HOOK_INPUT=$(cat)

# 2. Extract context using jq (silently)
# We use the cwd provided in the input to ensure we're in the right directory.
TOOL_NAME=$(echo "$HOOK_INPUT" | jq -r '.tool_name // "unknown"')
CWD=$(echo "$HOOK_INPUT" | jq -r '.cwd // "."')

# 3. Log debug information to stderr
# Plain text on stdout will break the JSON parser in the CLI.
echo "[hook:format-repo] Triggered by tool: $TOOL_NAME" >&2

# 4. Check if the tool execution was successful
# We shouldn't format if the tool failed to write the file.
TOOL_ERROR=$(echo "$HOOK_INPUT" | jq -r '.tool_response.error // empty')
if [ -n "$TOOL_ERROR" ]; then
    echo "[hook:format-repo] Tool reported an error. Skipping formatting." >&2
    echo '{"continue": true}'
    exit 0
fi

# 5. Navigate to the project directory
if [ -d "$CWD" ]; then
    cd "$CWD"
fi

# 6. Execute the formatting command
# Redirect stdout/stderr of the command to stderr of the hook.
if npm run format >&2 2>&1; then
    # 7. Return success JSON to stdout
    # systemMessage is shown to the user in the CLI.
    # continue: true allows the agentic loop to proceed.
    echo '{"continue": true, "systemMessage": "Repository automatically formatted with Prettier."}'
else
    # Handle formatting failures gracefully
    echo "[hook:format-repo] Formatting failed." >&2
    echo '{"continue": true, "systemMessage": "Automatic formatting failed. Check stderr for details."}'
fi

