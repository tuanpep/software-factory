# Architecture (depth + anti-patterns)

Normative rules: [placement](placement.md). This ref explains **why** and gives measurable budgets.

## Two axes

| Axis | Healthy |
| ---- | ------- |
| **Folder depth** under `modules/` | Product, feature, one layer (`modules/factory/features/runs/ui/run-list.tsx`) |
| **Coupling depth** | Page → one screen → `domain` / `data`; sisters only through `index.ts` |

`app/` may be deeper because URLs mirror folders — keep `page.tsx` thin ([layout](layout.md)).

## Depth budget

```text
OK
  modules/<product>/features/<slice>/ui/<screen>.tsx
  modules/<product>/features/<slice>/domain/<concern>.ts
  modules/<product>/features/<slice>/data/<concern>.ts   # one slice's client state
  modules/<product>/data/<concern>.ts                    # ≥2 slices
  modules/<product>/features/<slice>/index.ts            # domain/data exports only
  app/(workspace)/.../page.tsx                           # composition only

Reject
  modules/<product>/features/<slice>/domain/<a>/<b>/     # nested domain trees
  hooks/ | services/ | utils/ | components/ at feature root
  index.ts that re-exports ui/
  routing/ inside the module (App Router already owns URLs)
  root utils/ | common/ | shared/                        # see placement Never add
```

When a layer grows: new **file** in that same folder ([layout](layout.md#when-a-feature-grows)). A second slice that needs the same pure helper moves it to module `data/` or `domain/` only after two slices use it. Do not add another folder level inside `domain/`.

## Dependency flow

```text
app → feature ui screen, feature index (server lookup), lib
feature ui → own domain/data, module data, modules/ui, lib
feature → sister index.ts only
modules/ui | lib | account → never feature ui/domain, never app
portal → feature index or domain/ only
```

Sideways record imports and shared importing features are the usual scalability failures. Details: [placement](placement.md#import-matrix).

## Anti-pattern index

| Smell | Fix | Ref |
| ----- | --- | --- |
| Junk drawer `shared` / `utils` / root `components` | Domain in `modules/`; generic in `lib/` | [placement](placement.md) |
| Layer-first repo (`hooks/`, `services/` at root) | Feature `domain/` or `ui/` | [placement](placement.md) |
| Micro-slice (one modal = one feature) | Colocate or meet [slicing](slicing.md) gates | [slicing](slicing.md) |
| Feature imports feature internals | Sister `index.ts` or module `data/` | [portal](portal.md), [data](data.md) |
| God screen (fetch + store + form + nav + analytics) | Split by **reason to change**, not JSX size | [layout](layout.md), [ui](ui.md) |
| Boolean prop explosion on shared UI | Feature-owned UI or plain props in `modules/ui` | [ui](ui.md) |
| `index.ts` re-exports screens | App imports `ui/<screen>` directly | [placement](placement.md) |
| Server Action as `queryFn` | `apiFetch` / route URL | [data](data.md) |
| Second global client store | portal + nuqs + Query + local state only | [data](data.md) |
| Premature `packages/` | Single app until [ecosystem](ecosystem.md) trigger | [ecosystem](ecosystem.md) |

## Cohesion rules

- Group by **user job** under `features/<slice>/`, then by layer (`ui`, `domain`, `data`) ([slicing](slicing.md)).
- Promote to module `data/` / `domain/` or `modules/ui` only after **two** slices need the same thing ([ui](ui.md), [boundaries](boundaries.md)).
- Keep each layer flat. URL depth lives in `app/`, not in `domain/validators/email/`.

## Scale

Default: one Next app + `modules/`. Evolution steps: [ecosystem](ecosystem.md). Future automated import law (eslint-boundaries, dependency-cruiser) should mirror [placement](placement.md) — optional, not in starter.
