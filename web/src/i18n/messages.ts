export type Locale = "en" | "ja";

const en = {
  appTitle: "Kotonoha Console",
  appSubtitle: "Team Mode (M7) — read-only scaffold",
  projectsHeading: "Projects",
  loading: "Loading…",
  emptyProjects: "No projects found.",
  errorPrefix: "Error",
  localeLabel: "Language",
  healthOk: "API connected",
  healthFail: "API unavailable",
} as const;

const ja: Record<keyof typeof en, string> = {
  appTitle: "Kotonoha コンソール",
  appSubtitle: "Team Mode（M7）— 読み取り専用スキャフォールド",
  projectsHeading: "プロジェクト",
  loading: "読み込み中…",
  emptyProjects: "プロジェクトがありません。",
  errorPrefix: "エラー",
  localeLabel: "言語",
  healthOk: "API 接続済み",
  healthFail: "API 未接続",
};

export const catalogs = { en, ja };

export function t(locale: Locale, key: keyof typeof en): string {
  return catalogs[locale][key] ?? catalogs.en[key];
}
