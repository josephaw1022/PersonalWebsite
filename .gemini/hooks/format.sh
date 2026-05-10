#!/bin/bash
# Log to stderr to avoid polluting stdout
echo "Running format hook..." >&2

cd "${GEMINI_PROJECT_DIR:-.}" || exit 1

# Run the formatter, redirecting all output to stderr
if npm run format >&2 2>&1; then
  echo "Formatting completed successfully." >&2
else
  echo "Formatting encountered an error (check logs)." >&2
fi

# Mandatory JSON output to stdout
cat << 'EOF'
{
  "continue": true,
  "systemMessage": "Auto-formatted repository after file edit."
}
EOF
