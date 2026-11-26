# Software factory web client

**Status:** [`apps/web/`](../../apps/web/) provides the Factory Runs screen and can link to the synthetic workflow for one configured repository. It does not read run history or serve the former fixture prototype. GitHub Actions still runs the job, the Rust verifier still decides the verdict, and maintainers still publish changes through GitHub. See the [harness design](software-factory-harness.md) and the [synthetic handoff decision](../adr/001-software-factory-design.md#practice-for-the-synthetic-handoff).

## Who it helps

Start with the maintainer reviewing a single docs-link repair. They need to answer: What was requested? Did the verifier check that exact change? What should I do next? Today those answers are split across an Actions run, a JSON receipt, and a patch. The web client should put them on one page without sending a maintainer through a second approval process.

Requesters keep filing GitHub issues. Operators keep enrolling repos and managing policy outside the client. No requester portal, global job catalog, settings dashboard, agent chat, or PR button in the first version.

## Options considered

| Direction | Advantages | Decision |
| --- | --- | --- |
| Improve the GitHub run summary | No separate app or login. It is the baseline for testing whether a web UI helps at all. | Keep it as the fallback. |
| Build a small evidence viewer | One page can put the approved intent, verdict, before/after checks, and diff next to each other. GitHub still owns runs and review. | Prototype this first. Add live reads only after the evidence handoff is tested. |
| Build a job-starting portal | A structured form can prevent incomplete requests and later guide users across jobs. [Backstage Software Templates](https://backstage.io/docs/features/software-templates/) offers a useful pattern: choose a job, fill in required fields, then review the exact inputs before starting. | Defer. If the team already uses Backstage, consider embedding the viewer there rather than standing up a separate portal. |

## First screens

1. **Runs.** Show recent runs for one configured repository and workflow: run ID, attempt, start time, and status. Put **Start in GitHub** above the list. It opens the workflow page; the maintainer completes the dispatch there. No free-form repository URLs or editable production-like inputs for the fixed fixture.
2. **Run detail.** Lead with **what happened** and **what to do next**. Show the intended destination and changed path if known, the run and attempt, pinned base, verifier recipe, before/after checks, and coverage gaps. Put a unified diff below the checks, with an optional receipt view and a link to the original Actions run. In live mode, any preview or download must pass the same server-side check. Keep diagnostics in GitHub for the first version.

```text
Software Factory / Runs / #1042 · attempt 1

Ready for human review                         Open GitHub run
Synthetic fixture only · No repository changes made

Requested   docs/setup.md: ./old-install.md → ./install.md
Before      Original destination missing
After       Approved destination resolves
Not checked Whether the installation instructions work
Evidence    Base 8b2… · Recipe docs-link/v1 · Patch SHA-256 …

Diff
- Read the [installation guide](./old-install.md) first.
+ Read the [installation guide](./install.md) first.

Next        Confirm the current base before using the patch.
```

The mockup uses sample data. In the current workflow, the issue, path, and destinations come from the checked-in fixture, not dispatch fields. The receipt has check results but does not carry that full request. Use the fixture at the pinned commit when showing live intent, or omit details the client cannot establish. Do not infer approved intent from patch text.

Use text labels, not just green or red. Keep the diff readable with a keyboard and at a narrow viewport. Announce meaningful status changes without announcing every refresh. When a run needs a decision, give the maintainer the next action instead of a raw error code. Retry means **start a fresh dispatch**, not **rerun this attempt**.

| Condition | What the page says |
| --- | --- |
| GitHub reports queued or in progress | Waiting for a runner, producing, or verifying, based on the job states available. Don't guess percentages or show a patch. |
| Failed, skipped, cancelled, or timed out | Show that Actions outcome first. Link to the run for details; don't guess a factory verdict from a failed job. If trusted diagnostic evidence is added later, show its reason separately. |
| Completed successfully, evidence missing or expired | Show **Evidence unavailable**, not **Ready**. Distinguish this from a temporary GitHub/API failure with a manual refresh option. |
| Evidence mismatches policy, attempt, base, or digest | Show **Evidence could not be verified**. No preview or download. |
| Completed successfully, but the client does not validate evidence yet | Show **Workflow succeeded**, with **Review evidence in GitHub**. Do not show a factory verdict. |
| Completed successfully and evidence passes | Show **Ready for human review**, never **Approved** or **Merged**. A receipt for an older base is historical; show that the base moved and require a new verification before use. If current base cannot be checked, do not label the patch current. |

## Practice and ownership

The client keeps the supplied Next.js App Router template's theme and locale setup, recorded in the [web client template decision](../adr/002-web-client-template.md). If maintainers prefer the proposed view to the GitHub summary, add read-only run metadata through a server-only adapter. [Next.js documents this pattern](https://nextjs.org/docs/app/guides/backend-for-frontend). No deployment has been chosen.

```text
Browser → authenticated web server → GitHub run / attempt / evidence APIs
                                 ↘ verify evidence eligibility → review view
GitHub Actions → factory CLI → Rust verifier → receipt + patch
```

The browser gets a small view model, not upstream credentials or arbitrary artifact URLs. The server checks session and repository access on every read, including evidence endpoints. Scope GitHub access to the synthetic repo and grant only the read permissions the integration needs. Keep authenticated evidence out of shared caches. Use GitHub run and attempt as identifiers, not the issue number or whichever run appears newest. Refresh only while the run is active, back off on API errors, and stop at a terminal state. No database, queue, webhook service, or invocation of the Rust CLI from a web request.

### Live evidence gate

The [Actions run artifact API](https://docs.github.com/en/rest/actions/artifacts#list-workflow-run-artifacts) can list artifacts for a run; the [attempt jobs API](https://docs.github.com/en/rest/actions/workflow-jobs#list-jobs-for-a-workflow-run-attempt) can confirm the verifier job finished. Neither an artifact name nor a successful job listed alongside it proves that the job uploaded that particular artifact. The current workflow validates the candidate transfer and checks the final receipt inside the verifier job, but it does not publish a job-to-evidence-ID binding that the web client has tested. Start the live view with **Open in GitHub** for evidence. Before serving a patch in the app, agree on and test a verifier-owned artifact binding, such as a verifier-origin attestation. Don't treat artifact naming alone as provenance.

At preview and download time, validate the enrolled repository, approved workflow and ref/revision policy, dispatch event, exact run and first attempt, successful terminal run and verifier job, and the trusted evidence artifact binding. Require a supported receipt with `ready`, exact run/attempt/base, the expected intent binding from trusted intake/verification metadata, and SHA-256 matching the exact patch bytes. Recheck against the current base before calling the patch usable. Bound archive size and extraction, treat artifact text as data, and do not forward GitHub auth to the short-lived archive redirect. If any required check is missing, keep the GitHub link and disable patch preview and download.

### If the client needs to start jobs later

The [GitHub REST API `2026-03-10` change](https://docs.github.com/en/rest/about-the-rest-api/breaking-changes#version-2026-03-10) specifies a `200` dispatch response with the run ID and URLs. Pin and verify that behavior on the target GitHub host before depending on it. Use the returned run ID; do not correlate an uncertain dispatch with the latest run or retry blindly. Dispatch requires Actions write authority in the web integration, separate from the read-only workflow token. That is a separate approval, even though it does not publish repository content. Before enabling it, choose an actor model that preserves maintainer accountability, enforce repo/role/ref policy on the server, and address duplicate or ambiguous submissions. Only add editable request fields when trusted intake supports and validates them. Private source, models, and PR publication still require their own gates.

## Build and evaluate

| Slice | Done when |
| --- | --- |
| A. Credential-free prototype | Use genuine local replay outcomes and clearly marked mock Actions states. Show ready, rejected, running, cancelled, expired, and stale-base cases. Compare the same review task against the Actions summary with pilot maintainers. Record review time and whether they correctly identify scope, coverage gaps, and the next action. |
| B. Live run browser, read-only | An authorized maintainer can see the enrolled workflow and open its Actions run. Unauthenticated, unauthorized, wrong-repo, and wrong-workflow requests cannot read data. Include empty, loading, rate-limited, and unavailable states. Keep evidence in GitHub. |
| C. Trusted evidence viewer | A valid completed first attempt can show the verified preview. Wrong run/attempt, cancellation, altered bytes, missing provenance, expired evidence, and stale base cannot expose a usable patch. Test both preview and direct download endpoints. |

First decision: name the maintainer and synthetic repository, then test the run-detail page against today's GitHub summary. If the page doesn't make review clearer or faster, improve the summary instead of adding a deployment.
