---
name: app-modules
description: >-
  Thin App Router pages and modules/<product>/features/<slice> layout (ui, domain, data): placement authority, import
  boundaries, folder depth, record modules, portal, RSC reads/writes, workspace
  shell, Mantine screens, TanStack Query, nuqs, next-intl, Vitest, Playwright.
  Use when adding or moving code in app/, modules/, lib/, messages/, refactoring
  structure, or when the user mentions placement, slicing, portal, or anti-patterns.
paths:
  - "apps/web/app/**"
  - "apps/web/modules/**"
  - "apps/web/lib/**"
  - "apps/web/e2e/**"
  - "apps/web/messages/**"
  - "apps/web/test-utils/**"
  - "apps/web/__tests__/**"
  - "apps/web/vitest.config.ts"
  - "apps/web/playwright.config.ts"
  - "apps/web/theme.ts"
  - "apps/web/next.config.ts"
  - "apps/web/proxy.ts"
---

# App modules (placement & boundaries)

Next API → `node_modules/next/dist/docs/index.md` (root `AGENTS.md`). **Structure and placement → this skill.** Copy tone and empty states → root `AGENTS.md`. Shell IA → [gitlab-pajamas](../gitlab-pajamas/SKILL.md).

`paths` globs attach this skill on those trees; they are not endorsements (e.g. no root `components/` — [placement](references/placement.md)).

## Task routing

Read [baseline](references/baseline.md) and [placement](references/placement.md) once per task, then **only** what applies:

| Task | References |
| ---- | ---------- |
| New route or page | [layout](references/layout.md), [i18n](references/i18n.md), [review](references/review.md) |
| New record module | [slicing](references/slicing.md), [layout](references/layout.md), [data](references/data.md), [boundaries](references/boundaries.md), [baseline](references/baseline.md) |
| List + URL filters | [data](references/data.md), [layout](references/layout.md), [testing](references/testing.md) |
| Form + validation | [forms](references/forms.md), [boundaries](references/boundaries.md) |
| Shell / nav / chrome | [ui](references/ui.md), gitlab-pajamas, [placement](references/placement.md) |
| Cache, params, proxy | [runtime](references/runtime.md) |
| Portal / in-memory records | [portal](references/portal.md), [data](references/data.md), [slicing](references/slicing.md) |
| Auth, apiFetch, session | [account](references/account.md), [boundaries](references/boundaries.md) |
| Structure review / refactor depth | [architecture](references/architecture.md), [placement](references/placement.md) |
| Monorepo / packages | [ecosystem](references/ecosystem.md) only |
| Golden slice (example) | [examples](references/examples.md) |
| Skill / baseline upkeep | [maintain](references/maintain.md) |
| Commit (user asks) | [commits](references/commits.md) |

## Read order (full pass)

1. [baseline](references/baseline.md) — what exists; write path by stage  
2. [placement](references/placement.md) — **authority** for paths and imports  
3. Topic ref from routing table ([architecture](references/architecture.md) for structure audits)  
4. [review](references/review.md) before merge  

## References

| Topic | File |
| ----- | ---- |
| Depth, anti-patterns (index) | [architecture](references/architecture.md) |
| Paths, imports (authority) | [placement](references/placement.md) |
| Starter / workspace facts | [baseline](references/baseline.md) |
| End-to-end slice | [examples](references/examples.md) |
| New record module | [slicing](references/slicing.md) |
| Routes, record shape, errors, growth | [layout](references/layout.md) |
| Zod + Mantine forms | [forms](references/forms.md) |
| Auth, RSC, reads/writes, security | [boundaries](references/boundaries.md) |
| Fetch, Query, URL state | [data](references/data.md) |
| Portal (session records) | [portal](references/portal.md) |
| Auth, apiFetch | [account](references/account.md) |
| Params, cache, proxy, perf | [runtime](references/runtime.md) |
| Mantine, theme, a11y | [ui](references/ui.md) |
| Copy, locales | [i18n](references/i18n.md) |
| Vitest, Playwright | [testing](references/testing.md) |
| Monorepo triggers | [ecosystem](references/ecosystem.md) |
| Merge checklist | [review](references/review.md) |
| Commits (when user asks) | [commits](references/commits.md) |
| Skill maintenance | [maintain](references/maintain.md) |

## Commands

From `apps/web/`: `npm run dev` (4202) · `npm run check` · `npm run test:e2e`

Paths below (`app/`, `modules/`, `lib/`, `theme.ts`) are relative to `apps/web/`.

## Stack

Next.js 16, React 19, RSC, Mantine, Tabler, Zod 4 (`zod/v4`), `@mantine/form`, TanStack Query (`lib/query/`, `app/providers.tsx`), nuqs, next-intl (cookie). `app/env.ts`. `cacheComponents` + `partialPrefetching`.

No extra HTTP client, global client store, RHF, `@gitlab/ui`, or `src/` / `packages/` / root `components/` until a screen or [ecosystem](references/ecosystem.md) forces it.
