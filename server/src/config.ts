const VIEWER_ROLES = ["viewer", "reviewer", "agent_runner", "owner"] as const;

export const config = {
  port: Number(process.env.PORT ?? 8787),
  databaseUrl: process.env.DATABASE_URL ?? "",
  principalId: process.env.KOTONOHA_PRINCIPAL_ID?.trim() || null,
  cliPath: process.env.KOTONOHA_CLI_PATH?.trim() || "kotonoha",
  viewerRoles: VIEWER_ROLES,
};

export function requireDatabaseUrl(): string {
  if (!config.databaseUrl) {
    throw new HttpError(503, "DATABASE_URL not set");
  }
  return config.databaseUrl;
}

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "HttpError";
  }
}
