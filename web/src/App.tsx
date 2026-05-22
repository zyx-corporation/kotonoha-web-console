import { useCallback, useEffect, useState } from "react";
import { t, type Locale } from "./i18n/messages";

interface Project {
  id: string;
  slug: string;
  name: string;
}

function resolveLocale(): Locale {
  const lang = navigator.language.toLowerCase();
  return lang.startsWith("ja") ? "ja" : "en";
}

export function App() {
  const [locale, setLocale] = useState<Locale>(resolveLocale);
  const [healthOk, setHealthOk] = useState<boolean | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const healthRes = await fetch("/api/health");
      setHealthOk(healthRes.ok);
      const projRes = await fetch("/api/projects");
      if (!projRes.ok) {
        const body = (await projRes.json()) as { error?: string };
        throw new Error(body.error ?? `HTTP ${projRes.status}`);
      }
      const body = (await projRes.json()) as { projects: Project[] };
      setProjects(body.projects);
    } catch (e) {
      setHealthOk(false);
      setError(e instanceof Error ? e.message : String(e));
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

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

      <p className={`status ${healthOk ? "ok" : "warn"}`}>
        {healthOk === null
          ? t(locale, "loading")
          : healthOk
            ? t(locale, "healthOk")
            : t(locale, "healthFail")}
      </p>

      <section>
        <h2>{t(locale, "projectsHeading")}</h2>
        {loading && <p>{t(locale, "loading")}</p>}
        {error && (
          <p className="error" role="alert">
            {t(locale, "errorPrefix")}: {error}
          </p>
        )}
        {!loading && !error && projects.length === 0 && (
          <p>{t(locale, "emptyProjects")}</p>
        )}
        <ul className="project-list">
          {projects.map((p) => (
            <li key={p.id}>
              <strong>{p.name}</strong>
              <span className="muted">
                {p.slug} · {p.id}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
