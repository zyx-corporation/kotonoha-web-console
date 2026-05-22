import pg from "pg";
import { config, requireDatabaseUrl } from "./config.js";

export interface ProjectRow {
  id: string;
  slug: string;
  name: string;
}

export interface DeltaRow {
  id: string;
  git_commit: string;
  file_path: string;
  line_range_start: number | null;
  line_range_end: number | null;
  project_id: string | null;
  created_at: string;
}

export async function withPool<T>(fn: (pool: pg.Pool) => Promise<T>): Promise<T> {
  const pool = new pg.Pool({ connectionString: requireDatabaseUrl() });
  try {
    return await fn(pool);
  } finally {
    await pool.end();
  }
}

export async function listProjects(principalId: string | null): Promise<ProjectRow[]> {
  return withPool(async (pool) => {
    if (principalId) {
      const result = await pool.query<ProjectRow>(
        `SELECT p.id::text AS id, p.slug, p.name
         FROM projects p
         INNER JOIN project_members pm ON pm.project_id = p.id
         WHERE pm.principal_id = $1::uuid
           AND pm.role = ANY($2::text[])
         ORDER BY p.slug`,
        [principalId, config.viewerRoles]
      );
      return result.rows;
    }
    const result = await pool.query<ProjectRow>(
      "SELECT id::text AS id, slug, name FROM projects ORDER BY slug"
    );
    return result.rows;
  });
}

export async function principalCanViewProject(
  principalId: string,
  projectId: string
): Promise<boolean> {
  return withPool(async (pool) => {
    const result = await pool.query<{ ok: boolean }>(
      `SELECT EXISTS (
         SELECT 1 FROM project_members
         WHERE project_id = $1::uuid
           AND principal_id = $2::uuid
           AND role = ANY($3::text[])
       ) AS ok`,
      [projectId, principalId, config.viewerRoles]
    );
    return Boolean(result.rows[0]?.ok);
  });
}

export async function listDeltasForProject(
  projectId: string,
  gitCommit: string | null
): Promise<DeltaRow[]> {
  return withPool(async (pool) => {
    if (gitCommit) {
      const result = await pool.query<DeltaRow>(
        `SELECT id::text AS id, git_commit, file_path,
                line_range_start, line_range_end, project_id::text AS project_id,
                created_at::text AS created_at
         FROM meaning_deltas
         WHERE project_id = $1::uuid AND git_commit = $2
         ORDER BY created_at DESC`,
        [projectId, gitCommit]
      );
      return result.rows;
    }
    const result = await pool.query<DeltaRow>(
      `SELECT id::text AS id, git_commit, file_path,
              line_range_start, line_range_end, project_id::text AS project_id,
              created_at::text AS created_at
       FROM meaning_deltas
       WHERE project_id = $1::uuid
       ORDER BY created_at DESC`,
      [projectId]
    );
    return result.rows;
  });
}
