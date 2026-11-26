# Proposal: build a verification harness for the software factory

**Decision requested:** approve the synthetic, deterministic pilot. Private repository access, model execution, and automated publication each require a separate decision. The [technical design](software-factory-harness.md) defines the CLI, data contracts, and trust boundaries; the [factory ADR](../adr/001-software-factory-design.md) records the broader architecture.

## Why build it?

A coding agent can produce a plausible patch. Reviewers still need to know whether it fixes the agreed problem, changes anything outside scope, and was checked against the right revision. The factory needs a way to answer those questions that works with a script, an agent, or a manually supplied candidate.

Build the part we need to control: approved intent, independent verification, and a reviewable receipt. Reuse an existing agent runtime if evaluation shows it helps. A script that solves the first job is a valid outcome, not a failed AI pilot.

## What the pilot delivers

One authorized maintainer dispatches a synthetic Markdown link repair with an issue number, file, broken link, and intended destination. A deterministic producer proposes a structured edit. A separate verifier checks it against the pinned base, generates the patch, and explains the verdict. The maintainer gets a GitHub Actions summary and, on success, a receipt and downloadable patch. No model, private source, GitHub write credential, or automated PR is in scope.

```text
Approved request + pinned base
  -> prepare: resolve one link and record approved intent
  -> propose: emit one structured candidate edit
  -> verify: check scope and fail-before/pass-after behavior
  -> handoff: receipt and patch, only for a successful matching run

Saved fixtures -> replay -> verdicts and regression report
```

The verifier owns the final patch. The producer never supplies arbitrary diff hunks, shell commands, or a verdict. The receipt identifies the run and attempt, base revision, intent digest, verifier revision, check results, and the digest of the exact patch. A completed verification can reject an edit; a cancelled run or infrastructure failure cannot yield a usable patch.

## Stack and alternatives

Use a **Rust core library and thin CLI in one Cargo package**, inspired by Codex's core/client split. Use **clap** for CLI arguments, **Serde and serde_json** for versioned contracts, **pulldown-cmark** for link parsing, **sha2** for patch digests, **Cargo tests** for fixtures and CLI checks, and **GitHub Actions** for dispatch and artifact handoff. The verifier lives in the core; the binary handles input and output. Keep GitHub run history rather than adding a database or portal.

| Option | Decision |
| --- | --- |
| Adopt a complete coding-agent product | Consider it if issue-to-PR automation alone is enough. It does not remove the need to decide who owns the verifier and publication policy. |
| Write a custom agent loop and tool protocol | Do not build it. [OpenCode](https://opencode.ai/docs/cli) and [Codex](https://openai.com/index/unlocking-the-codex-harness/) already provide scriptable runtimes. The pilot needs neither. |
| Build a small verification harness and reuse a runtime later | Recommended. Borrow [SWE-bench's separation of generation and evaluation](https://github.com/SWE-bench/SWE-bench/blob/main/docs/reference/harness.md) and [Anthropic's distinction between an agent transcript and the actual outcome](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents). Keep the factory's evidence format independent of the runtime. |

The [technical design's research comparison](software-factory-harness.md#what-established-harnesses-use) distinguishes public project interest from evidence about production adoption.

## Delivery and acceptance

| Slice | Owner to name | Done when |
| --- | --- | --- |
| 1. Local verifier and replay | Job/verifier maintainer | One correct edit yields a patch and receipt. A link that resolves to the wrong destination and a candidate with an unrelated edit yield no review patch. The same fixtures run through the CLI without prompts. |
| 2. Synthetic GitHub Actions handoff | Factory maintainer | A completed trusted run yields a usable patch. A cancelled run, digest mismatch, or receipt from another run or attempt does not. The workflow needs no repository write access. |
| 3. Optional agent evaluation, separately approved | Factory maintainer and data/security owner | The execution gate allows the approved actor and revision and denies unauthorized actors, refs, and native reruns. Then compare one approved model with the manual baseline on a bounded docs-drift task. Promote it only if it reduces maintainer effort at comparable quality. |

The required decision at the end of slice 2 is whether the verifier and handoff are trustworthy enough to keep. It is not whether OpenCode is better at repairing a link with a known destination. Keep the link job deterministic if it works well. For the later agent comparison, record acceptance without substantive rework, maintainer minutes, cost per accepted change, and false `ready` outcomes on denied cases.

**Before starting:** name the job/verifier owner and factory maintainer, select a synthetic GitHub repository, and approve slices 1 and 2 only. The first implementation step is the three-case local replay. Do not connect a model or private repository to make that demo work.
