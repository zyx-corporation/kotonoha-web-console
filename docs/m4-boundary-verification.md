# M4 boundary verification — Web Console

**Issue:** [kotonoha-management #143](https://github.com/zyx-corporation/kotonoha-management/issues/143) context · **tracking:** [kotonoha-web-console #3](https://github.com/zyx-corporation/kotonoha-web-console/issues/3)

| Check | Result |
| --- | --- |
| Read-only UI; writes via `kotonoha` CLI only | **Pass** |
| M6 export delegates to CLI (`export --format m6`) | **Pass** |
| `KOTONOHA_PRINCIPAL_ID` RBAC on API | **Pass** |
| Not normative SLS wire protocol ([SLS-9.11](https://github.com/zyx-corporation/kotonoha-spec/blob/main/docs/phase2-interchange-hardening.md#sls-911-out-of-scope-for-phase-2)) | **Pass** |
| Default API port **8790** (not gateway **8787**) | **Pass** |

**Judgment:** **Pass** — remain implementation/audit surface through M4 completion.
