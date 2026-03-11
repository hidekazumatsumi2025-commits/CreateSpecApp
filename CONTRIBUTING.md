# Contributing

## Branch / PR

- `main` へ直接pushしない（必ずPR）
- ブランチ名: `feat/<topic>` / `fix/<topic>` / `chore/<topic>`
- 1PR = 1目的（変更は小さく）

## Spec-Driven

- 変更前に `docs/requirements.md` / `docs/spec.md` / `docs/acceptance.md` / `docs/tasks.md` を更新する
- 重要な仕様はテストで固定する

## Local Checks

```sh
npm run ci
```

## Secrets

- `OPENAI_API_KEY` は `.env.local` に置く
- どのファイルにもキーをコミットしない

