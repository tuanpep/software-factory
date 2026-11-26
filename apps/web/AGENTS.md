<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Clean UI principles

- Use the existing Mantine components and default styles. Add custom CSS only when a concrete interaction or layout requires it.
- Keep pages focused on the current task. Do not repeat navigation, project context or actions without a distinct purpose.
- Prefer clear labels over explanatory paragraphs. Remove hints, subtitles and help text that repeat a heading, button or familiar control.
- Show help only when a decision is ambiguous or a user needs it to proceed. Place it beside the relevant action, not in a permanent page-wide explanation.
- Keep necessary validation, recovery instructions, accessibility labels and material limitations. A clean UI must not hide data loss, uncertainty, demo-only behavior or lack of live delivery.
- State shared limitations once in concise language. Do not repeat disclaimers on every card or expose implementation details as user guidance.
- Use short empty states with a useful next action. Do not explain obvious alternatives already visible on the page.
- Review every added sentence: if removing it does not change the user's decision, understanding of an outcome or ability to recover, remove it.
