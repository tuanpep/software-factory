# Proposal: a proof-first software factory

Status: Proposed, pending design approval. No implementation authorized by this proposal.

Read this ADR for the decision and pilot scope, the [system and rollout design](../design/software-factory.md) for contracts and operations, and the [research notes](../research/software-factory-sources.md) for what the sources actually support.

## Problem and scope

Build a shared internal tool that turns a small, approved maintenance task into a proposed change with enough evidence for someone else to review it. The pilot assumes one private GitHub repository, an approved model provider, and a named maintainer. If the real repository host or data-handling rules differ, revisit the integrations before building. This workspace is empty, so there is no existing service or module to extend.

## Practice

Adopt [Traycer's proof-first, one-trigger/one-job approach](https://traycer.ai/blog/how-to-build-a-software-factory) with a [manually dispatched GitHub Actions workflow](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflow_dispatch) as the pilot control plane. Use OpenCode's [noninteractive CLI](https://opencode.ai/docs/cli) as a replaceable coding runtime, not as the policy engine or sandbox. Keep task policy, fixtures, and verification recipes versioned and reviewed. Traycer reports 332 of 675 merged PRs opened by its factory over 11 days; that is one team's experience, not a throughput target. The useful lesson is to prove one job is worth reviewing before sending more work to it.

Adopt the [Codex separation of Rust core and integration clients](https://openai.com/index/unlocking-the-codex-harness/) at pilot scale: one Cargo package with a library for factory rules and a thin `factory` binary. Unlike Codex, this core does not drive a model/tool loop. GitHub Actions owns scheduling, and any coding agent remains a separate process. This replaces the earlier TypeScript/Node recommendation without expanding the pilot.

## Usage and first job

**Job:** repair a stale relative link in a Markdown file under `docs/`. An authorized maintainer dispatches the issue number, path, broken link and intended destination. These values define approved intent; issue content can supply context but cannot override them. Intake pins the approved intent, issue snapshot, repository base SHA and policy revision. Missing or ambiguous intent stops before execution. Start with a deterministic producer on synthetic fixtures; the first slice needs no model or private source.

The workflow reports `ready`, `needs_input`, `policy_rejected`, `verification_failed`, `infrastructure_failed`, or `budget_exhausted` when it can. GitHub run status is authoritative for interruptions, and summaries are best effort. Use a patch only when the run completed successfully and its exact attempt has a `ready` verifier receipt. There is no factory branch, PR, comment, merge, or deployment in the pilot.

## Shape

```text
Maintainer --> GitHub Actions run on trusted workflow revision
                     |
              Intake and policy
              (issue + pinned source snapshot)
                     |
              Deterministic producer first
              Isolated agent later, behind independent execution gate
                     |
              Bounded candidate edit only
                     |
              Independent verification job
                     |
              Evidence + reviewable patch --> maintainer --> ordinary PR
```

| Proposed home | Owns |
| --- | --- |
| `.github/workflows/` | Trusted dispatch, job permissions, run status, artifact handoff. No model logic. |
| `apps/factory/src/lib.rs`, `apps/factory/src/factory/` | Rust library entry point, input validation, job selection, budgets, and run/evidence contracts. No GitHub or provider clients in core rules. |
| `apps/factory/src/jobs/docs_link.rs` | Docs-link policy, preparation, deterministic candidate generation, and verification. |
| `apps/factory/src/bin/factory.rs`, `apps/factory/src/adapters.rs` | Thin CLI and boundary adapters for staged files and artifacts. Later adapters can own GitHub reads and runtime invocation, with no authority to waive checks. |

One application and one run contract. No separate service per stage. Proposed boundary contracts:

```text
prepare(taskRequest)             -> RunSpec | NeedsInput | Rejection | Failure
propose(runSpec, sourceSnapshot)  -> CandidateEdit | Failure
verify(runSpec, candidateEdit)    -> EvidenceReceipt + optional ReviewPatch | Failure
```

`RunSpec` holds the pinned base and policy revisions, exact link selector, required approved destination, and budget. `EvidenceReceipt` ties the verdict and patch digest to a run ID, attempt, base SHA, before/after check results, changed paths, and coverage limits. Only the verifier can assign `ready`. Retry with a fresh manual dispatch; native reruns cannot reach the protected execution path.

### Verification and trust boundaries

1. **Intake:** only allowlisted maintainers and repositories, with a trusted workflow revision. For private-source agent runs, an independent broker checks the run identity, selected ref and revision, actor and first-attempt status before granting sandbox/model access. A workflow check alone is not sufficient. Fetch source read-only and stage it without exposing credentials to the sandbox. Issue bodies, repository text, agent output and patches cannot change tools, policy, or privileges.
2. **Agent execution:** one disposable isolated environment per attempt. No GitHub write token, cloud credentials, host mounts, or Docker socket. Restrict egress to the approved model endpoint or broker. Keep its provider credential outside the guest and give the guest a bounded, per-run capability. Start with one run at a time, one agent attempt, and a ten-minute execution limit. If the organization cannot approve source egress or enforce these boundaries, use a synthetic repository until it can.
3. **Independent verification:** use a different clean job, the trusted verifier and a fresh copy of the pinned base. Validate a structured candidate edit and generate the review patch from trusted base and accepted result bytes. Permit one existing regular Markdown file under `docs/`, one target link, and no unrelated edits, renames, symlinks, or workflow changes. Show the exact link failing on the base and resolving to the dispatch-approved destination on the patched snapshot. Do not run candidate commands. A failed or inconclusive check is not `ready`. See the [harness design](../design/software-factory-harness.md) for the concrete contract.
4. **Review:** show `run ID`, `base SHA`, patch digest, changed path, fail-before/pass-after results, and what was not checked. Treat artifact contents as data, redact diagnostic output, and set a short retention period. Reverify or rerun if the base drifts before applying. Keep normal branch protection and required human review.

## Stack and adoption evidence

| Layer | Pilot recommendation | Alternatives and when to use them |
| --- | --- | --- |
| Language | Rust on a pinned stable Cargo toolchain. Keep parsing, candidate validation, and receipts in a testable library behind a thin binary. | TypeScript and Python are familiar automation options, not the selected stack. [Developer survey data](https://survey.stackoverflow.co/2026/technology/data) measures familiarity, not suitability for this core. Rust adds build/toolchain overhead; keep the pilot to one package. |
| Workflow | GitHub Actions with manual dispatch, jobs, and evidence artifacts. No new long-running control plane. | [Temporal](https://docs.temporal.io/) once jobs must wait for approval across days, resume after worker failure, or coordinate several independent triggers. It handles durable state and retries but does not replace policy checks or idempotent external writes. |
| Coding runtime | OpenCode V2 in noninteractive mode with one organization-approved model. Pin both and keep the adapter narrow. | Codex or Claude Code if already approved. Compare on the same saved tasks for correctness, evidence, elapsed time, and cost. Do not add a multi-agent framework until one runtime cannot meet a demonstrated need. |
| Isolation | GitHub-hosted VM jobs for trusted orchestration and verification; a disposable agent sandbox with enforced egress. Evaluate [E2B's documented network controls](https://e2b.dev/docs/network/internet-access) if a managed provider is allowed; otherwise use an organization-approved single-use VM with equivalent controls. | Use Docker for reproducible images and local fixture runs, not as the sole boundary for agent code on a shared machine. The 2026 Stack Overflow survey reports 59.1% for Docker / Docker Compose among cloud-platform question respondents. |
| Storage and UX | GitHub run history, summaries and artifacts. No portal or database in the pilot. | PostgreSQL for cross-repo reporting, searchable audit and dispatch deduplication when needed; object storage when GitHub's retention no longer fits. PostgreSQL led the 2026 survey's database usage question at 57.9%. |
| Write integration | None. A person publishes. | A separate trusted publisher with a [repository-scoped GitHub App installation token](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app), only after a separate approval decision. Bind approval to the repo, base, policy revision, and patch digest. Revalidate before minting a token. Use a stable run key to reconcile retries to at most one draft PR. No merge or workflow changes. |

Survey results measure familiarity, not factory success. The orchestrator and sandbox picks above are based on documented capabilities and operational fit, not claims of market share.

## Synthesis decision and alternatives

- **Choose a GitHub-native, artifact-first factory.** It hides checkout, runtime, and verification details behind a single dispatch and run result. It leaves the publish decision visible to the maintainer and needs no service to sit idle between runs.
- **Buy before building if custom policy and evidence do not matter.** [GitHub Copilot cloud agent](https://docs.github.com/en/copilot/responsible-use/agents) already handles issues and pull requests. Use it rather than building a factory if the team only needs to assign work and review a PR. This proposal builds the narrow part that gives the team ownership of the verifier and keeps publication out of agent execution.
- **Defer a durable service.** GitHub App + Temporal + PostgreSQL can centralize several repos and survive multi-day workflows. The single synchronous pilot does not need a database, event receiver, worker fleet, or separate approval UI. Add that architecture when the team can point to a workflow Actions no longer handles well.

The first job may be cheaper to solve with a deterministic link finder. Keep that as a baseline. The pilot tests the operating model first; if a script picks the right link just as often at lower review cost, use the script for this job and reserve the model for tasks with real ambiguity after the same controls pass.

## Pilot and rollout

| Stage | Deliverable | Exit check |
| --- | --- | --- |
| 0. Repository readiness | Pick a low-risk repository, one owner, and a trusted link check. Capture the existing human/script baseline. | A seeded broken link fails before the fix, passes after, and can be reviewed from the evidence alone alongside the one-line diff. |
| 1. Artifact-only pilot | Wire the single manual trigger and deterministic job on synthetic fixtures. Before running an agent on private source, add the independent execution gate described in the system design. | Accept only the correct fixture; never use an interrupted run's artifact. For agent admission, test an allowed dispatch, denied actor/ref/rerun, prohibited egress, cleanup, and no GitHub writes. |
| 2. Draft PR, if earned | Separately approve a scoped publisher and add duplicate/retry handling. | Approved, unchanged evidence produces one draft PR; stale, altered, unauthorized, or unverified evidence produces none. Replaying after a partial failure does not create a duplicate. |
| 3. Expand selectively | Add one job or trigger at a time. Consider CI follow-through or production signals only after the first job is useful. | Every added job has an owner, a verification recipe, a budget, and a disable switch. Improvements to policy go through normal human review. |

Evaluate workflow correctness on scripted link repair and agent value on a separate bounded docs-drift cohort. Report acceptance on eligible cases only and require zero unauthorized writes or false `ready` results in negative tests. Use the [pilot metrics](../design/software-factory.md#pilot-economics-and-ongoing-improvement) to compare maintainer effort, outcome quality, and cost against the relevant baseline.

## Open decisions before building

1. Which GitHub repository and maintainer should own the pilot?
2. Can private source be sent to the selected model and hosted sandbox, or must both run in an approved internal environment?
3. Is a docs-link job a useful first task, or does the team have another tightly bounded job with a better existing verifier?

After sign-off, build the fail-before/pass-after check and exercise the whole GitHub Actions path with a deterministic patch producer. Add the agent only once the verifier can distinguish an acceptable patch from a convincing but wrong one. If links do not justify an agent, keep that job deterministic and test the agent on a small docs-drift task with its own independent acceptance check.

### Practice for the synthetic handoff

Adopt [GitHub Actions job artifacts](https://docs.github.com/en/actions/tutorials/store-and-share-data) as the handoff. The manual smoke workflow uses the checked-in synthetic request, not free-form dispatch inputs. One job prepares and proposes. A second job checks out the same commit, reconstructs the trusted run spec, and verifies the downloaded candidate. Transfer only the candidate by artifact ID. Use digest mismatch as an error. A single-job demo would not exercise the handoff, and an external worker would add infrastructure without proving more in this slice. The workflow grants no write permissions and does not establish the independent gate required for private-source runs.
