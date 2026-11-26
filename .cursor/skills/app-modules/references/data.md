# Data and state

[placement](placement.md) · [boundaries](boundaries.md) · cache [runtime](runtime.md)

One primary source per screen — do not duplicate record arrays.

| Need | Use |
| ---- | --- |
| Server params/session | Async child under Suspense in page |
| In-memory records | `usePortal()` ([portal](portal.md), [baseline](baseline.md)) |
| List filters in URL | nuqs in `features/<slice>/domain/search-params.ts` |
| API after hydration | TanStack Query; `queryFn` → `apiFetch` or route URL |
| Persisted mutation | [Write door](#write-door) below |

## Write door

One primary path per mutation — do not duplicate the same persist in both.

| Use | When |
| --- | ---- |
| `modules/<feature>/actions.ts` | Form submit, revalidate, app mutations, Server Actions from screens |
| `app/api/**/route.ts` | Webhooks, downloads, non-React clients, explicit REST surface |

Same rule in both: Zod parse, auth, then I/O. Pick one file per operation.

## TanStack Query

`lib/query/get-query-client.ts` + `app/providers.tsx`: browser singleton, new client per server request, `staleTime` 60s. **Never** Server Action as `queryFn`. Add `HydrationBoundary` only if you prefetch on server.

## State stores (allowed)

| Store | For |
| ----- | --- |
| Portal | Record collections (when exists) |
| nuqs | Sharable filters |
| `useState` | Form draft, ephemeral UI |
| Query | Server-backed reads |
| Cookie `DX_LOCALE` | Locale only |

No Redux/Zustand/second QueryClient.

## Server fetch

Parallel independent awaits; missing data → `notFound()` not throw. No Route Handler round-trip from RSC. Fresh request data: Suspense, not `"use cache"` on that subtree.

Mock tests at `apiFetch` ([testing](testing.md)).
