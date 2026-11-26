# Software factory: full tool blueprint

**Status: design only.** [System design](software-factory.md) · [Rust harness](software-factory-harness.md) · [Pilot approval](software-factory-harness-proposal.md)

## What it looks like

The factory appears where engineers already work. GitHub Issues is the request inbox, Actions is the run console, and pull requests remain the review and merge interface. The artifact pilot does not depend on a portal. A separate [web client proposal](software-factory-web-client.md) explores a read-only maintainer view without replacing GitHub.

```text
GitHub Issue #42                 GitHub Actions → Run workflow
Repair link in docs/setup.md      Job:          Docs link repair
                                  Issue:        42
                                  Markdown:     docs/setup.md
                                  Broken link:  ./old-install.md
                                  Destination:  ./install.md
                                  [Run workflow]

Run #1042 · completed             Result: READY FOR HUMAN REVIEW
Base: 8b2…  ·  Attempt: 1         Before: ./old-install.md not found
                                  After:  ./install.md resolves as approved
                                  Scope:  1 link; nothing else changed
                                  Not checked: installation behavior
                                  [receipt.json] [review.patch]
```

The issue may suggest values, but the maintainer confirms the approved fields at dispatch. `needs_input` asks a specific question and tells the maintainer to start a fresh dispatch. A denied, incomplete, or interrupted run never offers a usable patch. The maintainer verifies the current base, reviews the patch, and opens the PR manually. Later, an **approved draft PR** can carry the same receipt and required checks; a human still merges.

| Person | What they do |
| --- | --- |
| Requester | Files an issue with expected behavior and supporting context. Cannot schedule work or expand permissions just by writing a comment. |
| Maintainer | Dispatches an approved request, answers questions, rejects bad output, and owns publication and merge decisions. |
| Factory operator | Enrolls repositories, pins approved revisions, sets limits, pauses jobs, and handles suspect receipts. |
| Verifier owner | Maintains trusted recipes and expected fixtures. Reviews changes to what the factory treats as acceptable. |

## How it fits together

```text
                     GitHub Issues / Actions / PRs
                                  |
                        authenticated dispatch
                                  v
                    Actions jobs + thin factory CLI
                       |          |           |
                  prepare      propose      verify ----> receipt + patch
                       |          |           |
                       +------- Rust core ----+
                                  |
                       deterministic producer (pilot)
                         OR isolated agent (later)

 Later only: independent gate -> disposable guest -> approved model broker
 Later only: human approval + trusted receipt -> publisher -> draft PR
```

In this diagram, the agent option is a `propose` adapter selected by trusted configuration, not a service called by the Rust core. The core has no GitHub credentials, provider keys, shell execution, or network side effects. It evaluates staged data and returns typed outcomes. The CLI handles I/O; Actions schedules jobs, shows status, and transports artifacts. A separate trusted verification job gets the prepared request and base from intake, not from the producer.

### Technical stack and project shape

| Part | Decision |
| --- | --- |
| Core | One Cargo package with a Rust library for intent, job rules, verification and receipts. Use pinned stable Rust and a checked-in lockfile. |
| Interface | Thin `factory` binary using `clap`. `prepare`, `propose`, `verify`, and `replay` run without prompts and return machine-readable outcomes. |
| Inputs and evidence | Serde/`serde_json` for versioned records; `pulldown-cmark` for the supported link grammar; `sha2` for exact patch-byte digests. |
| Tests | Cargo unit and subprocess tests, fixture replay, and a synthetic Actions test. Linux CI is authoritative; Windows CLI support is a separate check. |
| Runtime integrations | None for the deterministic slice. A pinned OpenCode or Codex CLI can later run in a fresh disposable guest. Do not build a custom model loop. |
| Persistence | GitHub run history and short-lived artifacts initially. Later, consider PostgreSQL for approval/event audit and Temporal for waits and retries only when Actions is no longer enough. A dashboard is optional and should read the same records. |

The Rust package lives in `apps/factory/`. Within it, `src/lib.rs` exposes the library, `src/factory/` holds core contracts, `src/jobs/docs_link.rs` holds job rules, `src/bin/factory.rs` owns the CLI, `src/adapters.rs` handles I/O, and `tests/fixtures/docs-link/` contains positive and negative cases. No service or crate split is required for the pilot.

## Install and integrate

