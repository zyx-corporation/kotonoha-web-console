/**
 * M7-d: two-project Console API isolation (requires DATABASE_URL).
 * Spawns the dev API briefly per principal.
 */
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";
import { test } from "node:test";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATABASE_URL = process.env.DATABASE_URL;
const LEGACY_PRINCIPAL = "00000000-0000-4000-8000-000000000001";
const LEGACY_PROJECT = "00000000-0000-4000-8000-000000000002";
const GIT_COMMIT = "0000000000000000000000000000000000000001";

async function setupFixture(pool) {
  const suffix = Date.now().toString(36);
  const slug = `m7-console-e2e-${suffix}`;
  const projectRes = await pool.query(
    `INSERT INTO projects (slug, name) VALUES ($1, 'M7 E2E B') RETURNING id::text AS id`,
    [slug]
  );
  const projectBId = projectRes.rows[0].id;
  const principalRes = await pool.query(
    `INSERT INTO principals (kind, display_name, external_ref)
     VALUES ('human', 'M7 E2E B', $1) RETURNING id::text AS id`,
    [`m7.console.e2e.b.${suffix}`]
  );
  const principalBId = principalRes.rows[0].id;
  await pool.query(
    `INSERT INTO project_members (project_id, principal_id, role)
     VALUES ($1::uuid, $2::uuid, 'owner')`,
    [projectBId, principalBId]
  );
  await pool.query(
    `INSERT INTO meaning_deltas (git_commit, file_path, diff_ref, observation, project_id)
     VALUES ($1, 'note.md', 'e2e-default', '{"note":"m7-e2e-default"}'::jsonb, $2::uuid)`,
    [GIT_COMMIT, LEGACY_PROJECT]
  );
  await pool.query(
    `INSERT INTO meaning_deltas (git_commit, file_path, diff_ref, observation, project_id)
     VALUES ($1, 'note.md', 'e2e-b', '{"note":"m7-e2e-team-b"}'::jsonb, $2::uuid)`,
    [GIT_COMMIT, projectBId]
  );
  return { projectBId, principalBId, slug };
}

async function cleanupFixture(pool, slug, principalBId) {
  await pool.query(
    `DELETE FROM meaning_deltas WHERE diff_ref IN ('e2e-default', 'e2e-b') AND git_commit = $1`,
    [GIT_COMMIT]
  );
  await pool.query(`DELETE FROM project_members WHERE principal_id = $1::uuid`, [
    principalBId,
  ]);
  await pool.query(`DELETE FROM projects WHERE slug = $1`, [slug]);
  await pool.query(`DELETE FROM principals WHERE id = $1::uuid`, [principalBId]);
}

function startServer(principalId, port) {
  const child = spawn("npx", ["tsx", "src/index.ts"], {
    cwd: join(__dirname, ".."),
    env: {
      ...process.env,
      DATABASE_URL,
      KOTONOHA_PRINCIPAL_ID: principalId,
      PORT: String(port),
    },
    stdio: "pipe",
  });
  return child;
}

async function fetchJson(url) {
  const res = await fetch(url);
  const body = await res.json();
  return { ok: res.ok, status: res.status, body };
}

test("M7 console: project list and deltas isolated per principal", async (t) => {
  if (!DATABASE_URL) {
    t.skip("DATABASE_URL not set");
    return;
  }

  const pool = new pg.Pool({ connectionString: DATABASE_URL });
  let fixture;
  const port = 9876 + Math.floor(Math.random() * 200);
  try {
    fixture = await setupFixture(pool);
    const base = `http://127.0.0.1:${port}`;

    const childA = startServer(LEGACY_PRINCIPAL, port);
    await delay(1200);
    try {
      const projectsA = await fetchJson(`${base}/api/projects`);
      assert.equal(projectsA.ok, true);
      const idsA = projectsA.body.projects.map((p) => p.id);
      assert.ok(idsA.includes(LEGACY_PROJECT));
      assert.ok(!idsA.includes(fixture.projectBId));

      const deltasA = await fetchJson(
        `${base}/api/projects/${LEGACY_PROJECT}/deltas`
      );
      assert.equal(deltasA.ok, true);
      const notesA = deltasA.body.deltas.map((d) => d.id);
      assert.ok(notesA.length >= 1);
      const obsA = deltasA.body.deltas.find((d) => d.id)?.observation;
      // observation not in list API - check file_path only; filter by diff via separate query
      assert.ok(
        deltasA.body.deltas.some((d) => d.file_path === "note.md")
      );
    } finally {
      childA.kill("SIGTERM");
      await delay(300);
    }

    const childB = startServer(fixture.principalBId, port);
    await delay(1200);
    try {
      const projectsB = await fetchJson(`${base}/api/projects`);
      assert.equal(projectsB.ok, true);
      const idsB = projectsB.body.projects.map((p) => p.id);
      assert.ok(idsB.includes(fixture.projectBId));
      assert.ok(!idsB.includes(LEGACY_PROJECT));

      const deltasB = await fetchJson(
        `${base}/api/projects/${fixture.projectBId}/deltas`
      );
      assert.equal(deltasB.ok, true);
      assert.equal(deltasB.body.deltas.length, 1);
      assert.equal(deltasB.body.deltas[0].file_path, "note.md");
    } finally {
      childB.kill("SIGTERM");
    }
  } finally {
    if (fixture) {
      await cleanupFixture(pool, fixture.slug, fixture.principalBId);
    }
    await pool.end();
  }
});
