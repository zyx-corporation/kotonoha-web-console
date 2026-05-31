# kotonoha-web-console Priority Boundary

## Status

**Informative — implementation mirror.** Canonical boundary document:

→ **[`kotonoha-spec` `docs/web-console-priority-boundary.md`](https://github.com/zyx-corporation/kotonoha-spec/blob/main/docs/web-console-priority-boundary.md)**

If this summary disagrees with that document or normative `kotonoha-spec` text, **spec wins**.

## Tier

**Expansion layer / non-primary UI.**

| Primary surface | Repository |
| --- | --- |
| First usable UI | `obsidian-kotonoha-console` |
| First stable runtime | `kotonoha-cli` |
| Normative source | `kotonoha-spec` |
| This repo | Read-only dashboards, viewers, demo — **not** primary UI |

## Quick reference (#165)

| MAY | MUST NOT |
| --- | --- |
| Display project / principal / RDE / sidecar records (read-only) | Become first usable UI |
| Dashboards and demo flows | Replace Obsidian authoring workflows |
| Stable orchestrator adapters (`/health`, `/v1/agents`, `/v1/rde/evaluate`) | Define normative schemas or RDE semantics |
| Delegate writes to `kotonoha` CLI | Depend on `/v1/proposals/generate` as stable UX |
| | Web-console-only sidecar formats |
| | Silent mutation of project records |
| | Source of truth for project identity |

## Responsibility split

- **RDE semantics** → `kotonoha-spec`
- **HTTP envelope** → `kotonoha-orchestrator` ([API stability boundary](https://github.com/zyx-corporation/kotonoha-spec/blob/main/docs/orchestrator-api-stability-boundary.md))
- **UI display** → this repo
- **Authoring + apply loop** → Obsidian Console
- **Writes / export** → CLI

## Current M7 scope (allowed)

- Read-only project and delta views
- M6 export via CLI delegation ([m4-boundary-verification.md](m4-boundary-verification.md))
- Principal RBAC via `KOTONOHA_PRINCIPAL_ID`

Write-capable web workflows require a boundary revision after [#166](https://github.com/zyx-corporation/kotonoha-management/issues/166).

## Before opening a web-console PR

1. Does this promote web-console to **primary** UI? → defer.
2. New field **meaning**? → `kotonoha-spec` issue first.
3. Requires experimental orchestrator routes as stable? → reject.
4. Writes without CLI/spec path? → reject for current phase.

## Related

| Document | Role |
| --- | --- |
| [web-console-priority-boundary.md (spec)](https://github.com/zyx-corporation/kotonoha-spec/blob/main/docs/web-console-priority-boundary.md) | Canonical boundary |
| [m4-boundary-verification.md](m4-boundary-verification.md) | M4 read-only / CLI-delegation checks |
| [README.md](../README.md) | Dev setup |

Governance: [kotonoha-management #165](https://github.com/zyx-corporation/kotonoha-management/issues/165)
