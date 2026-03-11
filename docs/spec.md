# Spec

## Overview

（Goal / Non-goals / Acceptance Criteria を参照して、実装範囲を明確化する）

## Interfaces

### UI

- 抽象要求入力（textarea）
- 言語指定（ja/en）
- 詳細度指定（low/medium/high）
- 生成結果タブ表示（5ファイル）
- ファイルDL（単体/一括）

### API

- `POST /api/generate`
  - request: `{ input, detail, language }`
  - response: `{ projectName, files, questions }`

## Data Model

`files` は固定の5ファイル（`requirements.md` 等）をキーに持つ。

## Error Handling

- APIキー未設定は 500 でエラーを返す
- 不正リクエストは 400
- 生成の失敗（パース不可など）は 502/500

## Security / Privacy

- APIキーはサーバー環境変数のみ
- 生成結果はサーバーに永続化しない（MVP）

## Ops

- Observability (logs/metrics/traces)
- Deployment model
- Backward compatibility / migrations

## Testing

- カバレッジ計測は Vitest (`@vitest/coverage-v8`) を利用する
- カバレッジ対象は `src/app/api/generate/route.ts` と `src/lib/spec-gen/*.ts`
- しきい値は statements / branches / functions / lines すべて 100%
- CI は `npm run test:coverage` を実行し、しきい値未達を失敗にする
