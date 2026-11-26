# Runtime

Docs: `node_modules/next/dist/docs/index.md`. Auth/locale paths: [boundaries](boundaries.md), [i18n](i18n.md).

## Async APIs

`params`, `searchParams`, `cookies()`, `headers()` are async — await in server code; `React.use()` in client. Repo pattern: await in Suspense child ([layout](layout.md)).

## Cache Components

`cacheComponents` + `partialPrefetching` in `next.config.ts` — keep cookies/headers/searchParams in narrowest Suspense boundary. `"use cache"` only after reading bundled caching doc. Prefer current `revalidateTag` / `refresh` APIs from docs.

## Proxy

Root `proxy.ts` exports `proxy` if needed. Not locale prefix, not record auth. No `middleware.ts`.

## Performance

- `"use client"` on screens only; named Tabler imports (`optimizePackageImports`).
- Slow IO in async Suspense child; parallel fetches when possible.
- `next/link` in-app; single top loader in `providers.tsx`.
- Fat client props and extra layout client boundaries — avoid.
- Ship: `npm run build`; optional `ANALYZE=true npm run build`.

Fetching rules: [data](data.md).
