# Agent Instructions (Codex CLI)

このリポジトリは「仕様駆動開発」で進める。

## 進め方

- 変更は小さく刻む（1PR = 1目的）
- 実装前に `docs/requirements.md` と `docs/spec.md` と `docs/tasks.md` を更新する
- 仕様は「受け入れ条件」を必ず書く（`docs/acceptance.md`）
- テストファーストで進める（Spec -> Test -> Code）
- 実装は Red -> Green -> Refactor の順で進める
- 設計判断はADRで残す（`docs/adr/`）
- 仕様とテストをリンクする（タスクに「どの受け入れ条件/テストを満たすか」を書く）

## ルール

- 外部I/O（ネットワーク、API、課金、破壊的操作）はデフォルトで行わない。必要時は理由と代替案を提示する
- `OPENAI_API_KEY` はサーバー側のみで扱う（クライアントへ出さない）
- CI は常に緑を保つ。新規の重要仕様にはテストを追加する
