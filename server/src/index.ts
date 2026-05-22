import cors from "cors";
import express from "express";
import { runM6Export } from "./cli.js";
import { config, HttpError } from "./config.js";
import {
  listDeltasForProject,
  listProjects,
  principalCanViewProject,
} from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

function requirePrincipalId(): string {
  if (!config.principalId) {
    throw new HttpError(
      401,
      "KOTONOHA_PRINCIPAL_ID required for project-scoped read (set on server env)"
    );
  }
  return config.principalId;
}

function sendError(res: express.Response, err: unknown): void {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  const message = err instanceof Error ? err.message : String(err);
  res.status(500).json({ error: message });
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    principal_id: config.principalId,
    database_configured: Boolean(config.databaseUrl),
    cli_path: config.cliPath,
  });
});

app.get("/api/projects", async (_req, res) => {
  try {
    const projects = await listProjects(config.principalId);
    res.json({ projects });
  } catch (err) {
    sendError(res, err);
  }
});

app.get("/api/projects/:projectId/deltas", async (req, res) => {
  try {
    const principalId = requirePrincipalId();
    const projectId = String(req.params.projectId);
    if (!(await principalCanViewProject(principalId, projectId))) {
      res.status(403).json({ error: "access denied for project" });
      return;
    }
    const gitCommit =
      typeof req.query.git_commit === "string" ? req.query.git_commit : null;
    const deltas = await listDeltasForProject(projectId, gitCommit);
    res.json({ project_id: projectId, deltas });
  } catch (err) {
    sendError(res, err);
  }
});

app.get("/api/projects/:projectId/export/m6", async (req, res) => {
  try {
    const principalId = requirePrincipalId();
    const projectId = String(req.params.projectId);
    if (!(await principalCanViewProject(principalId, projectId))) {
      res.status(403).json({ error: "access denied for project" });
      return;
    }
    const gitCommit =
      typeof req.query.git_commit === "string" ? req.query.git_commit : undefined;
    const bundle = await runM6Export({
      projectId,
      principalId,
      gitCommit,
    });
    res.json(bundle);
  } catch (err) {
    sendError(res, err);
  }
});

app.listen(config.port, () => {
  console.log(`kotonoha-web-console API http://127.0.0.1:${config.port}`);
});
