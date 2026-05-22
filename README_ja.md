# kotonoha-web-console

**M7 Team Mode** 向けの最小 Web コンソール（読み取り専用スキャフォールド）。親 Issue: [#139](https://github.com/zyx-corporation/kotonoha-management/issues/139) · M7-a [#142](https://github.com/zyx-corporation/kotonoha-management/issues/142)。

> Obsidian 用 [`kotonoha-console`](https://github.com/zyx-corporation/kotonoha-console) とは**別リポジトリ**です。

## 構成

- **web/** — Vite + React（i18n: `ja` / `en`）
- **server/** — 開発用 API（`GET /api/projects` で `projects` テーブルを参照）

## 前提

- Node.js 20+
- M6 マイグレーション済み Postgres（[`kotonoha-core`](https://github.com/zyx-corporation/kotonoha-core)）
- [`kotonoha` CLI](https://github.com/zyx-corporation/kotonoha-cli) ≥ 0.2.9（`KOTONOHA_CLI_PATH` で上書き可）
- 環境変数（サーバ）:
  - `DATABASE_URL`
  - `KOTONOHA_PRINCIPAL_ID`（delta 一覧・M6 export に**必須**、`viewer` 以上）
  - `KOTONOHA_CLI_PATH`（任意）

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
| M7-b | [#143](https://github.com/zyx-corporation/kotonoha-management/issues/143)（delta + export） |
| M7-d | [#145](https://github.com/zyx-corporation/kotonoha-management/issues/145) |

仕様草案: [`37_m7_team_mode_ui_spec_draft.md`](https://github.com/zyx-corporation/kotonoha-management/blob/main/docs/37_m7_team_mode_ui_spec_draft.md)。
