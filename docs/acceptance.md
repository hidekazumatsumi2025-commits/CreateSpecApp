# Acceptance Criteria

機能単位で「受け入れ条件」を列挙する。実装タスクとテストはここに紐付ける。

## Format (Example)

### AC-001: <title>

- Given:
- When:
- Then:

### AC-001: 仕様ドキュメント生成

- Given: ユーザーが抽象要求テキストを入力している
- When: 生成を実行する
- Then: `requirements.md` / `acceptance.md` / `spec.md` / `tasks.md` / `test-plan.md` が生成されプレビューできる

### AC-002: ダウンロード

- Given: 生成結果がある
- When: ユーザーが「このmdをDL」または「全部DL」を押す
- Then: 対象のMarkdownがファイルとしてダウンロードされる

### AC-003: 秘密情報の保護

- Given: ユーザーがブラウザを操作している
- When: API呼び出しが発生する
- Then: `OPENAI_API_KEY` はクライアントに露出しない（サーバー側のみで使用される）
