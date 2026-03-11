Next.js + OpenAI API で「抽象要求 → 仕様駆動md一式」を生成する小さなWebアプリ。

## Getting Started

1. 環境変数を用意

```bash
cp .env.example .env.local
# OPENAI_API_KEY をセット
```

2. 起動

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Spec-Driven Docs

- `docs/requirements.md`
- `docs/acceptance.md`
- `docs/spec.md`
- `docs/tasks.md`
- `docs/test-plan.md`
- `docs/adr/`

## CI

`npm run ci` または `make ci` が `lint/test/build` と仕様ドキュメント存在チェックを行います。
