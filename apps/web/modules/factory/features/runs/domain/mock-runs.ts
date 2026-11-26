import type { FactoryRunDetail } from "./types";

const REPOSITORY = "maintainer-org/software-factory";
const JOB_ID = "docs-link";
const RECIPE_ID = "docs-link/v1";
const BASE_SHA = "8b2c4f1a9e0d7c6b5a4938271605f4e3d2c1b0a9";
const INTENT_DIGEST =
  "4911e69ba9cb699997008da6cb2398d8f832d568401b3e6619babf49804675dd";

const DOCS_SETUP_INTENT = {
  markdownPath: "docs/setup.md",
  brokenLink: "./old-install.md",
  destination: "./install.md",
} as const;

const READY_PATCH = `--- a/docs/setup.md
+++ b/docs/setup.md
@@ -1,3 +1,3 @@
 # Setup
 
-Read the [installation guide](./old-install.md) first.
+Read the [installation guide](./install.md) first.
`;

const COVERAGE_GAPS = [
  "Whether the installation instructions work",
  "GitHub identity and Git provenance (local snapshot)",
] as const;

/**
 * Credential-free prototype runs for the Factory Runs UI.
 * Statuses mirror genuine local replay and Actions outcomes from the design.
 */
export const MOCK_RUNS: FactoryRunDetail[] = [
  {
    id: "1042",
    attempt: 1,
    jobId: JOB_ID,
    repository: REPOSITORY,
    status: "ready",
    startedAt: "2026-11-26T10:00:00.000Z",
    title: "Repair docs/setup.md → ./install.md",
    approvedIntent: { ...DOCS_SETUP_INTENT },
    baseSha: BASE_SHA,
    recipeId: RECIPE_ID,
    checks: [
      {
        name: "Link destination",
        before: "Original destination missing",
        after: "Approved destination resolves",
      },
    ],
    coverageGaps: [...COVERAGE_GAPS],
    patchUnified: READY_PATCH,
    receipt: {
      version: 1,
      status: "ready",
      reason: "approved_link_repaired",
      runId: 1042,
      attempt: 1,
      baseRevision: "synthetic-v1",
      intentDigest: INTENT_DIGEST,
      recipe: RECIPE_ID,
      changedPaths: ["docs/setup.md"],
      before: "original_destination_missing",
      after: "approved_destination_resolves",
      patchSha256:
        "a3f5c8e2b1d09476e5a4c3b2f1e0d9c8b7a6958473625140f9e8d7c6b5a49382",
      notChecked: [...COVERAGE_GAPS],
    },
    nextAction: "Confirm the current base before using the patch.",
    githubRunUrl: `https://github.com/${REPOSITORY}/actions/runs/1042`,
  },
  {
    id: "1043",
    attempt: 1,
    jobId: JOB_ID,
    repository: REPOSITORY,
    status: "needs_input",
    startedAt: "2026-11-26T11:15:00.000Z",
    title: "Missing destination for docs/setup.md",
    approvedIntent: {
      markdownPath: "docs/setup.md",
      brokenLink: "./old-install.md",
      destination: "",
    },
    baseSha: BASE_SHA,
    recipeId: RECIPE_ID,
    checks: [],
    coverageGaps: [...COVERAGE_GAPS],
    patchUnified: null,
    receipt: {
      version: 1,
      status: "needs_input",
      reason: "missing_link_or_destination",
      runId: 1043,
      attempt: 1,
      baseRevision: "synthetic-v1",
      intentDigest: INTENT_DIGEST,
      recipe: RECIPE_ID,
      changedPaths: [],
      before: "original_destination_missing",
      after: "not_accepted",
      patchSha256: null,
      notChecked: [...COVERAGE_GAPS],
    },
    nextAction: "Supply an approved destination and start a fresh dispatch.",
    githubRunUrl: `https://github.com/${REPOSITORY}/actions/runs/1043`,
  },
  {
    id: "1044",
    attempt: 1,
    jobId: JOB_ID,
    repository: REPOSITORY,
    status: "verification_failed",
    startedAt: "2026-11-26T12:30:00.000Z",
    title: "Wrong destination for docs/setup.md",
    approvedIntent: {
      markdownPath: "docs/setup.md",
      brokenLink: "./old-install.md",
      destination: "./overview.md",
    },
    baseSha: BASE_SHA,
    recipeId: RECIPE_ID,
    checks: [
      {
        name: "Link destination",
        before: "Original destination missing",
        after: "Not accepted",
      },
    ],
    coverageGaps: [...COVERAGE_GAPS],
    patchUnified: null,
    receipt: {
      version: 1,
      status: "verification_failed",
      reason: "destination_not_approved",
      runId: 1044,
      attempt: 1,
      baseRevision: "synthetic-v1",
      intentDigest: INTENT_DIGEST,
      recipe: RECIPE_ID,
      changedPaths: [],
      before: "original_destination_missing",
      after: "not_accepted",
      patchSha256: null,
      notChecked: [...COVERAGE_GAPS],
    },
    nextAction: "Review the receipt reason, then start a fresh dispatch.",
    githubRunUrl: `https://github.com/${REPOSITORY}/actions/runs/1044`,
  },
  {
    id: "1045",
    attempt: 1,
    jobId: JOB_ID,
    repository: REPOSITORY,
    status: "cancelled",
    startedAt: "2026-11-26T13:00:00.000Z",
    title: "Cancelled docs/setup.md repair",
    approvedIntent: { ...DOCS_SETUP_INTENT },
    baseSha: BASE_SHA,
    recipeId: RECIPE_ID,
    checks: [],
    coverageGaps: [...COVERAGE_GAPS],
    patchUnified: null,
    receipt: {
      version: 1,
      status: "cancelled",
      reason: "workflow_cancelled",
      runId: 1045,
      attempt: 1,
      baseRevision: "synthetic-v1",
      intentDigest: INTENT_DIGEST,
      recipe: RECIPE_ID,
      changedPaths: [],
      before: "original_destination_missing",
      after: "not_accepted",
      patchSha256: null,
      notChecked: [...COVERAGE_GAPS],
    },
    nextAction: "Open the GitHub run for details, or start a fresh dispatch.",
    githubRunUrl: `https://github.com/${REPOSITORY}/actions/runs/1045`,
  },
  {
    id: "1046",
    attempt: 1,
    jobId: JOB_ID,
    repository: REPOSITORY,
    status: "verifying",
    startedAt: "2026-11-26T14:20:00.000Z",
    title: "Verifying docs/setup.md repair",
    approvedIntent: { ...DOCS_SETUP_INTENT },
    baseSha: BASE_SHA,
    recipeId: RECIPE_ID,
    checks: [],
    coverageGaps: [...COVERAGE_GAPS],
    patchUnified: null,
    receipt: {},
    nextAction: "Wait for the verifier job to finish.",
    githubRunUrl: `https://github.com/${REPOSITORY}/actions/runs/1046`,
  },
  {
    id: "1047",
    attempt: 1,
    jobId: JOB_ID,
    repository: REPOSITORY,
    status: "stale_base",
    startedAt: "2026-11-25T09:00:00.000Z",
    title: "Stale base for docs/setup.md repair",
    approvedIntent: { ...DOCS_SETUP_INTENT },
    baseSha: "0000000000000000000000000000000000000000",
    recipeId: RECIPE_ID,
    checks: [
      {
        name: "Link destination",
        before: "Original destination missing",
        after: "Approved destination resolves",
      },
    ],
    coverageGaps: [...COVERAGE_GAPS],
    patchUnified: READY_PATCH,
    receipt: {
      version: 1,
      status: "ready",
      reason: "approved_link_repaired",
      runId: 1047,
      attempt: 1,
      baseRevision: "synthetic-v1-old",
      intentDigest: INTENT_DIGEST,
      recipe: RECIPE_ID,
      changedPaths: ["docs/setup.md"],
      before: "original_destination_missing",
      after: "approved_destination_resolves",
      patchSha256:
        "a3f5c8e2b1d09476e5a4c3b2f1e0d9c8b7a6958473625140f9e8d7c6b5a49382",
      notChecked: [...COVERAGE_GAPS],
    },
    nextAction:
      "Base moved since this receipt. Start a fresh dispatch against the current base.",
    githubRunUrl: `https://github.com/${REPOSITORY}/actions/runs/1047`,
  },
];

export function getMockRun(id: string): FactoryRunDetail | undefined {
  return MOCK_RUNS.find((run) => run.id === id);
}

export function listMockRunSummaries() {
  return MOCK_RUNS.map(
    ({ id, attempt, jobId, repository, status, startedAt, title }) => ({
      id,
      attempt,
      jobId,
      repository,
      status,
      startedAt,
      title,
    }),
  );
}
