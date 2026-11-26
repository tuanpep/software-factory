# Routes and record shape

[placement](placement.md) · [baseline](baseline.md) · stack: layout → page → module screen.

## Routes

- Route group `(workspace)` = shared chrome; not per feature. Second group only for a second shell.
- Page: Suspense + inner async child awaits `params`, one `modules/` screen. No `page-client.tsx`.

```tsx
export default function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <Suspense fallback={<RecordPageSkeleton />}>
      <Content params={params} />
    </Suspense>
  );
}
```

Invalid id before paint → `notFound()` in page when siblings do. `proxy.ts` optional; no `middleware.ts` ([runtime](runtime.md)).

## Errors

| Expected (validation, 404, forbidden) | Unexpected (bugs) |
| --------------------------------------- | ----------------- |
| Return values, `notFound()`, inline UI  | `error.tsx`, `global-error.tsx` |

Validation in actions: return errors, do not throw. Event-handler errors are not caught by error boundaries.

`not-found.tsx` / segment `error.tsx` in workspace when routes grow. Empty states: short copy + one action (root `AGENTS.md`).

## Feature slice

One product module composes slices. App Router stays the route table.

```text
modules/<product>/
  data/                         # only when ≥2 slices share client state
  features/<slice>/
    ui/                         # *-list.tsx, *-detail.tsx, *-form.tsx
    domain/                     # types, fixtures, search-params, pure rules
    data/                       # this slice's client state, when it has any
    api/                        # HTTP only — omit until a client exists
    index.ts                    # domain/data the outside may call
    actions.ts                  # server I/O only ([baseline](baseline.md#write-path))
```

Forms: [forms](forms.md). Lists: nuqs parsers in `domain/search-params.ts` → plain rows → shared list UI when it exists.

Loading UI: `*-skeleton.tsx` in the slice `ui/`, or `modules/ui/components/` when **two** slices share it.

## When a feature grows

| Signal | Action |
| ------ | ------ |
| Second job in `domain/` or `data/` | New file in that same folder |
| Hook: 1 vs 2 callers | Beside the screen in `ui/` → `data/` (no `hooks/` folder) |
| Two views, one URL | Extra file in `ui/` |
| Network in logic | `api/` or `actions.ts`; pure stays `domain/` |
| UI prop needs a slice type | Move UI into that slice |
| Second slice needs the helper | Module `data/` or `domain/` |

Kebab-case files; PascalCase export. Mantine + `pajamas.module.css`; CSS module only if Mantine cannot.
