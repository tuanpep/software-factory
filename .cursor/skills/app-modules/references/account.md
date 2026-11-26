# Account (auth + HTTP)

**Status:** not on disk — `keycloak-js` is in `package.json`; wire-up lives in `modules/account/` when workspace starts. Replace *TBD* in the same PR as implementation.

[placement](placement.md) · [boundaries](boundaries.md) · env: `app/env.ts`

## Role

Session identity and **server-side** authenticated fetch. Every entry point re-checks auth ([boundaries](boundaries.md)) — layout chrome is not enough.

## Ownership

```text
modules/account/
  lib/session.ts        # getSession() for server components, actions, route handlers
  lib/api-fetch.ts      # apiFetch — only HTTP client for app API
  components/           # optional client OIDC/login UI ("use client")
```

| Consumer | Uses |
| -------- | ---- |
| `actions.ts`, `route.ts` | `getSession()` then `apiFetch` |
| TanStack `queryFn` | `apiFetch` URL or thin route — never raw user URLs |
| Client login redirect | `keycloak-js` only inside `modules/account/components/` |

## Env (*TBD* names when Keycloak is configured)

Add server (and only safe client) vars via **`app/env.ts`** + Zod — never ad hoc `process.env`. No `NEXT_PUBLIC_` for secrets. Document in `.env.example` in the same PR.

Typical server keys (adjust to your IdP): issuer, client id, client secret, internal API base URL.

## `apiFetch` contract (*TBD* signature in code PR)

- Runs on server (imported from actions/routes) or from client only if wrapped as a Route Handler — prefer server action + revalidate for mutations.
- Attaches credentials from `getSession()`; maps 401/403 to explicit return types or `notFound()` at page level — no silent anonymous fallback in production.
- Tests mock **`apiFetch`** at module boundary ([testing](testing.md)).

## Keycloak

- Browser: `keycloak-js` init/login/logout in account components; tokens stay out of client props to record screens.
- Server: validate session for RSC and Server Actions independently of client Keycloak state.

No production E2E auth bypass in env ([boundaries](boundaries.md)).

When `modules/account/` exists: update this file with real exports and env keys; remove **Status: not on disk**.
