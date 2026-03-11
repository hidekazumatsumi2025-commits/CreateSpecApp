# Test Plan

## Scope

## Strategy

- Test First を採用する（Spec -> Test -> Code）
- 各 AC について最初に失敗するテスト（Red）を書く
- 最小実装でテストを通す（Green）
- 振る舞いを変えない範囲で整理する（Refactor）
- すべてのテストケースは `docs/acceptance.md` の AC に紐付ける

## Test Cases

- AC-001: `POST /api/generate` の入力バリデーション（400）と生成失敗ハンドリング（502/500）
- AC-003: `OPENAI_API_KEY` 未設定時に 500 を返すこと
- AC-004: `src/app/api/generate/route.ts` と `src/lib/spec-gen/*.ts` のカバレッジが 100% であること

## Non-functional

- テスト実行時間はローカルで数秒以内を目標とする

## CI Mapping

- `npm run lint`
- `npm run test:coverage`
- `npm run build`
