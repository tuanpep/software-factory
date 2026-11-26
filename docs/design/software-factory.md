# Software factory: system design and rollout

**Status: proposed.** This is the design for an internal, GitHub-first maintenance tool, not a general-purpose agent platform. See the [decision record](../adr/001-software-factory-design.md) and [source research](../research/software-factory-sources.md).

The [harness proposal](software-factory-harness-proposal.md) defines the pilot decision and acceptance gates. The [harness design](software-factory-harness.md) specifies the CLI, fixtures, verifier, artifact checks, and adapter boundaries for the first job.

The [full tool blueprint](software-factory-blueprint.md) shows the user experience, installation topology, and integration contracts across pilot and later phases.

The [web client proposal](software-factory-web-client.md) explores a read-only maintainer view. The artifact pilot still runs without a web app.

## What the first user gets

A maintainer enters an issue number, Markdown path, broken link and intended destination in GitHub Actions. Those dispatch values are the approved task. The issue is context, not authority to change the task. A successful run returns a small patch with a receipt. The maintainer reviews it and uses the normal GitHub process to publish and merge; the factory does not create a branch or PR in the pilot.

```text
Issue #42 · Repair the setup guide link
Scope: docs/setup.md · relative link target only
Expected: links to docs/install.md, not just to any existing file

Result: ready for human review
Before: link unresolved  /  After: approved target resolves
Policy: one link changed; no other content modified
Evidence: base revision, exact patch digest, verifier revision, check output
Not checked: whether the linked instructions work on each OS
Next step: review the patch or rerun against the current base
```

The example is illustrative, not a run result. A `needs_input` outcome names the missing decision. A completed check can accept or reject a patch; an infrastructure failure produces no verifier receipt. GitHub run status is authoritative for cancellation or interruption, and the human-readable summary is best effort.

## Workflow and the references behind it

The pilot path is **agree on intent → produce a patch → verify it independently → hand it to a maintainer**. Draft PR publication and follow-through are later additions. The [research notes](../research/software-factory-sources.md) distinguish directly read sources from references available only through excerpts or Traycer's summary.

