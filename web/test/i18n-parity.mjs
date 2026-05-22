import assert from "node:assert/strict";
import { test } from "node:test";

// Mirrors web/src/i18n/messages.ts (keep keys in sync).
const en = {
  appTitle: "Kotonoha Console",
  appSubtitle: "Team Mode (M7) — read-only",
  projectsHeading: "Projects",
  deltasHeading: "Meaning deltas",
  exportHeading: "Audit export (M6)",
  selectProject: "Select a project",
  loading: "Loading…",
  emptyProjects: "No projects visible to this principal.",
  emptyDeltas: "No meaning deltas in this project.",
  errorPrefix: "Error",
  localeLabel: "Language",
  healthOk: "API connected",
  healthFail: "API unavailable",
  refresh: "Refresh",
  downloadExport: "Download M6 JSON",
  exportReady: "Export loaded (see preview below).",
  gitCommitFilter: "Git commit filter (optional)",
  applyFilter: "Apply",
  clearFilter: "Clear",
  principalRequired:
    "Set KOTONOHA_PRINCIPAL_ID on the API server to list deltas and export.",
};

const ja = {
  appTitle: "Kotonoha コンソール",
  appSubtitle: "Team Mode（M7）— 読み取り専用",
  projectsHeading: "プロジェクト",
  deltasHeading: "Meaning delta 一覧",
  exportHeading: "監査 export（M6）",
  selectProject: "プロジェクトを選択",
  loading: "読み込み中…",
  emptyProjects: "この principal から見えるプロジェクトがありません。",
  emptyDeltas: "このプロジェクトに delta がありません。",
  errorPrefix: "エラー",
  localeLabel: "言語",
  healthOk: "API 接続済み",
  healthFail: "API 未接続",
  refresh: "更新",
  downloadExport: "M6 JSON をダウンロード",
  exportReady: "Export を取得しました（下にプレビュー）。",
  gitCommitFilter: "Git commit フィルタ（任意）",
  applyFilter: "適用",
  clearFilter: "クリア",
  principalRequired:
    "delta / export には API サーバの KOTONOHA_PRINCIPAL_ID が必要です。",
};

test("i18n: ja has every en catalog key", () => {
  for (const key of Object.keys(en)) {
    assert.ok(ja[key], `missing ja key: ${key}`);
    assert.equal(typeof ja[key], "string");
  }
});
