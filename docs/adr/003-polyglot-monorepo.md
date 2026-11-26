# Keep the factory and web client in one repository

**Status:** adopted. Keep native tooling for now; prefer Moon if cross-language orchestration becomes necessary.

## Practice

Group both runnable applications under `apps/`. Keep documentation and workflows at the repository root. A single change can review the verifier contract, client behavior, and documentation together. Cargo and npm still install, build, and test their own packages independently. Do not create an empty `packages/` directory; add it when there is a genuine reusable package.

| Home | Owns | Lockfile |
| --- | --- | --- |
| `apps/factory/` | Rust library, CLI, verification rules, replay fixtures | `apps/factory/Cargo.lock` |
| `apps/web/` | Next.js client and its presentation code | `apps/web/package-lock.json` |
| `.github/workflows/` | Independent CI jobs and the existing manual synthetic handoff | None |

Use the native package commands. There is no root `package.json`, no `[workspace]` in the Cargo manifest, and no cross-language task runner. Neither application imports the other's source or output directory. When live evidence integration is approved, make the versioned receipt and patch the boundary; validate them at intake rather than copying verifier logic into TypeScript.

Run `check-factory` and `check-web` independently in the same CI workflow. Do not filter the entire workflow by changed paths while the checks may be required: GitHub documents that a path-skipped workflow can leave required checks pending. Cache web dependency downloads against `apps/web/package-lock.json`. The synthetic handoff remains a separate manual workflow and does not install npm dependencies.

## Why not a workspace manager?

- [Cargo workspaces](https://doc.rust-lang.org/cargo/reference/workspaces.html) share dependency resolution, build output, and common commands across **Rust packages**. The library and CLI are targets of one Cargo package. Consider a Cargo workspace when a second Rust package actually needs to share those settings.
- [npm workspaces](https://docs.npmjs.com/cli/v10/using-npm/workspaces/) link **npm packages** from a root package. There is one npm app. A workspace today would move the template's lockfile without giving it a second package to link. Revisit when a second Node app or shared package needs coordinated installs.
- [GitHub Actions jobs and working directories](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_iddefaultsrun) provide the coordination needed now. Consider a task graph or remote cache only when there are measurable cross-package dependencies or slow builds to address.

## Task runner shortlist

| Tool | Fit | Decision |
| --- | --- | --- |
| [Moon](https://moonrepo.dev/docs/config/project) | Explicit projects and tasks for multiple languages; its [Rust guide](https://moonrepo.dev/docs/guides/rust/handbook) shows Cargo tasks. Can start by calling existing commands rather than changing either package manager. | Preferred if a shared check or versioned contract creates a real dependency between the apps. |
| [Nx](https://nx.dev/docs/features/multi-language-support) | Supports non-JavaScript projects through explicit command targets. Its project graph and affected runs give more options as the project count grows. | Reconsider if the team already uses Nx or needs its generators and graph tooling. |
| [Turborepo](https://turborepo.dev/docs/guides/tools/rust) | Strong for a repository centered on JS/TS workspaces. Its documented native Cargo integration is experimental and expects a virtual Cargo workspace. | Do not restructure a single Rust package to fit an experimental integration. |

When adding Moon, first prove it can run the existing local and CI commands with each app's own lockfile and working directory. Keep verifier/evidence checks uncached until the task inputs and trust boundary have been reviewed. No runner is installed by this layout change.
