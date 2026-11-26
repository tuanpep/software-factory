# Prototype the web client with the supplied template

**Status:** accepted for the local, fixture-only prototype. See the [web client design](../design/software-factory-web-client.md) for later integration gates.

## Practice

Vendor [nextjs-mantine-arco](https://github.com/tuanpep/nextjs-mantine-arco/tree/38ed7702616f6e97bb3e3ab7f3e80a754c2738fd) in `apps/web/`, without nested Git metadata. Keep its lockfile, App Router, Mantine/Arco theme, and English/Vietnamese message setup. Keep the Component Book at `/components` instead of removing it. The [App Router route-group convention](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups) lets the factory screens and Component Book keep separate layouts. Use [Mantine components](https://mantine.dev/guides/next/) rather than adding a UI dependency.

Keep the upstream lockfile as the baseline, then maintain dependencies in this repository. The prototype updates the template's Next.js 16.4.3 to 16.4.6 to address the advisories reported by npm.

```text
/                 → RunList()
/runs/[runId]     → RunDetail(run) or notFound()
/components       → existing Component Book
```

Within `apps/web/`, routes in `app/` select a fixture and render `modules/factory/components/`; `modules/factory/lib/` owns the fixture set. A ready fixture carries a demo diff; non-ready fixtures carry a state and no patch. `messages/` owns display text. The browser never invokes the Rust CLI and the app does not call GitHub. Mock status, receipt details, and the diff are labeled as examples; there is no dispatch, apply, or download action.

Running the factory at a subroute would preserve the template homepage but bury the main task. Replacing the template or merging Node files into the Rust package would lose the supplied structure or blur the package boundary. Keep the Rust harness unchanged.
