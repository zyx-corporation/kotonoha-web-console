# M7 Web Console — acceptance procedure

**Parent:** [management#139](https://github.com/zyx-corporation/kotonoha-management/issues/139) · **Quality gates:** [management `32`](https://github.com/zyx-corporation/kotonoha-management/blob/main/docs/32_milestone_ui_quality_gates_draft.md)

## Automated

```bash
export DATABASE_URL=postgres://kotonoha:kotonoha@localhost:5433/kotonoha_test
npm test
```

- `web/test/i18n-parity.mjs` — `ja` / `en` key parity
- `server/test/m7-project-isolation.mjs` — two principals, isolated project lists + deltas

## Manual (i18n)

1. `npm run dev -w server` with `KOTONOHA_PRINCIPAL_ID` + `DATABASE_URL`
2. `npm run dev -w web` → http://localhost:5173
3. Switch **Language** to English → exercise: project select, refresh deltas, export
4. Switch to **日本語** → repeat same operations

## Design review

Record: [`ui-design-review-m7.md`](ui-design-review-m7.md)

## Port note

Dev API defaults to **8790** (not 8787) to avoid collision with [`kotonoha-gateway`](https://github.com/zyx-corporation/kotonoha-gateway).
