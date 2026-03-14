#!/usr/bin/env bash
set -euo pipefail

required_docs=(
  "docs/requirements.md"
  "docs/spec.md"
  "docs/acceptance.md"
  "docs/tasks.md"
  "docs/test-plan.md"
)

has_pattern() {
  local pattern="$1"
  local file="$2"
  if command -v rg >/dev/null 2>&1; then
    rg -n "$pattern" "$file" >/dev/null 2>&1
    return $?
  fi
  grep -Eq "$pattern" "$file"
}

missing=0
for f in "${required_docs[@]}"; do
  if [[ ! -f "$f" ]]; then
    echo "spec-driven-guard: missing required doc: $f" >&2
    missing=1
  fi
done

if [[ "$missing" -ne 0 ]]; then
  exit 1
fi

base_ref="${SPEC_GUARD_BASE_REF:-origin/main}"
diff_base=""

if git rev-parse --verify "$base_ref" >/dev/null 2>&1; then
  diff_base="$(git merge-base HEAD "$base_ref")"
elif git rev-parse --verify HEAD~1 >/dev/null 2>&1; then
  diff_base="HEAD~1"
fi

if [[ -n "$diff_base" ]]; then
  changed_files="$(git diff --name-only "$diff_base"...HEAD)"
else
  changed_files="$(git ls-files)"
fi

if [[ -z "$changed_files" ]]; then
  echo "spec-driven-guard: no changed files detected"
  exit 0
fi

code_changed=0
docs_changed=0
tests_changed=0

while IFS= read -r path; do
  [[ -z "$path" ]] && continue

  if [[ "$path" =~ ^(src/|app/|server/|api/|lib/|cmd/|internal/|public/|package\.json|package-lock\.json|go\.mod|go\.sum|pyproject\.toml|requirements\.txt) ]]; then
    code_changed=1
  fi

  if [[ "$path" =~ ^docs/(requirements\.md|spec\.md|acceptance\.md|tasks\.md|test-plan\.md|agent-role-definitions\.md)$ ]]; then
    docs_changed=1
  fi

  if [[ "$path" =~ (^tests?/|^__tests__/|\.test\.(ts|tsx|js|jsx|py|go|rb)$|\.spec\.(ts|tsx|js|jsx|py|go|rb)$) ]]; then
    tests_changed=1
  fi
done <<<"$changed_files"

if [[ "$code_changed" -eq 1 && "$docs_changed" -eq 0 ]]; then
  echo "spec-driven-guard: code changed but spec docs were not updated." >&2
  echo "update at least one of docs/{requirements,spec,acceptance,tasks,test-plan}.md" >&2
  exit 1
fi

if [[ "$code_changed" -eq 1 && "$tests_changed" -eq 0 ]]; then
  echo "spec-driven-guard: code changed but no test file changed." >&2
  echo "add/modify tests to preserve spec-driven traceability." >&2
  exit 1
fi

if ! has_pattern "AC-[0-9]{3}" docs/acceptance.md; then
  echo "spec-driven-guard: docs/acceptance.md must include AC-IDs (e.g. AC-001)." >&2
  exit 1
fi

if ! has_pattern "AC-[0-9]{3}" docs/tasks.md; then
  echo "spec-driven-guard: docs/tasks.md must reference AC-IDs for traceability." >&2
  exit 1
fi

echo "spec-driven-guard: passed"
