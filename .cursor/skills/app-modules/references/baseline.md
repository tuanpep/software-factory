# Baseline (facts)

**Update when the repo tree changes.**

**App root:** `apps/web/` in the software-factory monorepo. Folder names in this skill are relative to that directory.

**Active stage:** `Workspace` — `app/(workspace)/` and `modules/factory/`.

## Present now

`app/` (layout, providers, env, `(workspace)` routes) · `lib/i18n`, `lib/query`, `lib/fonts` · `theme.ts`, `pajamas.module.css` · `modules/ui/components/` (shell) · `modules/factory/features/` (`runs`, `decisions`, `follow`, `inbox`, `configure`, `record`) with `ui/` + flat `domain/` · `modules/factory/data/workspace-session.ts` shared by decisions, follow, inbox, and pause · `messages` (`App`, `Factory`, `Settings`) · `test-utils/render.tsx` · `__tests__/` for lib-only units · port **4202** · `cacheComponents` + `partialPrefetching`

Session-local runs stay in `modules/factory/features/runs/domain/local-runs.ts` until a portal exists. Configure is one slice because models, providers, profiles, pause, budgets, and enrollment share operator settings. Run lookup used outside the slice is `getMockRun` from `modules/factory/features/runs/index.ts`.

## Absent until needed

| Path | When |
| ---- | ---- |
| `modules/account/` | Auth, `apiFetch` |
| `modules/portal/` | `usePortal()` records |
| `modules/projects/` | Catalog, breadcrumbs |
| `proxy.ts` | Redirects/headers last resort |

`modules/factory/` is the product module. The workspace shell stays in `modules/ui/components/app-shell.tsx` until a project catalog needs `modules/projects/`.

Normative rules: [placement](placement.md) even if folder missing.

## Write path

| Stage | Record writes |
| ----- | ------------- |
| Starter | `lib/i18n/actions.ts` only |
| Workspace + portal | Portal methods; `actions.ts` when persisting to API |

## Scaffold order (workspace)

`(workspace)` layout → `account`? → `projects`? → `portal`? → first record + routes → `en`/`vi` namespaces. Shell: [gitlab-pajamas](../../gitlab-pajamas/SKILL.md).

## Maintain

Same PR as new `portal/` or `(workspace)/`: update **Active stage** above. Bump Next: bundled upgrade doc + `npm run check` + e2e. New dependency: must not violate [SKILL.md](../SKILL.md) bans. Which ref to edit: [maintain](maintain.md). Portal/auth contracts: [portal](portal.md), [account](account.md).
