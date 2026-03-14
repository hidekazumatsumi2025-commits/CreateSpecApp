#!/usr/bin/env bash
set -euo pipefail

echo "CI: validate spec docs + lint/test/build"
rm -rf coverage

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

bash scripts/spec-driven-guard.sh

npm ci
npm run lint
npm run test:coverage
npm run build
