# Contributing

## Branch / PR

- `main` へ直接pushしない（必ずPR）
- ブランチ名: `feat/<topic>` / `fix/<topic>` / `chore/<topic>`
- 1PR = 1目的（変更は小さく）
- 新規リポジトリ作成直後に `main` の Branch protection を設定する
  - PR必須
  - 最低1承認必須
  - 必須チェック: `CI / ci`

## Spec-Driven

- 変更前に `docs/requirements.md` / `docs/spec.md` / `docs/acceptance.md` / `docs/tasks.md` を更新する
- テストファーストで進める（Spec -> Test -> Code）
- 実装順序は Red -> Green -> Refactor を基本とする
- 重要な仕様は必ずテストで固定する（受け入れ条件とテストを対応付ける）

## Local Checks

```sh
npm run ci
```

## Secrets

- `OPENAI_API_KEY` は `.env.local` に置く
- どのファイルにもキーをコミットしない
