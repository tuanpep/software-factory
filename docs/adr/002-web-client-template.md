# Prototype the web client with the supplied template

**Status:** accepted as the web client foundation. The local fixture prototype and the template showcase have been removed. See the [web client design](../design/software-factory-web-client.md) for later integration gates.

## Practice

Adapt [nextjs-fe-template](https://github.com/tuanpep/nextjs-fe-template) in `apps/web/`, without nested Git metadata. Keep its lockfile, App Router, Mantine theme with GitLab Pajamas tokens (`theme.ts`, `pajamas.module.css`), TanStack Query, and English/Vietnamese message setup. Use [Mantine components](https://mantine.dev/guides/next/) rather than adding a UI dependency. Placement for `app/` and `modules/` follows `.cursor/skills/app-modules`.

Keep the upstream lockfile as the baseline, then maintain dependencies in this repository. The app keeps Next.js 16.4.6 to address the advisories reported by npm. The template's Next.js pin is 16.4.3.

```text
/ → Factory Runs (disconnected until live reads are implemented)
```

Within `apps/web/`, routes in `app/` render screens owned by `modules/factory/features/<slice>/ui/`. `messages/` owns display text. Don't serve fake run IDs or evidence in the app. Add the detail route alongside real data access, after the evidence gates are designed. The app does not invoke the Rust CLI or call GitHub today.

Replacing the template or merging Node files into the Rust package would lose the supplied foundation or blur the package boundary. Keep the Rust harness unchanged.
