import cors from "cors";
import express from "express";
import pg from "pg";

const PORT = Number(process.env.PORT ?? 8787);
const DATABASE_URL = process.env.DATABASE_URL;

export interface ProjectRow {
  id: string;
  slug: string;
  name: string;
}

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    principal_id: process.env.KOTONOHA_PRINCIPAL_ID ?? null,
    database_configured: Boolean(DATABASE_URL),
  });
});

app.get("/api/projects", async (_req, res) => {
  if (!DATABASE_URL) {
    res.status(503).json({ error: "DATABASE_URL not set" });
    return;
  }
  const pool = new pg.Pool({ connectionString: DATABASE_URL });
  try {
    const result = await pool.query<ProjectRow>(
      "SELECT id::text AS id, slug, name FROM projects ORDER BY slug"
    );
    res.json({ projects: result.rows });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  } finally {
    await pool.end();
  }
});

app.listen(PORT, () => {
  console.log(`kotonoha-web-console API http://127.0.0.1:${PORT}`);
});
