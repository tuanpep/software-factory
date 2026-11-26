# UI

[placement](placement.md) · shell IA [gitlab-pajamas](../../gitlab-pajamas/SKILL.md) · `theme.ts`, `pajamas.module.css`.

Mantine first; overrides in `theme.ts`. Feature screens in `modules/<product>/features/<slice>/ui/`; shared chrome in `modules/ui/` with **plain props only**.

`"use client"` on screen file when it handles input/portal/forms. Extend `modules/ui` when **two** features share a control. No `@gitlab/ui` unless asked.

Split screens by **reason to change** (list vs form vs chrome), not by line count. No boolean prop explosion on shared UI — feature-owned components for domain variants ([architecture](architecture.md)).

## Accessibility (minimum)

Fix a11y lint on touched files. Every control: visible `label` or `aria-label`. Keyboard + visible focus. Mantine `error` on fields. Prefer `getByRole` in tests. Shell: preserve skip-link / focus order per gitlab-pajamas.

Copy/i18n: [i18n](i18n.md). Product tone: root `AGENTS.md`.