| Integration | Configuration and exchange | Boundary |
| --- | --- | --- |
| Pilot repository | Start with one synthetic repository. Protect the default branch and review changes to workflow and verifier recipes. Set explicit read-only job permissions where needed; the deterministic producer needs no repository credential. | Synthetic fixtures only. No private checkout, model secret, publishing key, or deployment access. |
| GitHub Actions | A manual dispatch supplies structured fields. A trusted intake job resolves the base and produces `RunSpec`. The producer returns `CandidateEdit`. A clean verifier job generates the receipt and review patch. Publish a short summary and separate artifacts. | Reject wrong-run, wrong-attempt, altered, or interrupted results. Validate the claimed verifier job as well as the digest. GitHub's terminal status wins over a stale `ready` line. |
| Local CLI | A developer runs the same recipe against saved fixtures; `replay` produces a report for iteration. `prepare`, `propose`, and `verify` can be exercised with staged files. | Local JSON does not confer an authenticated GitHub identity or produce a production-authorized receipt. No provider or write credentials needed. |
| Agent execution, later | The independent execution gate validates repository, approved workflow revision, actor, and first attempt before allocating a sandbox or model access. Stage only approved context. The guest sends back a bounded job-specific candidate. | It has no GitHub or cloud credentials; short-lived broker capability and enforced outbound limits live outside it. No native rerun can allocate protected resources. |
| GitHub App publisher, later | A separate publisher accepts a verifier-origin receipt and a human approval bound to the intended write, repo, base, intent, exact patch and expiry. It can open an approved draft PR and record its identity. | Candidate code never runs here. Reconcile ambiguous writes before retrying, stop on changed approval/base, and never merge. Enable only after separate sign-off. |
| GitHub checks, tracker, chat, alerts, later | Normalize inbound events into typed requests or advisory updates. Deduplicate deliveries and use the current PR head for follow-through. Send internal notifications from explicit outcomes. | Treat payloads as data. Start with read-only triage, not background fixes for all alerts. No public reply or deployment automation in this plan. |

### Handoff and versioning

| Record | Owner | Key contents |
| --- | --- | --- |
| `TaskRequest` | Trusted intake | Repository and actor identity, approved fields, issue reference, workflow identity. |
| `RunSpec` | Rust core via intake | Pinned base, policy and recipe revisions, intent digest, exact selector and approved destination, run/attempt, budget. |
| `CandidateEdit` | Producer | One versioned edit referencing the approved selector. No arbitrary path, shell command, or raw diff. |
| `EvidenceReceipt` + `review.patch` | Trusted verifier | Receipt ties the verdict to the exact intent, run/attempt and base; the patch exists only for `ready`. Show covered checks and gaps. |
| `PublicationApproval` | Human decision via future approval control | Approver, target, allowed action, expiry, base, intent and patch binding, stable publication key for reconciliation. |

Schema versions are explicit. Reject incompatible inputs. Use fresh run/attempt artifact locations; never silently reuse files from another run. Local diagnostics and agent output are not authority. Network failures never turn into a passing check. A person or the later publisher must reverify when the base changes.

## What to build, in order

1. **Local harness.** Build the deterministic verifier and replay first. Accept the exact repair; deny a resolving wrong destination and a candidate with unrelated edit data. Demonstrate this through the CLI.
2. **Synthetic end-to-end tool.** Add manual dispatch, separate verification, and artifact handoff. Prove a trusted completed run is usable and a wrong attempt, altered artifact, or cancelled run is not. Keep permissions read-only and no model connected.
3. **Agent experiment, separately approved.** Add one adapter and the independent execution gate. Run on synthetic inputs first. Then compare the agent and manual baseline on a bounded docs-drift job with a trusted independent check. Keep deterministic producers where they work better.
4. **Approved publication and follow-through, separately approved.** Add the draft publisher and scoped approval only if manual publication costs meaningful time. Add CI follow-through only for factory-owned work; cap attempts, stop on external edits, and require fresh evidence for each head.
5. **Expand selectively.** Add one job or trigger at a time, with its own owner, verifier, limits, and pause switch. Replay past failures before promoting policy/model changes. Track accepted output, maintainer minutes, cost per accepted change, and false `ready` outcomes before widening scope.

**First decision to make:** choose the synthetic repository, factory operator and verifier owner. Approve the local harness and synthetic handoff only. The future architecture describes where integrations belong; it is not approval to enable them.
