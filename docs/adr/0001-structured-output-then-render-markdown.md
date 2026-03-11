# ADR 0001: Structured Output Then Render Markdown

## Status

Accepted

## Context

LLMにMarkdownを直接書かせると、フォーマット崩れやファイル間の不整合が起きやすい。
仕様駆動開発の入力としては、安定した出力と検証可能性が重要。

## Decision

LLMの出力はJSON（スキーマで検証可能）として受け取り、アプリ側でMarkdown文字列を生成する。
生成APIはスキーマに一致しない出力を失敗として扱う。

## Consequences

- 出力品質が安定し、受け入れ条件やタスクIDを機械的に整合させやすい
- スキーマ設計とレンダリングの実装コストが少し増える

