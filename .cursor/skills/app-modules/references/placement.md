# Placement (authority)

If another reference disagrees, this file wins.

Next.js binding of DX FE DevKit vertical slices. Stock kit folders that do not apply here: module `routing/` (App Router files are the route table) and UI barrels (a barrel of `"use client"` screens pulls the client graph into server pages).

## Decision tree

```text
New code?
├─ URL, layout, loading, error → app/ (thin page imports one ui screen)
├─ Copy → messages/en.json + vi.json
├─ Interactive screen → modules/<product>/features/<slice>/ui/ ("use client" on screen)
├─ Pure rules, parsers, fixtures, Zod → features/<slice>/domain/
├─ Client/session state for one slice → features/<slice>/data/
├─ Same state for ≥2 slices in the product → modules/<product>/data/
├─ HTTP client for one slice → features/<slice>/api/ (skip the folder until it exists)
├─ Shared chrome (plain props only) → modules/ui/components/
├─ Auth, apiFetch, action session → modules/account/
├─ Cross-record session store → modules/portal/
├─ Project catalog, breadcrumbs → modules/projects/
├─ Unit tests → beside source (*.test.ts / *.test.tsx)
├─ App lib unit tests → __tests__/ at apps/web root
├─ Test wrappers → test-utils/
└─ Feature-agnostic, no modules import → lib/
```

Pick the innermost layer that does not import outward. Depth budget and anti-pattern index: [architecture](architecture.md).

## Import matrix

```text
ui     →  domain, data, modules/ui, lib
data   →  domain, api
api    →  domain
domain →  domain only
app    →  features/<slice>/ui/<screen> and, for server lookups, features/<slice> index
feature →  sister feature index.ts only (domain/data exports — never ui/)
portal  →  feature index or domain/ (not ui/)
account, modules/ui, lib → not feature ui/domain, not app
```

Example: follow may import `getMockRun` from `@/modules/factory/features/runs`. It must not import `@/modules/factory/features/runs/ui/run-detail`.

Inside a feature: relative imports, not through its own `index.ts`. Across features: `@/`. `index.ts` re-exports domain or data only, and only when a sister feature or a server page needs that symbol. App pages import the screen file directly.

## Never add

`src/`, `pages/`, `packages/`, `common/`, `shared/`, root `components|hooks|actions`, `middleware.ts`, `[locale]`, second HTTP client, second QueryClient, Redux/Zustand.

URL `bugs` → `modules/<product>/features/bug-reports`. Params: `[projectId]`, `[bugId]`.

Slices (when present): `bug-reports`, `help`, `feature-requests`, `feedback`, `guides`, `discussions` — inside the product that owns them, not as extra top-level modules.

## Reject (fix immediately)

| Pattern | Fix |
| ------- | --- |
| Domain logic in `page.tsx` | Screen in `modules/` |
| Layout as sole auth gate | Page + action + route each check |
| Feature ui imports another feature's ui or domain file | Sister `index.ts`, or module `data/` when ≥2 slices share it |
| Same write in action and route | One door ([data](data.md#write-door)) |
| Feature type in `modules/ui` props | UI in the owning feature |
| One-widget feature | Colocate in the parent slice |
| `domain/<a>/<b>/` or `api/` trees with no HTTP | Flat files in `domain/` ([architecture](architecture.md#depth-budget)) |
| `hooks/`, `services/`, `utils/`, `components/` under a feature | `ui/`, `domain/`, or `data/` ([layout](layout.md#when-a-feature-grows)) |
| UI re-exported from `index.ts` | Direct `ui/<screen>` import from `app/` |
| Fat logic in `app/**/page.tsx` | Thin page + feature `ui/` screen |
| Shared UI with domain enums/types in props | Move UI into the feature |

Tests may import other features' **fixtures** only ([testing](testing.md)).
