# GitHub Setup (PR Workflow)

このリポジトリは PR 運用を前提とする。リポジトリ内にはPRテンプレ/Issueフォーム/CIを含む。
PR運用として「強制」するには、GitHub側の Branch protection を設定する。

## 1. Create Repo

- GitHubで空のリポジトリを作成（README等は追加しない）

## 2. Add Remote + Push

```sh
git remote add origin <GITHUB_REPO_URL>
git push -u origin main
```

## 3. Protect `main`

GitHubの `Settings -> Branches -> Branch protection rules` で `main` を保護する。

- Require a pull request before merging
- Require approvals (最低1)
- Require status checks to pass:
  - `CI / ci`

