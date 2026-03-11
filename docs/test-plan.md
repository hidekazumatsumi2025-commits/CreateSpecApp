# Test Plan

## Scope

- 仕様生成APIとUI主要導線（入力 -> 生成 -> 表示/ダウンロード）を対象とする
- 外部サービス依存の完全E2Eは対象外（契約/統合で代替）

## Strategy

- Test First を採用する（Spec -> Test -> Code）
- 各 AC について最初に失敗するテスト（Red）を書く
- 最小実装でテストを通す（Green）
- 振る舞いを変えない範囲で整理する（Refactor）
- すべてのテストケースは `docs/acceptance.md` の AC に紐付ける
- `coverage 100%` は最低基準。完了判定は下記観点の充足で行う

## Test Cases

- 仕様妥当性: `POST /api/generate` の入力バリデーション（400）と生成失敗ハンドリング（502/500）
- 回帰: 既知不具合に対する再発防止テスト
- 契約: `POST /api/generate` の request/response/error code 互換性
- 統合: route + prompt/schema + OpenAI 呼び出し境界
- E2E: 主要ユーザーシナリオ（入力 -> 生成 -> プレビュー/ダウンロード）

## Non-functional

- 性能: API応答時間とテスト実行時間の上限目標
- セキュリティ: `OPENAI_API_KEY` がクライアントへ露出しないこと
- 信頼性: タイムアウト/想定外エラー時のハンドリング

## CI Mapping

- `npm run lint`
- `npm run test:coverage`
- 統合/E2E（導入時に追加）
- `npm run build`
