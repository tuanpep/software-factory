# Scale (monorepo)

[placement](placement.md) · [architecture](architecture.md) · [baseline](baseline.md). Industry `features/` ≈ `modules/<product>/features/`.

**Default:** single Next app with `modules/`. No `apps/*` or `packages/*` until a **second deployable** or **two consumers** of the same domain code.

## Mapping (external → here)

| At scale | Here |
| -------- | ---- |
| Thin `apps/web/app` | `app/(workspace)/**/page.tsx` |
| `packages/features/*` | `modules/<product>/features/<slice>/` |
| `packages/ui` | `modules/ui/` |
| Auth package | `modules/account/` |
| tRPC BFF | `actions.ts` + `route.ts` |

## Do not add until trigger

| Avoid | Trigger |
| ----- | ------- |
| Monorepo | Second Next app in repo |
| `packages/features` workspaces | Same domain in two deployables |
| tRPC package | Huge internal API surface |
| `src/`, root `components/`, `pages/` | — never for new work |

## Evolution (stop when pain is gone)

```text
1. Split a fat slice into `ui/` and `domain/` ([layout](layout.md))
2. Shared types → module `domain/` after two slices need them
3. Live API → feature actions.ts + apiFetch
4. proxy.ts when redirects are real
5. Turborepo only after portal/modules strain (step 7 in old playbooks = last resort)
```

Refs: [Cal.com](https://github.com/calcom/cal.com), [next-forge](https://www.next-forge.com/docs), [Next structure](https://nextjs.org/docs/app/getting-started/project-structure).
