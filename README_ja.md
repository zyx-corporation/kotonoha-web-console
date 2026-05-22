# kotonoha-web-console

**M7 Team Mode** 向けの最小 Web コンソール（読み取り専用スキャフォールド）。親 Issue: [#139](https://github.com/zyx-corporation/kotonoha-management/issues/139) · M7-a [#142](https://github.com/zyx-corporation/kotonoha-management/issues/142)。

> Obsidian 用 [`kotonoha-console`](https://github.com/zyx-corporation/kotonoha-console) とは**別リポジトリ**です。

## 構成

- **web/** — Vite + React（i18n: `ja` / `en`）
- **server/** — 開発用 API（`GET /api/projects` で `projects` テーブルを参照）

## 前提

- Node.js 20+
- M6 マイグレーション済み Postgres（[`kotonoha-core`](https://github.com/zyx-corporation/kotonoha-core)）
- 環境変数:
  - `DATABASE_URL`
  - `KOTONOHA_PRINCIPAL_ID`（任意。M7-b で RBAC 連携予定）

## 起動

```bash
npm install
npm run dev -w server   # :8787
npm run dev -w web      # :5173
```

## ロードマップ

| マイルストーン | Issue |
| --- | --- |
| M7-a | [#142](https://github.com/zyx-corporation/kotonoha-management/issues/142) |
| M7-b | [#143](https://github.com/zyx-corporation/kotonoha-management/issues/143) |
| M7-d | [#145](https://github.com/zyx-corporation/kotonoha-management/issues/145) |

仕様草案: [`37_m7_team_mode_ui_spec_draft.md`](https://github.com/zyx-corporation/kotonoha-management/blob/main/docs/37_m7_team_mode_ui_spec_draft.md)。
