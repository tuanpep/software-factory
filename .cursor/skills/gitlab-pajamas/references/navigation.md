# Navigation

From [Pajamas Navigation sidebar](https://design.gitlab.com/regions/navigation).

The navigation sidebar is the persistent **left** region for moving between application sections. Changes to it are high-impact; keep structure familiar.

This repo follows **GitLab project IA** (left sidebar for modules). GitHub’s **UnderlineNav** repo tabs are a different product chrome — do not mix both as primary module switchers.

## Information architecture

| Need                                      | Pattern                                                 | Example                                                            |
| ----------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------ |
| Different product job / workspace section | **Left sidebar** `NavLink`                              | Bug Reports, Help, Feature Requests, Feedback, Guides, Discussions |
| Facet of the same list or workspace       | **In-page tabs** (`ModuleTabs`)                         | Open / Closed; Needs review / All                                  |
| Settings-style section index              | **In-page vertical nav** (`PageFrame` pane / `NavLink`) | Settings → Identity, Responsibilities                              |
| Transient secondary task                  | **Drawer / modal**                                      | Confirm archive; quick triage note                                 |

### Decision rules

1. Changes the **job** the user is doing → sidebar.
2. Same job, different **slice of the same data** → in-page tabs (URL via `nuqs` when bookmarkable).
3. Many sibling admin sections that stay on one route → vertical inner nav, not sidebar children and not a second tab row stacked under module tabs.
4. Never add a **third sidebar level**. Use page content, tabs, filters, or progressive disclosure instead.
5. Do not put the same destinations in both the sidebar and a top module tab bar.

## Structure

Vertical navigation by **product context** (GitLab inventory; GitHub keeps repo modules only inside a repo):

- Header area stays stable
- **Home context:** Home + project entry list. Never invent a default project to host Overview, Support, Ideas, Guides, or Discussions.
- **Project context:** Home + stable module list (Overview, Support, Ideas, Guides, Discussions). Support and Ideas each have two sub-items. Items do not change while navigating those modules; the project switcher only changes destinations.
- Item names: short, memorable — ideally **1–2 words**
- **Two levels only:** top-level + sub-level. No third level

### Top-level items

- Unique icon or avatar
- May own a group of sub-items
- Naming and position stay consistent across similar contexts (e.g. all projects)

### Sub-level items

- Reflect their top-level parent
- Do not invent a third nesting level; use page content, tabs, or progressive disclosure instead

### In-page tabs

- Place as `PageHeader` children via `ModuleTabs`, directly above the content they affect
- Keep labels short; optional counts are fine
- Prefer **URL-backed** values (`?view=`, `?tab=`) for shareable list facets
- Tab panels that only swap local UI (e.g. Record vs Log) still benefit from URL sync when the view is deep-linkable
- Finer filters (search, status `Select`) sit in `CollectionToolbar` **below** the tabs
- Avoid stacking two horizontal tab bars for hierarchy; raise the higher level to the sidebar or a vertical inner nav

## Behavior

- Always available unless navigation is not needed → then use a **minimal** layout without nav chrome
- User preference (visible/hidden) may persist (e.g. cookie); still show nav when required to complete a task
- When hidden: reveal from left edge or sidebar control as an overlay; user can pin/lock or navigate without destroying page content
- Pinned items may persist important links across contexts when that pattern exists

## Breakpoints

| Viewport                   | Sidebar                                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **≥ 1200px** (extra large) | Visible by default; user may hide for focus                                                                   |
| **≤ 1199px**               | Hidden by default; opens as overlay over content; do not treat overlay-open as a lasting “visible” preference |

One vertical sidebar keeps breakpoint logic simple.

## Breadcrumbs (companion)

Almost every page (except sign-in/register) should show hierarchy. Breadcrumbs complement the sidebar; they do not replace it. Last item remains a **link** with `aria-current="page"`. Use sentence case. For create flows, prefer “New \<thing\>” as the last crumb.

## Repo mapping

| Rule                | Here                                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| Left sidebar        | `AppShell.Navbar` in `workspace-shell.tsx`                                                     |
| Top-level modules   | Overview, Support (Bug Reports, Help), Ideas (Feature Requests, Feedback), Guides, Discussions |
| In-page module tabs | `modules/ui/components/module-tabs.tsx` as `PageHeader` children                               |
| Two-level max       | Do not nest NavLinks three deep; use `ModuleTabs` / filters / progressive disclosure           |
| In-page status tabs | `ModuleTabs` on a collection — not a third sidebar level                                       |
| Small screens       | Burger / collapse → overlay navbar                                                             |
| Minimal             | Only for flows that truly need no section nav                                                  |

Keep section labels short and aligned across projects so the product feels like one app.
