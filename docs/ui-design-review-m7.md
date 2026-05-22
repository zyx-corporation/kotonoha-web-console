# M7 UI design review — Web Console

**Normative checklist:** [kotonoha-management `32` §2.2](https://github.com/zyx-corporation/kotonoha-management/blob/main/docs/32_milestone_ui_quality_gates_draft.md)

**Spec:** [`37_m7_team_mode_ui_spec_draft.md`](https://github.com/zyx-corporation/kotonoha-management/blob/main/docs/37_m7_team_mode_ui_spec_draft.md)

**Parent:** [management#139](https://github.com/zyx-corporation/kotonoha-management/issues/139) · **M7-d:** [#145](https://github.com/zyx-corporation/kotonoha-management/issues/145)

| Field | Value |
| --- | --- |
| **Date** | 2026-05-22 |
| **Reviewer** | M7 implementation walkthrough |
| **Console version** | 0.1.0 (web + server) |
| **Judgment** | **Pass with notes** |

## D1 — Information design

| Result | Notes |
| --- | --- |
| **Pass** | Sections separate **Projects**, **Meaning deltas**, and **Audit export (M6)**. Project scope is explicit via selector + UUID hint. |

## D2 — Operation flow

| Result | Notes |
| --- | --- |
| **Pass** | Read-only E2E: select project → refresh deltas → (optional git filter) → fetch M6 export → download JSON. No write path in M7. |

## D3 — Accountability boundary

| Result | Notes |
| --- | --- |
| **Pass with notes** | Console is **viewer/audit** oriented; human review actions remain in VS Code / CLI. Banner when `KOTONOHA_PRINCIPAL_ID` unset clarifies server-side actor. |

## D4 — Error experience

| Result | Notes |
| --- | --- |
| **Pass** | API errors surface in alert region; principal-required banner distinguishes config vs data errors. Export failures include CLI stderr hint (403/502). |

## D5 — Wireframe alignment

| Result | Notes |
| --- | --- |
| **Pass with notes** | No formal wireframe for M7; aligned with [`37` §3](https://github.com/zyx-corporation/kotonoha-management/blob/main/docs/37_m7_team_mode_ui_spec_draft.md) table. Intentional: minimal styling (system fonts), no IdP login screen (env-based dev auth). |

## Follow-up (Pass with notes)

- Production IdP / SSO out of scope ([`37` §2](https://github.com/zyx-corporation/kotonoha-management/blob/main/docs/37_m7_team_mode_ui_spec_draft.md)).
- Default API port **8790** (avoids `kotonoha-gateway` on 8787).
