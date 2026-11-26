---
name: gitlab-pajamas
description: >-
  Applies GitLab Pajamas Principles, Layout, and Navigation when designing,
  building, or reviewing product UI. Use for sophisticated simplicity,
  progressive disclosure, page composition, application chrome, panels versus
  drawers, focus order, left sidebar information architecture, in-page tabs
  versus sidebar modules, breakpoints, breadcrumbs, workspace shells, or when
  the user mentions Pajamas, GitLab design, sidebar, tabs, drawers, or
  navigation.
---

# GitLab Pajamas — Principles · Layout · Navigation

Source: [Pajamas](https://design.gitlab.com/). Implement with this repo’s Mantine + `theme.ts` / `pajamas.module.css`. Do not add `@gitlab/ui` unless asked.

This product follows **GitLab’s IA**, not GitHub’s repo-tab chrome: large modules live in the **left sidebar**; facets of the same module use **in-page tabs**.

| Pillar                                 | Read when…                                                                      |
| -------------------------------------- | ------------------------------------------------------------------------------- |
| [Principles](references/principles.md) | Deciding product behavior, progressive disclosure, consistency, perceived speed |
| [Layout](references/layout.md)         | Changing chrome, panels, drawers, containers, focus, responsive regions         |
| [Navigation](references/navigation.md) | Sidebar vs tabs, nav depth, labels, breakpoints, minimal layout                 |
| [Checklist](references/checklist.md)   | Reviewing a screen against all three pillars                                    |

## Principles (summary)

Sophisticated simplicity. Ask before shipping:

1. **Natural developer flow** — Seamless task chains; no needless context switches.
2. **Start simple, reveal complexity** — Useful defaults; advanced features discoverable later.
3. **One product** — Same patterns, terms, and interactions across features.
4. **Feel instant** — Sub-second common paths; progressive / optimistic loading elsewhere.

## Layout (summary)

Page = **application chrome** + **panels** + content. Visual order matches DOM/focus order.

- Chrome: top bar (search, user), left sidebar, app nav; optional Duo controls.
- Panels (≤1 of each): **static** (primary) → optional **dynamic** (tied to static) → optional **Duo**.
- **Panel** = persistent workspace. **Drawer/modal** = transient secondary. Do not conflate.
- Inside panels: proximity + alignment; containers sparingly; progressive disclosure for support content.
- Media queries for chrome/panels; container width for content inside a panel.

## Navigation (summary)

Persistent **left sidebar**, scoped by product context (GitLab-style; not GitHub repo tabs):

- **Home / Your work** = enter projects (list projects). No project modules and no invented default project id.
- **Inside a project** = stable module list (Overview, Support with Bug Reports and Help, Ideas with Feature Requests and Feedback, Guides, Discussions). Same items while moving between those modules; switcher only changes the project.
- **In-page tabs** = facets of the same job (Open / Closed, Needs review / All). Prefer URL-backed tabs (`nuqs`).
- **Two levels only** in the sidebar (icon/avatar top-level + sub-items). Labels ideally **1–2 words**.
- Do **not** duplicate module switching as top horizontal tabs _and_ a module sidebar.
- **≥1200px**: sidebar visible by default (user may hide). **≤1199px**: hidden; opens as overlay.
- Prefer `minimal` layout only when nav is not useful.
- User-facing terms: top bar, left sidebar, \<context\> panel — not “chrome”, “nav”, or “AI panel”.

## Implement here

- Shell: `modules/projects/components/workspace-shell.tsx` (`AppShell` ≈ chrome + static panel).
- Module tabs: `modules/ui/components/module-tabs.tsx` as `PageHeader` children.
- Screens: `modules/<feature>/components/`; thin routes in `app/`.
- Prefer `AppShell`, `NavLink`, `ModuleTabs`, `Drawer`, `Modal`, `Breadcrumbs` over custom chrome.

## Docs

- [Principles](https://design.gitlab.com/get-started/principles/)
- [Layout](https://design.gitlab.com/product-foundations/layout/)
- [Navigation sidebar](https://design.gitlab.com/regions/navigation)
