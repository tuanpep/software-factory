# Prototype the web client with the supplied template

**Status:** accepted as the web client foundation. The local fixture prototype and the template showcase have been removed. See the [web client design](../design/software-factory-web-client.md) for later integration gates.

## Practice

Adapt [nextjs-mantine-arco](https://github.com/tuanpep/nextjs-mantine-arco/tree/38ed7702616f6e97bb3e3ab7f3e80a754c2738fd) in `apps/web/`, without nested Git metadata. Keep its lockfile, App Router, Mantine/Arco theme, and English/Vietnamese message setup. Use [Mantine components](https://mantine.dev/guides/next/) rather than adding a UI dependency.

Keep the upstream lockfile as the baseline, then maintain dependencies in this repository. The prototype updates the template's Next.js 16.4.3 to 16.4.6 to address the advisories reported by npm.

```text
/ → Factory Runs (disconnected until live reads are implemented)
```

Within `apps/web/`, routes in `app/` render screens owned by `modules/factory/components/`. `messages/` owns display text. Don't serve fake run IDs or evidence in the app. Add the detail route alongside real data access, after the evidence gates are designed. The app does not invoke the Rust CLI or call GitHub today.

Replacing the template or merging Node files into the Rust package would lose the supplied foundation or blur the package boundary. Keep the Rust harness unchanged.
