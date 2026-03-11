# Requirements

## Goal

抽象度の高い要求文を入力すると、仕様駆動開発のインプットになるMarkdown一式を生成できるWebアプリを提供する。

## Non-goals

このアプリ自体が生成物を自動でGitへ書き込む（コミット/PR作成）ことは当面やらない。

## Constraints

- OpenAI API を使用する（APIキーはサーバー側のみ）
- 生成結果はまずはブラウザ上のプレビューとダウンロードに限定する
- 生成は「構造化(JSON)→アプリ側でMarkdownレンダリング」で安定させる
- APIルートと仕様生成ロジックは自動テスト対象とし、カバレッジ100%を維持する

## Acceptance Criteria

`docs/acceptance.md` に機能単位でID付き（例: AC-001）で記載する。
