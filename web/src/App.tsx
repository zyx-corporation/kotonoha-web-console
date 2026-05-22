import { useCallback, useEffect, useState } from "react";
import { t, type Locale } from "./i18n/messages";

interface Project {
  id: string;
  slug: string;
  name: string;
}

interface Delta {
  id: string;
  git_commit: string;
  file_path: string;
  line_range_start: number | null;
  line_range_end: number | null;
  created_at: string;
}

interface Health {
  ok: boolean;
  principal_id: string | null;
}

function resolveLocale(): Locale {
  const lang = navigator.language.toLowerCase();
  return lang.startsWith("ja") ? "ja" : "en";
}

export function App() {
  const [locale, setLocale] = useState<Locale>(resolveLocale);
  const [health, setHealth] = useState<Health | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [deltas, setDeltas] = useState<Delta[]>([]);
  const [gitFilter, setGitFilter] = useState("");
  const [exportJson, setExportJson] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDeltas, setLoadingDeltas] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const healthRes = await fetch("/api/health");
      const healthBody = (await healthRes.json()) as Health;
      setHealth(healthBody);
      const projRes = await fetch("/api/projects");
      if (!projRes.ok) {
        const body = (await projRes.json()) as { error?: string };
        throw new Error(body.error ?? `HTTP ${projRes.status}`);
      }
      const body = (await projRes.json()) as { projects: Project[] };
      setProjects(body.projects);
      setSelectedId((prev) => prev || body.projects[0]?.id || "");
    } catch (e) {
      setHealth(null);
      setError(e instanceof Error ? e.message : String(e));
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDeltas = useCallback(async () => {
    if (!selectedId) {
      setDeltas([]);
      return;
    }
    if (!health?.principal_id) {
      setDeltas([]);
      return;
    }
    setLoadingDeltas(true);
    setError(null);
    try {
      const q = gitFilter.trim()
        ? `?git_commit=${encodeURIComponent(gitFilter.trim())}`
        : "";
      const res = await fetch(`/api/projects/${selectedId}/deltas${q}`);
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const body = (await res.json()) as { deltas: Delta[] };
      setDeltas(body.deltas);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setDeltas([]);
    } finally {
      setLoadingDeltas(false);
    }
  }, [selectedId, gitFilter, health?.principal_id]);

  const loadExport = useCallback(async () => {
    if (!selectedId || !health?.principal_id) {
      return;
    }
    setLoadingExport(true);
    setError(null);
    try {
      const q = gitFilter.trim()
        ? `?git_commit=${encodeURIComponent(gitFilter.trim())}`
        : "";
      const res = await fetch(`/api/projects/${selectedId}/export/m6${q}`);
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const data = await res.json();
      setExportJson(JSON.stringify(data, null, 2));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setExportJson(null);
    } finally {
      setLoadingExport(false);
    }
  }, [selectedId, gitFilter, health?.principal_id]);

  const downloadExport = useCallback(() => {
    if (!exportJson || !selectedId) {
      return;
    }
    const blob = new Blob([exportJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kotonoha-m6-audit-${selectedId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [exportJson, selectedId]);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    void loadDeltas();
  }, [loadDeltas]);

  const selected = projects.find((p) => p.id === selectedId);

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>{t(locale, "appTitle")}</h1>
          <p className="muted">{t(locale, "appSubtitle")}</p>
        </div>
        <label className="locale">
          {t(locale, "localeLabel")}
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            aria-label={t(locale, "localeLabel")}
          >
            <option value="en">English</option>
            <option value="ja">日本語</option>
          </select>
        </label>
      </header>

      <p className={`status ${health?.ok ? "ok" : "warn"}`}>
        {health === null
          ? t(locale, "loading")
          : health.ok
            ? t(locale, "healthOk")
            : t(locale, "healthFail")}
        {health?.principal_id && (
          <span className="muted"> · principal {health.principal_id}</span>
        )}
      </p>

      {!health?.principal_id && (
        <p className="warn-banner" role="status">
          {t(locale, "principalRequired")}
        </p>
      )}

      {error && (
        <p className="error" role="alert">
          {t(locale, "errorPrefix")}: {error}
        </p>
      )}

      <section className="panel">
        <div className="panel-head">
          <h2>{t(locale, "projectsHeading")}</h2>
          <button type="button" onClick={() => void loadProjects()}>
            {t(locale, "refresh")}
          </button>
        </div>
        {loading && <p>{t(locale, "loading")}</p>}
        {!loading && projects.length === 0 && (
          <p>{t(locale, "emptyProjects")}</p>
        )}
        <label>
          {t(locale, "selectProject")}
          <select
            value={selectedId}
            onChange={(e) => {
              setSelectedId(e.target.value);
              setExportJson(null);
            }}
            disabled={projects.length === 0}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.slug})
              </option>
            ))}
          </select>
        </label>
        {selected && (
          <p className="muted">
            {selected.slug} · {selected.id}
          </p>
        )}
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>{t(locale, "deltasHeading")}</h2>
          <button
            type="button"
            onClick={() => void loadDeltas()}
            disabled={!selectedId || !health?.principal_id}
          >
            {t(locale, "refresh")}
          </button>
        </div>
        <div className="filter-row">
          <label>
            {t(locale, "gitCommitFilter")}
            <input
              type="text"
              value={gitFilter}
              onChange={(e) => setGitFilter(e.target.value)}
              placeholder="abc123…"
            />
          </label>
          <button type="button" onClick={() => void loadDeltas()}>
            {t(locale, "applyFilter")}
          </button>
          <button
            type="button"
            onClick={() => {
              setGitFilter("");
            }}
          >
            {t(locale, "clearFilter")}
          </button>
        </div>
        {loadingDeltas && <p>{t(locale, "loading")}</p>}
        {!loadingDeltas && deltas.length === 0 && selectedId && (
          <p>{t(locale, "emptyDeltas")}</p>
        )}
        <ul className="delta-list">
          {deltas.map((d) => (
            <li key={d.id}>
              <code>{d.file_path}</code>
              <span className="muted">
                {d.git_commit.slice(0, 7)} · {d.id}
              </span>
              {(d.line_range_start != null || d.line_range_end != null) && (
                <span className="muted">
                  L{d.line_range_start ?? "?"}–{d.line_range_end ?? "?"}
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>{t(locale, "exportHeading")}</h2>
          <button
            type="button"
            onClick={() => void loadExport()}
            disabled={!selectedId || !health?.principal_id || loadingExport}
          >
            {loadingExport ? t(locale, "loading") : t(locale, "refresh")}
          </button>
        </div>
        {exportJson && (
          <>
            <p className="ok-text">{t(locale, "exportReady")}</p>
            <button type="button" onClick={downloadExport}>
              {t(locale, "downloadExport")}
            </button>
            <pre className="export-preview">{exportJson.slice(0, 4000)}
              {exportJson.length > 4000 ? "\n…" : ""}
            </pre>
          </>
        )}
      </section>
    </div>
  );
}
