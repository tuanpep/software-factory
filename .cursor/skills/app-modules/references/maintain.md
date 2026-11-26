# Maintain this skill

[baseline](baseline.md) · authority: [placement](placement.md)

## When to edit which file

| Change | Update |
| ------ | ------ |
| New `app/(workspace)/`, `portal/`, `account/`, first record module | [baseline](baseline.md) **Active stage** + Present/Absent tables |
| Path, import, forbidden-root, or depth rule | [placement](placement.md); index in [architecture](architecture.md) |
| Repeated structural mistake | One row in placement **Reject** or architecture index |
| New task type agents hit often | [SKILL.md](../SKILL.md) task routing + References table |
| Portal or auth behavior (once code exists) | [portal](portal.md) or [account](account.md) — **name real exports in the same PR as implementation** |
| Stack bump, new banned dependency, default port | [SKILL.md](../SKILL.md) Stack / bans + [baseline](baseline.md) if tree changes |
| First real module differs from fiction | [examples](examples.md) or add a short note in [slicing](slicing.md) |
| Merge gates | [review](review.md) |
| Monorepo decision | [ecosystem](ecosystem.md) |

Do not copy placement rules into other refs — link instead.

## PR habits

1. Platform milestone and code in **one PR**; baseline stage flip in that PR.
2. Implement `modules/portal/` or `modules/account/` → flesh out the stub contracts in [portal](portal.md) / [account](account.md) with actual file names and function names (replace *TBD* markers).
3. Run `npm run check`; e2e when [review](review.md) says so.

## Baseline honesty check (manual)

Before merge when `baseline.md` says **Workspace**:

```bash
test -d app/'(workspace)' || echo 'missing (workspace)'
test -d modules/portal || test -d modules/account || test -d modules/projects || \
  find modules -mindepth 1 -maxdepth 1 -type d ! -name ui | grep -q . || echo 'missing workspace module'
```

If output prints missing lines but stage is Workspace, fix baseline or add the paths.

## Scale without skill sprawl

- Sixth similar record module → no new skill file; follow [slicing](slicing.md) + [examples](examples.md).
- Second deployable in repo → [ecosystem](ecosystem.md) before `packages/`.
- Repeated agent mistake → one row in placement **Reject** or [architecture](architecture.md) index, not a new doc.
