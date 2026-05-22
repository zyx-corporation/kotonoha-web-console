# kotonoha-web-console

**M7 Team Mode** minimal Web Console (read-only scaffold). Parent: [kotonoha-management #139](https://github.com/zyx-corporation/kotonoha-management/issues/139) · M7-a [#142](https://github.com/zyx-corporation/kotonoha-management/issues/142).

> **Not** [kotonoha-console](https://github.com/zyx-corporation/kotonoha-console) (Obsidian plugin).

## Stack

- **web/** — Vite + React (i18n `en` / `ja`)
- **server/** — Express dev API (`GET /api/projects` reads `projects` table)

## Prerequisites

- Node.js 20+
- PostgreSQL with M6 migrations applied ([`kotonoha-core`](https://github.com/zyx-corporation/kotonoha-core))
- Env:
  - `DATABASE_URL` — e.g. `postgres://kotonoha:kotonoha@localhost:5433/kotonoha_test`
  - `KOTONOHA_PRINCIPAL_ID` — optional; echoed by `/api/health` (RBAC wiring in M7-b)

## Development

```bash
npm install
# terminal 1
npm run dev -w server
# terminal 2
npm run dev -w web
```

Open http://localhost:5173 (API proxied to port 8787).

## Roadmap

| Milestone | Issue |
| --- | --- |
| M7-a | [#142](https://github.com/zyx-corporation/kotonoha-management/issues/142) — this scaffold |
| M7-b | [#143](https://github.com/zyx-corporation/kotonoha-management/issues/143) — deltas + M6 export |
| M7-d | [#145](https://github.com/zyx-corporation/kotonoha-management/issues/145) — UI quality + E2E |

Spec (draft): [`37_m7_team_mode_ui_spec_draft.md`](https://github.com/zyx-corporation/kotonoha-management/blob/main/docs/37_m7_team_mode_ui_spec_draft.md).

## License

Apache-2.0
