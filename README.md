# Software factory

Local deterministic harness for an approved Markdown link repair. See the [blueprint](docs/design/software-factory-blueprint.md) and [harness design](docs/design/software-factory-harness.md).

## Repository layout

```text
apps/
  factory/       Rust verifier, CLI, and replay fixtures
  web/           Next.js client foundation
docs/            Architecture decisions and design
.github/         CI checks and manual synthetic handoff
```

Each app owns its lockfile and builds without the other's toolchain. See the [monorepo decision](docs/adr/003-polyglot-monorepo.md) for the task runner comparison.

| Check | Where | Command |
| --- | --- | --- |
| Rust | `apps/factory/` | `cargo fmt --check`, `cargo clippy --locked --all-targets -- -D warnings`, `cargo test --locked` |
| Web | `apps/web/` | `npm ci`, `npm run check`, `npm run build` |

## Run the web client

The [maintainer web client](docs/design/software-factory-web-client.md) uses the [nextjs-fe-template](https://github.com/tuanpep/nextjs-fe-template) foundation. Use Node.js 24 LTS to match CI, and npm:

```text
cd apps/web
npm ci
npm run dev
```

Open [localhost:4202](http://localhost:4202) for the Review console (runs queue + evidence). GitHub integration has not been implemented.

## Run the synthetic fixture suite

Install Rust through rustup and use the pinned toolchain. From the repository root:

```text
cd apps/factory
cargo test --locked
cargo run --locked --bin factory -- replay --suite tests/fixtures/docs-link --out replay-local
```

The CLI writes `replay-local/report.json` with three expected verdicts: accept the approved link repair, reject a different existing destination, and reject a candidate containing an unrelated edit. Use a fresh output path for each invocation.

## Run one repair

Run these commands from `apps/factory/`:

```text
cargo run --locked --bin factory -- prepare --request tests/fixtures/docs-link/request.json --base tests/fixtures/docs-link/base --out prepared-local
cargo run --locked --bin factory -- propose --run-spec prepared-local/run.json --base tests/fixtures/docs-link/base --out candidate-local.json
cargo run --locked --bin factory -- verify --run-spec prepared-local/run.json --base tests/fixtures/docs-link/base --candidate candidate-local.json --out verified-local
```

Review `verified-local/receipt.json` and `verified-local/review.patch`. The tool does not modify the base. Exit codes: `0` success, `2` invalid input or policy rejection, `3` verification failure, `4` infrastructure error. A rejected candidate may have a receipt but never a review patch.

Run against trusted, immutable staged directories. The local harness rechecks the source and destination content and records the supplied base revision as a label; it does not establish Git provenance, authenticate a GitHub actor, or authorize publication. Only plain inline links to Markdown files in the snapshot and LF-encoded UTF-8 source Markdown are supported. Local runs need no agent runtime or credentials.

## Run the synthetic GitHub handoff

In a synthetic repository that contains the [workflow](.github/workflows/synthetic-handoff.yml) on its default branch, open **Actions**, select **Synthetic factory handoff**, and choose **Run workflow** on that branch. Start a new dispatch instead of rerunning an old attempt.

After a successful run, open the `synthetic-evidence` artifact for the receipt, review patch, and replay report. The patch targets the synthetic fixture only. The workflow uses read-only repository permissions and does not open a PR or connect to a model.