| Step | Reference | What the factory does |
| --- | --- | --- |
| Agree on intent | [Matt Pocock's skills](https://github.com/mattpocock/skills); [Dex Horthy's lights-on design](https://x.com/dexhorthy/status/2081058573556306030), as summarized by Traycer | Use the maintainer's structured dispatch values as the approved intent. If the destination is missing or the selected link cannot be identified uniquely, return `needs_input` before starting the producer. |
| Propose an edit | [Traycer's one-job approach](https://traycer.ai/blog/how-to-build-a-software-factory), [Warp's crawl/walk/run](https://warp.dev/blog/adopting-the-software-factory-model-crawl-walk-run), and [Sandcastle](https://github.com/mattpocock/sandcastle/blob/main/docs/guide/branch-strategies.md) | Start with one manual GitHub trigger and a deterministic producer. Evaluate OpenCode as a challenger in a disposable guest. Export only the bounded candidate edit; the verifier generates the patch. Do not adopt Sandcastle's host checkout or write-back defaults. |
| Verify and hand off | [Lauren Tan's pstack](https://github.com/cursor/plugins/tree/main/pstack) and [GitHub Next's PDD Kit](https://githubnext.com/projects/pdd-kit/) | A clean verifier checks the exact patch against approved intent, shows fail-before/pass-after evidence, and reports what it did not check. A maintainer reviews the diff and decides whether to publish. PDD Kit informs the receipt; it isn't a dependency or a claim of formal proof. |
| Follow the PR, later | [OpenAI's Symphony](https://openai.com/index/open-source-codex-orchestration-symphony) and Traycer | If draft publishing is approved separately, link the PR to its originating task. A changed PR head requires fresh evidence; bounded follow-up stops when scope or intent changes. A human still merges. |
| Improve the job | [Warp Factory Benchmarks](https://warp.dev/blog/warp-factory-benchmarks) and Pocock's `/retro` | Compare the manual, scripted, and agent paths on the same cases. Use recurring failures to propose reviewed changes to a check, context, or prompt. Keep the script if the agent doesn't reduce maintainer effort at comparable quality. |

### Before the tool runs

- **Repository readiness.** Pick a repo with an owner, a repeatable clean checkout, a bounded check command, and working required CI. Keep `AGENTS.md` short and point to architecture and a behavior map. A behavior entry names its owner, code location, setup, check, and expected evidence. Admit individual jobs only when their verification works in a clean environment.
- **Intent review.** The issue form can supply draft values, but the maintainer confirms the path, broken link, and destination in the dispatch itself. Intake records those values in the intent digest. It may capture the issue revision for traceability, but it cannot substitute values from the issue body or comments. If the issue is closed or its structured fields contradict dispatch, stop and ask for a fresh dispatch rather than silently changing scope. For larger future jobs, use an approved intent card with observed behavior, desired behavior, non-goals, evidence plan, and unresolved questions.
- **Version control.** Keep job manifests, verifier recipes, allowed tools, and reference fixtures on a protected revision. Review these changes as normal code. Product docs may provide context; content in the candidate cannot modify permission rules, trusted recipes, or runtime configuration.

## Control flow and component boundaries

```text
 GitHub: issue + manual dispatch                            GitHub: run summary
                |                                                      ^
                v                                                      |
 [Trusted intake + policy] --> eligible task --> [Producer host]       |
       |                          snapshot            |                |
       |                                           [Guest]             |
       |                               deterministic or OpenCode       |
       |                               approved model broker only      |
       |                                              |                |
       +--> pinned intent + base --> [Clean verifier] <+ candidate     |
                                             |                         |
                                             +--> receipt + patch -----+
```

The guest receives staged context, not an authenticated checkout. The trusted producer host owns sandbox allocation, TTL, the bounded model capability and reading back a single candidate file. The clean verifier gets the base and policy directly from trusted intake, not from the agent. It never runs the candidate's tests or hooks for the docs-link job. Only the verifier can mint a `ready` receipt. Read the [ADR's module map](../adr/001-software-factory-design.md#shape) as proposed responsibilities in one codebase, not a service-per-box deployment.

### Contracts

| Record | Required fields and ownership |
| --- | --- |
| `TaskRequest` | Repository ID, issue ID/number, dispatch actor ID, event/ref, revision, path, broken link, and intended destination. Intake validates the actor, trusted ref, and structured fields. Issue context never overrides dispatch. |
| `RunSpec` | Run ID, attempt, captured issue revision or content digest, intent digest, base SHA, job and policy revision, verifier recipe ID, exact link selector, required expected destination, runtime/image identifiers, and budget. Intake writes it only after resolving intent. |
| Producer candidate | For the docs-link job, a bounded structured edit, not raw diff text. The trusted verifier validates it and generates the reviewable patch itself. The patch and its digest are verifier outputs; producer success alone has no authority. |
| `EvidenceReceipt` | Schema version, run ID and attempt, input revisions, patch digest, changed paths, named checks and before/after outcomes, diagnostic references, assumptions, coverage gaps, and verdict. The trusted verifier emits it only when it completes with a definitive verdict. |
| `PublicationApproval` (later) | Authorized approver, repository, intended write, base SHA, intent and patch digests, verifier/policy revision, expiry and stable publication key. A permission or policy change, new patch, or stale base requires new approval. |

Pins make the conditions of an attempt observable, not model output reproducible. Record the exact provider model identifier where available and flag aliases that can drift. Keep workflow logic separate from model prompts. Configuration selects known jobs and verifier recipes by ID, not arbitrary shell strings.

### Lifecycle and recovery

| State or event | Outcome |
| --- | --- |
| Submitted | Validate current membership, repository enrollment, protected workflow identity, issue context, trusted base, scope and budget. Untrusted identity, ref, path, or scope is `policy_rejected`; missing or conflicting intent is `needs_input`. |
| Prepared → producing → verifying | Use one active run at a time for the pilot. A completed deterministic check yields `ready` or `verification_failed`; a verifier crash or unreadable environment yields `infrastructure_failed`, not an adverse finding about the patch. Use a `ready` artifact only if GitHub reports a successful, completed run and the receipt matches that exact run and attempt. |
| Cancel or timeout | Use GitHub's terminal status as the source of truth. A cancelled or timed-out run cannot authorize use of any artifact it uploaded. Revoke model access and request cleanup where possible; provider-side TTL handles loss of the orchestration job. Do not depend on a final summary writing successfully. |
| Provider unavailable or budget exceeded | Record `infrastructure_failed` or `budget_exhausted` when the workflow can report it. No automatic agent retries. Start a fresh manual dispatch and validate it again. Disable native reruns for this workflow's authorization purposes: attempts other than the first cannot reach the protected execution path. |
| `ready` but base moves | Existing receipt is historical, not authorization for a different base. Reverify on the new base before use; for a future publisher regenerate approval. |

GitHub run ID plus attempt is sufficient for pilot tracking, not exactly-once task intake. When webhooks arrive later, use the authenticated delivery ID to deduplicate deliveries and a separate repo/job/issue/intent identity to coalesce repeated work. One active claim per task. Prefer durable state only when asynchronous approvals, recovery, and cross-repo operations become real requirements.

## Verification, authority and data

| Layer | Gate or output |
| --- | --- |
| Intent | The expected target is explicitly approved at dispatch, including for synthetic test runs. Require one unambiguous match for the source link; repeated matching links return `needs_input` rather than changing one arbitrarily. A producer suggestion is not the expected answer. |
| Scope | One existing regular Markdown file, one allowed relative link destination edit, no renames, symlinks, file mode changes, workflow edits or unrelated content. Cap candidate and artifact sizes. |
| Behavior | Show the specific link failing on the pinned base and resolving to the approved target after the patch. An already-valid baseline does not demonstrate a repair. The check runs without networking or candidate commands. |
| Review | For the pilot, the maintainer reads the tiny diff and receipt. Later, blind review sees intent, diff and independent evidence, not the author's rationale. Its findings are advisory, must cite evidence, and cannot satisfy a required check. |
| Higher-risk jobs | CLI: run the real command on controlled fixtures and capture output. UI: run the actual journey on an isolated build and attach a recording or screenshot alongside assertions. Concurrency: consider a small state model and replay relevant cases against the implementation. Record test coverage, assumptions, and anything not checked separately. |

**What stays human.** Product direction, risk exceptions, architecture decisions, merge, release, rollback of deployed product, and public replies. Auth, billing, production config, CI/workflow policy and secrets are excluded from autonomous factory jobs. The pilot never takes customer data or production credentials. This tool proposes changes to owned repositories; it has no external scanning or exploit-development job.

**Credentials and network.** Trusted intake uses read-only access limited to the enrolled repo. The guest has no GitHub token, cloud credential, host mount, or production access. Model traffic goes through an approved broker or equivalent run-scoped capability; network policy is enforced outside the guest, not by a prompt. The privileged publisher, if built later, cannot run candidate code and is not reachable as an agent tool. Keep branch protection in place. Reject workflow/policy changes on the machine publication path even if the job requests an exception.

**GitHub execution gate.** The synthetic slice uses a repo with no sensitive credentials and grants no GitHub write permissions. Before private-source agent execution, add a gate outside the dispatched workflow revision: a centrally managed broker owns sandbox and model credentials and independently checks GitHub's authenticated run identity against enrollment policy. Require the enrolled repository, approved workflow path and revision on the selected protected default branch, a manual dispatch, attempt one, and a currently allowlisted initiating actor. Resolve actor and run metadata from GitHub or verified identity claims, not assertions supplied by the workflow. Do not put broker bypass credentials in repository secrets. If these checks cannot be enforced outside the workflow, keep the pilot synthetic. GitHub's [dispatch behavior](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflow_dispatch) and [rerun privilege rules](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/re-run-workflows-and-jobs) are why an in-workflow ref check alone is insufficient.

**Data handling.** Send the minimum approved source context. Use a synthetic repository until both the model destination and sandbox satisfy source residency, retention, and access requirements. Keep run metadata and redacted evidence separate from raw diagnostics. Default to no retained transcripts, and propose a short artifact TTL, for example seven days subject to organization policy. Freeze only approved, sanitized cases into the replay set. The operator must be able to pause a job, revoke credentials, and locate affected run IDs without retaining full source in logs.

## From patch review to a shared factory

| Slice | Build and demonstrate | Admission gate |
| --- | --- | --- |
| 0. Check the job | Pair with the maintainer. Seed one broken link, one correct patch, one plausible wrong destination and one unrelated edit. Build the verifier first. | The correct patch is accepted and each incorrect variant is rejected. If the author cannot demonstrate intent independently, choose another job. |
| 1. Run end to end | Dispatch via GitHub Actions. Start with a deterministic candidate generator. Record one complete receipt; test cancellation and rerun. | Allowed maintainer/ref works; denied actor/ref cannot reach runner. Invalid artifacts cannot yield `ready`. No GitHub writes. |
| 2. Test the agent | Run OpenCode with one pinned, approved model in the isolated guest. Use link fixtures to test the boundary, then evaluate the agent on a bounded docs-drift task. | Confirm an allowed dispatch works and an unapproved ref, unauthorized actor, or native rerun cannot allocate a sandbox or obtain model access. Test prohibited egress, budget and disposal. Promote the agent only on tasks where it improves the team's baseline. |
| 3. Draft PR by approval | Build a separate publisher only if manual publication is a real bottleneck. Persist compact audit and reconciliation records before introducing unattended writes. | Approved fresh receipt creates at most one draft. Revoked/expired approval, altered patch, wrong repo, or changed base creates none in preflight tests. Simulate a crash between provider write and local recording. Do not claim an atomic guarantee across GitHub and the factory. |
| 4. Follow a PR | Treat the issue/run as the owner record. Watch approved GitHub status updates for the linked PR. Produce a proposed correction or ask one question. | Reconcile by current head, not a stale CI log or event. Each new head needs fresh evidence and the normal approvals. Cap attempts and stop on external edits, expanded scope, cancellation, or ambiguous failures. Human still merges. |
| 5. Add a trigger and learn | Add one approved internal signal, initially as read-only triage. Normalize and dedupe before creating work, redact evidence, and keep operator review. Start a regular retrospective on failed and rejected runs. | No raw production payload in model context. No backlog fan-out, auto-deploy, or automated customer messages. Support owner verifies a release before a person sends any reply. |

For slice 3, a deterministic branch name and stable publication key let the publisher check whether a timed-out write actually happened before retrying. Check approval and current base immediately before writing; reconcile against actual external refs after writing. If the base moves during that gap, mark the result stale and stop follow-through. Never reuse approval for a changed candidate. For slice 4, consume verified events and reconcile occasionally when needed; no open-ended loop. A reasonable starting limit is one follow-up attempt per reviewed head, with a separate cap per issue and human handoff on exhaustion.

## Stack choices and triggers for changing them

| Decision | Choose now | Revisit when |
| --- | --- | --- |
| Build vs. platform | GitHub Actions plus a small Rust core library and thin CLI in one Cargo package. We own intent, evidence and the write boundary. | If an approved managed product meets those requirements, evaluate it on the same fixtures before maintaining our own infrastructure. |
| Agent and execution | Start deterministic. Evaluate one OpenCode runtime in a disposable, policy-controlled guest. Prefer organization-approved isolation; E2B is a candidate, not an approval. | Compare Codex/Claude Code or other approved runtimes with the same tasks and controls when cost or quality justifies a change. Sandbox adapters can change without altering receipts. |
| Always-on coordination | No webhook service, queue, dashboard or Temporal for the artifact pilot. | Compare an Actions extension with a durable worker when runs need multi-day approval, reliable dispatch reconciliation, or cross-repo concurrency. Symphony is scheduler design reading, not a security boundary. Consider Temporal for durable execution, PostgreSQL for queryable business/audit state, and object storage only when artifact retention requires it. |
| Job UX | GitHub issue, run summary, and an artifact link. | Reuse the existing tracker or chat channel only after a GitHub-first pilot works. Route notifications from rule-based outcomes with dedupe, rate limits and quiet hours; never silently suppress an approval request. |

See the [ADR's stack and adoption evidence](../adr/001-software-factory-design.md#stack-and-adoption-evidence) for why the baseline is familiar and where popularity data stops being useful.

## Pilot economics and ongoing improvement

Run two separate evaluations. Use link repair to verify the factory's intake, patch validation, receipt, and handoff against the deterministic baseline. Keep link repair scripted if that is cheaper to review. To decide whether OpenCode helps, use a bounded but nontrivial docs-drift case, such as correcting a CLI usage example that no longer matches the real command. Give both human and agent the same requested behavior and check the revised example with a trusted fixture; do not prescribe the edit. Include a deterministic baseline where one is practical. Start with 20 representative cases across the evaluations and report each cohort separately. Count only preclassified eligible tasks in the acceptance rate and require zero false `ready` results on known-denial cases. Record exact counts; this is a decision aid, not a forecast.

| Metric | How to count it |
| --- | --- |
| Acceptance and rework | Eligible tasks accepted without substantive manual edits divided by eligible tasks attempted, including failed attempts. Report denied work separately. Suggested acceptance threshold: at least 80%. |
| Human effort | Minutes to prepare, review and correct the result, compared with doing the fix manually. An agent run that is fast to produce but slow to review is a loss. |
| Latency and reliability | Report dispatch-to-receipt time, time waiting on humans, and terminal reason counts separately. Track false accepts, stale receipts, and missing cleanup as guardrail failures. |
| Cost | Model, runner and platform spend over all attempts divided by accepted changes. Report human time alongside it. If no changes were accepted, report spend and zero acceptances rather than an invented ratio. |
| Adoption and shipped outcomes (later) | Track repeat use, accepted/merged changes and reversions by job after PR publishing exists. Do not count generated patches as shipped work. |

Review failure clusters weekly once there is enough traffic. Decide whether each cluster needs a repository fix, a deterministic check, better context or a prompt change, in that order. Change one variable at a time and replay old fixtures at the same base revisions. Use an untouched holdout and sample human judgments to catch metric gaming. Model reviewers can suggest where to look; they cannot grade their way around deterministic gates. An improvement is a reviewed change to configuration or code, not a live self-edit. Do not increase concurrency when the review queue is already full.

## Decisions needed before implementation

1. Name the pilot repository, job owner and verifier owner. Confirm GitHub is the actual system of record.
2. Approve the source-data boundary, sandbox/provider and small pilot spend limit. Use synthetic data if any approval is unresolved.
3. Agree on the first job and its baseline. If docs-link repair is too rare, choose a similarly bounded docs-drift case with a trusted desired result.
4. Decide who can pause the factory and who handles a suspect receipt. Approve write-enabled phases separately, after reviewing fixture and pilot results.

**First implementation slice after approval:** one synthetic issue and three fixtures: a correct patch, a resolving link to the wrong destination, and a patch with an unrelated edit. Accept only the correct patch and show why in the GitHub Actions summary. This slice needs no AI, sensitive credentials, or GitHub write permission.
