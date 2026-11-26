# Slicing

[placement](placement.md) · [baseline](baseline.md#scaffold-order-workspace) · record shape [layout](layout.md#record-feature)

Create `modules/<product>/features/<slice>/` only when ([architecture](architecture.md) — avoid micro-slices):

1. Distinct record type in `domain/`
2. List, detail, or form route (usually all three)
3. Copy in the product `messages` namespace (`en` + `vi`)

Else: parent slice `ui/`, or `modules/ui/` when the widget is chrome. A new `modules/<product>/` is a second product, not a second screen.

Merge when same record was split by mistake. Cross-imports → portal first, not merge by default.

## Checklist

```text
- [ ] placement decision tree
- [ ] layout record shape + thin app page
- [ ] imports matrix
- [ ] en + vi messages
- [ ] portal register if portal/ exists ([portal](portal.md))
- [ ] npm run check
```

Monorepo: [ecosystem](ecosystem.md) before `packages/`.
