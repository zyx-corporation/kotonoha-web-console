import { spawn } from "node:child_process";
import { config, HttpError, requireDatabaseUrl } from "./config.js";

export interface M6ExportOptions {
  projectId: string;
  principalId: string;
  gitCommit?: string;
}

export async function runM6Export(opts: M6ExportOptions): Promise<unknown> {
  const args = [
    "export",
    "--format",
    "m6",
    "--project-id",
    opts.projectId,
  ];
  if (opts.gitCommit) {
    args.push("--git-commit", opts.gitCommit);
  }

  const env: NodeJS.ProcessEnv = {
    ...process.env,
    DATABASE_URL: requireDatabaseUrl(),
    KOTONOHA_PRINCIPAL_ID: opts.principalId,
    KOTONOHA_PROJECT_ID: opts.projectId,
  };

  const stdout = await execCli(args, env);
  try {
    return JSON.parse(stdout) as unknown;
  } catch {
    throw new HttpError(502, "CLI returned invalid JSON");
  }
}

function execCli(args: string[], env: NodeJS.ProcessEnv): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(config.cliPath, args, { env, stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    let err = "";
    child.stdout.on("data", (chunk: Buffer) => {
      out += chunk.toString();
    });
    child.stderr.on("data", (chunk: Buffer) => {
      err += chunk.toString();
    });
    child.on("error", (e) => {
      reject(new HttpError(502, `failed to spawn ${config.cliPath}: ${e.message}`));
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolve(out.trim());
        return;
      }
      const hint = err.trim() || `exit ${code ?? "unknown"}`;
      if (hint.includes("AccessDenied") || hint.includes("lacks role")) {
        reject(new HttpError(403, hint));
        return;
      }
      reject(new HttpError(502, hint));
    });
  });
}
