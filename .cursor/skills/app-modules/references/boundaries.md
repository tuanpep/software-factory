# Boundaries

[placement](placement.md) · [architecture](architecture.md) · writes: [baseline](baseline.md#write-path) · data: [data](data.md)

Each entry point auth/checks independently.

| Entry | Does | Does not |
| ----- | ---- | -------- |
| Layout | Chrome | Authorize records |
| Page | `params`, `notFound()`, pass ids | Own lists/forms/store |
| `lib/` | Pure `createX` | React, fetch |
| `actions.ts` / `route.ts` | One write door | Trust page auth; duplicate same write |
| Client screen | `usePortal()` when present ([portal](portal.md)) | Secrets, `server-only` |

RSC: pages/layouts server; `"use client"` on module screens only.

**Client props** — ids, labels, plain rows OK. Never tokens, session, raw API blobs.

**Forms** — Zod on server always; client optional. Expected errors as return values.

**HTTP** — `apiFetch` only (when `account/` exists — [account](account.md)). No user-controlled fetch URLs.

**Env** — `app/env.ts` only; no `NEXT_PUBLIC_` secrets; no production E2E bypass.

**Reads** — portal or Query/server helper per [data](data.md). Shared types stay in the owning `domain/` until two slices need them, then module `domain/` or `data/`.

**Writes** — pure in `state.ts`; door validates + auth. No root `actions/`. No sensitive GET routes.

No `middleware.ts`; locale cookie only ([i18n](i18n.md)).
