# Layout

From [Pajamas Layout](https://design.gitlab.com/product-foundations/layout/).

Goals: clear hierarchy, predictability, utility.

## Framework

### Page composition

A **page** is everything in the viewport: application chrome + panels + content.

Chrome is constant. Panels adapt to context. Visual hierarchy must reinforce DOM order so keyboard and assistive tech stay predictable. Reflow must keep structural relationships.

### Application chrome

Lowest layer; themeable:

1. Global navigation and search
2. User actions / authentication
3. Application navigation (affects static panel)
4. AI / Duo navigation (only if that surface exists)

### Panel-based layout

Panels are structural workspace regions (persistent / co-primary), not overlays.

Up to one of each type open at once (1–3 total):

1. **Static panel** — primary context
2. **Dynamic panel** (optional) — tied to static; updates or removes with it; gone on navigate away
3. **AI / Duo panel** (collapsible) — intelligent assist

On small screens a panel may slide over primary content — still a panel, not a drawer.

### Panel vs drawer

|          | Panel                         | Drawer                       |
| -------- | ----------------------------- | ---------------------------- |
| Role     | Workspace region              | Transient side surface       |
| Duration | Persistent for the workflow   | Dismiss when done            |
| Content  | Co-primary / richer workflows | Secondary / contextual       |
| Behavior | Coexists with main content    | Overlay or push from an edge |

Drawer guidelines (when used): user-initiated; Esc + close; ~400px; focus return to trigger; scroll under fixed header; full width at smallest breakpoint.

### External naming

Use: top bar, left sidebar, \<context\> panel (e.g. merge request panel), details panel, GitLab Duo panel/sidebar.  
Avoid in user-facing copy: chrome, nav, AI panel.

### Adaptation

- **Media queries** — major chrome/panel changes by viewport
- **Container queries / container width** — content inside a panel by available width

## Building blocks

Related items grouped by proximity; similar items clearly related; boundaries sparingly. Primary visible → secondary easy → support via progressive disclosure.

### Alignment

Support F-pattern scanning. Prefer:

- Common left/right edges
- Top alignment for varied heights
- Alignment that fits task (compare vs sequential) and content type (table, form, prose)

### Content containers

Use sparingly inside panels (avoid nested boxes).

**Presentational:** default / subtle / strong (emphasis only).  
**Semantic:** section (enclosed major area; no nested sections), overlap (popover/drawer/modal/sticky), disabled.

## Behaviors

- Reflow gracefully; keep usability across sizes
- Prefer full text; truncate only when needed; offer tooltip or expand for full value
- Signal overflow (e.g. scrim) in scroll regions
- Sticky/anchored actions rare + elevated
- Focus into opened panel/modal/drawer; restore to trigger on close
- Prefer flex/grid over absolute for in-flow layout
- Prefer min-height over fixed height for text; constrain only what must be constrained

## In-panel navigation

Inside the static panel, put module facets as **tabs under the page header**, not as extra chrome. Search and fine-grained filters belong in the collection toolbar below those tabs. Settings-style section indexes use a vertical pane, not a second horizontal tab row.

## Repo mapping

| Pajamas        | Here                                             |
| -------------- | ------------------------------------------------ |
| Top bar        | `AppShell.Header` in `workspace-shell.tsx`       |
| Left sidebar   | `AppShell.Navbar` + `NavLink`                    |
| Static panel   | `AppShell.Main`                                  |
| In-page tabs   | `ModuleTabs` as `PageHeader` children            |
| Dynamic panel  | Only if a real co-primary side workflow is added |
| Drawer / Modal | Mantine `Drawer` / `Modal`                       |
