# Portal (record session)

**Status:** not on disk — normative contract until `modules/portal/` lands. Replace *TBD* in the same PR as implementation.

[placement](placement.md) · [data](data.md) · [slicing](slicing.md)

## Role

In-memory **record collections** for the signed-in session (demo or optimistic UI before API). Not a second server database. Not cross-tab sync unless you add it explicitly.

## Ownership

| Piece | Owner |
| ----- | ----- |
| Provider, context, hooks | `modules/portal/` only |
| Record shape, `createX`, fixtures | `modules/<product>/features/<slice>/domain/` |
| Persist to API | `modules/<record>/actions.ts` ([data](data.md#write-door)) |

Portal imports a feature **`index.ts` or `domain/` only** — never that feature’s `ui/`.

## Intended surface (*TBD* → name in code PR)

```text
modules/portal/
  provider.tsx          # wrap in app/providers.tsx when workspace exists
  context.ts            # PortalContext value type
  use-portal.ts         # usePortal() — read + session mutations
  register.ts           # registerRecordModule({ key, ... }) at module init
```

**`usePortal()`** (client screens only):

- Returns accessors per registered record key (e.g. list by `projectId`, get by id).
- Updates go through portal methods so one code path owns collection mutation.
- After API persist succeeds, action or screen syncs portal from server response — do not fork state in the screen.

**Registration** (when a record module loads):

- Record module calls `registerRecordModule` with `key`, empty initial state factory, optional serializers.
- Checklist: [slicing](slicing.md) — “portal register if portal/ exists”.

## Rules

- One primary in-memory source per screen ([data](data.md)); portal is that source when present.
- Do not pass full record arrays as server props; pass ids and labels.
- Vitest: seed via fixtures + test-only portal wrapper if needed — no duplicate store in tests.

When `modules/portal/` exists: update this file’s *TBD* block with real export names and remove **Status: not on disk**.
