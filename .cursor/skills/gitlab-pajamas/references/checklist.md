# Checklist — Principles · Layout · Navigation

## Principles

- [ ] Natural flow: related next steps stay in context
- [ ] Simple path works without advanced options exposed
- [ ] Advanced actions use clear disclosure triggers (≤2 levels)
- [ ] Patterns match sibling features (labels, filters, empty states, tab sets)
- [ ] Loading feels progressive; chrome stays usable

## Layout

- [ ] Chrome vs static panel vs transient overlay is clear
- [ ] Side surface is panel (persistent) or drawer/modal (transient) — correctly chosen
- [ ] DOM / focus order matches visual order
- [ ] No unnecessary nested cards inside the main panel
- [ ] Truncation has a full-text affordance
- [ ] Sticky regions are sparse and elevated
- [ ] Focus moves into overlays and returns to the trigger

## Navigation

- [ ] Left sidebar ≤ 2 levels
- [ ] Labels short (ideally 1–2 words)
- [ ] Home has no project modules and no default project id
- [ ] Inside a project, module list stays stable across module routes
- [ ] Top-level order/names consistent across projects
- [ ] Module switching uses the sidebar — not a duplicate top tab bar
- [ ] Same-module facets use in-page `ModuleTabs` (URL-backed when shareable)
- [ ] Tabs sit under `PageHeader`, above list toolbars / content
- [ ] No stacked horizontal tab bars for hierarchy
- [ ] ≥1200px: sidebar usable without fighting the content
- [ ] ≤1199px: sidebar overlays; primary content not permanently squeezed
- [ ] Breadcrumbs (or equivalent) on nested pages; last crumb is a link with `aria-current="page"`
- [ ] No third nav level smuggled via nested menus that behave like IA
