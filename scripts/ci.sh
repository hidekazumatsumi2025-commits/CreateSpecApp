#!/usr/bin/env bash
set -euo pipefail

echo "CI: validate spec docs + lint/test/build"

required_files=(
  "docs/requirements.md"
  "docs/spec.md"
  "docs/tasks.md"
  "docs/acceptance.md"
  "docs/test-plan.md"
  ".github/workflows/ci.yml"
)

missing=0
for f in "${required_files[@]}"; do
  if [[ ! -f "$f" ]]; then
    echo "missing required file: $f" >&2
    missing=1
  fi
done

if [[ "$missing" -ne 0 ]]; then
  exit 1
fi

npm ci
npm run lint
npm run test
npm run build

