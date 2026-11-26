# Software factory harness: tools, contracts, and stack

**Status:** the local deterministic slice, synthetic GitHub workflow, and fixture-backed [web prototype](software-factory-web-client.md) are in the repository. Live web and agent integrations are proposed. See the [README](../../README.md) for run instructions, the [pilot proposal](software-factory-harness-proposal.md) for acceptance gates, and the [factory ADR](../adr/001-software-factory-design.md) for the broader decision.

## Decision

Build the **factory harness** as a Rust core library with a thin CLI. The core prepares a trusted task, validates a candidate, verifies it independently, and produces a receipt. Replay uses the same core against saved cases. Borrow Codex's separation between core behavior and its interfaces, not its model loop, service, or session protocol. A future agent is a separate producer, and a successful agent exit does not mean it fixed the task.

### What established harnesses use

| Reference | Stack and pattern | What we adopt |
| --- | --- | --- |
| [OpenCode](https://github.com/anomalyco/opencode), [V2 CLI](https://opencode.ai/docs/cli) and [configuration](https://opencode.ai/docs/config) | TypeScript repository. A scriptable noninteractive CLI and a service that owns sessions, configuration, permissions, and tools. Configuration discovery matters when opening a checkout. | Use the CLI as a replaceable producer in a fresh guest with a trusted config and clean home. Do not rebuild the loop or give the agent authority over evidence. |
| [Codex](https://github.com/openai/codex), [App Server design](https://openai.com/index/unlocking-the-codex-harness/) | Rust core with a scriptable execution mode and a richer JSON-RPC/JSONL protocol for sessions, progress, and approvals. | Start with a finite process and one result. Adopt structured lifecycle events only if a future operator actually needs streaming or handoff. |
| [SWE-agent](https://github.com/SWE-agent/SWE-agent) and [SWE-bench evaluation harness](https://github.com/SWE-bench/SWE-bench/blob/main/docs/reference/harness.md) | Python projects; SWE-bench uses Docker environments to evaluate proposed patches independently of how they were generated. | Pin the task's base and check recipe, then assess the resulting behavior. Containerized evaluation is a reproducibility pattern, not the pilot's security policy. |
| [Anthropic's tool design](https://www.anthropic.com/engineering/writing-tools-for-agents) and [agent evals](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) | Small, distinct tools with clear descriptions and useful bounded outputs. Evals distinguish a transcript from the actual outcome in the environment. | Prefer a few task-specific capabilities to a large tool catalog. Grade observable results and separate tool diagnostics from authoritative evidence. |

GitHub repository API snapshot on November 26, 2026: roughly 229k stars for OpenCode, 137k for Codex, 21k for SWE-agent and 6k for SWE-bench. Stars indicate public interest, not deployment share. These projects use different stacks. Rust is the factory decision, not a claim that one language dominates production harnesses.

## Practical stack

See the [reuse audit](../research/software-factory-reuse.md) for the upstream crates and tools considered before implementing new components.

| Layer | First implementation | Add only when justified |
| --- | --- | --- |
| Runtime and CLI | Pinned stable Rust toolchain, Cargo lockfile, [`clap`](https://docs.rs/clap/) derive for noninteractive subcommands and help. Library and binary in one package. | A workspace, async runtime, or RPC interface only when a second consumer or concurrent I/O justifies it. |
| Data contracts | [Serde](https://serde.rs/container-attrs.html) and `serde_json` for explicit versions and unknown-field rejection on external input records. Validate size before decoding and job invariants after decoding. Use `sha2` for exact patch-byte digests. | Published JSON Schema if another language needs these contracts. |
| Markdown verification | [`pulldown-cmark`](https://docs.rs/pulldown-cmark/) for Markdown structure and event byte ranges. Those ranges are not a dedicated destination span contract; locate that span only within the supported syntax and refuse cases that cannot be located unambiguously. Do not reserialize the document. | Extend syntax only after fixture coverage demonstrates the rendering semantics. |
| Review patch | [`similar`](https://docs.rs/similar/2.7.0/similar/) for unified diff formatting from the verified before/after bytes. | No patch-applier dependency in the producer or verifier. |
| Tests and replay | Cargo unit and integration tests, plus subprocess checks of the compiled CLI. Exercise the same recipes locally and in CI. | Add browser and real CLI behavior recipes only for jobs that need them. |
| Workflow and artifacts | GitHub Actions for dispatch and separate jobs, with authenticated artifact handoff. The verifier generates both the patch and its SHA-256 digest. | Attestations for cross-trust-domain evidence consumption; durable storage only when retention or search requires it. |
| Agent runtime and isolation | None for the first slice. Later: pinned OpenCode V2 in an approved disposable guest, with broker-mediated model access under the audited execution gate. | Codex or Claude Code adapters when comparison is useful. MCP, a workflow framework and a custom model loop are not pilot dependencies. |

## Operator tools and ownership

Local invocations from `apps/factory/`. Future workflow wrappers must supply authenticated run metadata and stage immutable inputs; passing a local JSON file does not confer authorization. The local base revision is a caller-supplied label; the local harness pins the relevant file bytes, not a Git tree.

```text
factory prepare --request dispatch.json --base ./base --out ./prepared
factory propose --run-spec ./prepared/run.json --base ./base --out ./candidate.json
factory verify --run-spec ./prepared/run.json --base ./base --candidate ./candidate.json --out ./verified
factory replay --suite ./tests/fixtures/docs-link --out ./replay
```

| Command | Reads | Writes and limits |
| --- | --- | --- |
| `prepare` | Structured request, trusted snapshot metadata, pinned base and job policy | An immutable `RunSpec` only after the selector matches one link and the intended destination is known. Not an authentication service. |
| `propose` | Prepared spec and a staged snapshot | One bounded `CandidateEdit`, or a producer failure. First implementation is deterministic. Runtime selection is trusted configuration, not a dispatch option. |
| `verify` | The spec and base from trusted intake, plus the untrusted edit from its own artifact | A receipt for a definitive verdict; a patch only on `ready`. Never runs candidate commands and never writes to GitHub. |
| `replay` | Versioned cases with expected verdicts and pinned fixture bases | Case results and a suite summary. No private provider credentials, writes to GitHub, or automatic publication. |

Commands have `--help`, do not prompt, and emit one JSON outcome on stdout with diagnostics on stderr. Exit `0` is a successful stage, `2` an input or policy rejection, `3` a verification or replay mismatch, and `4` an infrastructure error. JSON includes a stable reason code. Budget enforcement belongs to the later agent phase. Shell termination does not promise JSON; future GitHub consumers must also check terminal run status. Use a new output location rather than mixing old and new files.

### Candidate and evidence design

The producer describes one edit with `version`, `intentDigest`, `selectorId`, and `replacementDestination`. The verifier rejects a candidate whose `intentDigest` differs from the prepared run. The digest binds the edit to the request, including the run ID and attempt. It does not authenticate the producer. The prepared spec owns the file identity, expected old destination, and approved new destination. The producer supplies no paths, offsets, shell strings, patch hunks, or check recipes. The verifier rederives the unique link location from the pinned base. Neither it nor a later publisher applies arbitrary guest-supplied diff text.

For the first job, admit a single inline link with a plain file-relative Markdown destination. Resolve it from the Markdown file's parent directory and compare the resulting repository path to the approved tracked regular file. Leave reference links, fragment/query forms, escapes, multiline destinations, and ambiguous occurrences to humans until they have defined semantics and fixtures. Parse the link, validate the permitted edit against the spec, change only the destination, then reparse and show the original is unresolved and the new link targets the approved file without leaving the snapshot. Use fixtures with consistent UTF-8/newline behavior and verify nothing else changes. Generate the review diff from those two trusted file versions. Never use whole-document serialization as the edit.

Keep three distinct outputs: `candidate.json` from the producer, `receipt.json` from the verifier, and `review.patch` only when accepted. The verifier receipt binds base SHA, run and attempt, intent digest, recipe revision, results, scope, coverage gaps, and exact patch digest. Consumers check trusted verifier origin and successful run status, and reject digest mismatches. [GitHub's artifact download validation](https://docs.github.com/en/actions/tutorials/store-and-share-data) can surface a mismatch as a warning; the factory's own eligibility check must fail closed. A digest binds bytes to evidence, but does not prove who authored the receipt; rely on the trusted run/job boundary, and revisit provenance if receipts leave that boundary.

## Later: what the agent can see and do

There are **no model-facing tools in slice 1**. For the docs-drift experiment, start with read/search and an edit channel confined to the guest. Let an adapter translate guest output to the job's bounded candidate form. For that separate job, define its own verifier and permitted edits before choosing the agent tool set. If the agent needs feedback, add one fixed, fixture-backed preview check that returns a short result; it is not the authoritative verifier. Do not expose generic remote execution, credential gateways, GitHub writes, or unrelated integrations as tools.

Use a reviewed guest image and runtime configuration, a fresh session, and explicitly staged inputs. Do not inherit a developer's home, shared OpenCode service, or checkout-supplied runtime config, plugins, or integrations. Verify those assumptions against the pinned OpenCode version before enabling it. Bound wall time, output bytes, and broker spend outside the model. Guest tool permissions improve behavior but are not the isolation boundary. The trusted verifier, receipts, fixture expectations, and any future publisher are not guest tools.

## Verification and build order

1. Implement the docs-link recipe and replay it against three fixtures: correct repair, wrong-but-resolving destination, and unrelated edit. For the unrelated-edit fixture, assert that extra edit data is rejected, not silently ignored. Accept only the correct case.
2. Exercise `prepare → propose → verify` through the CLI. Add missing and ambiguous intent, unsupported syntax, a stale base, an already-valid link, and a timeout or incomplete run. No fallback to another destination, and no usable patch from a failed stage.
3. Use the same commands in a synthetic GitHub workflow. Test that an artifact from a wrong run/attempt, an altered artifact, or an interrupted run cannot be used. Confirm the expected artifact from a completed trusted verifier can be used. No model and no repository write access.
4. After the independent execution gate is approved, add one OpenCode adapter on synthetic tasks. Confirm the allowed run and denied access paths before staging private source. Evaluate agent value separately on the docs-drift cohort described in the system design.

### Core and CLI boundary

In `apps/factory/`, `src/lib.rs` exposes the factory library. `src/factory/` owns prepared intent, candidate and receipt contracts; `src/jobs/docs_link.rs` owns the job rules. The library takes prepared inputs and snapshot data and returns typed outcomes. It does not read process environment variables, access GitHub, or start an agent. `src/bin/factory.rs` parses flags and maps outcomes to the CLI exit contract. `src/adapters.rs` handles staged file and artifact I/O and can host a later producer adapter. Dependencies point inward: CLI and adapters call the core, not the reverse.

Use one `Cargo.toml`, checked-in `Cargo.lock`, pinned `rust-toolchain.toml`, and `tests/fixtures/docs-link/`. The proposed implementation checks are `cargo fmt --check`, `cargo clippy --locked --all-targets -- -D warnings`, and `cargo test --locked`. Use Linux CI as the authoritative fixture environment; use platform-neutral repository paths and check the CLI locally on Windows before claiming support there. No separate service, Node.js dependency, or custom agent runtime is needed for the initial workflow.
