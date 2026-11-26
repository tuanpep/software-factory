import type { FactoryRunDetail, JobPluginManifest } from "./types";

export type IntentCardInput = {
  markdownPath: string;
  brokenLink: string;
  destination: string;
  openQuestions: string;
};

export function statusForIntentCard(
  openQuestions: string,
): "ready" | "needs_input" {
  return openQuestions.trim() ? "needs_input" : "ready";
}

export function createLocalRun(input: {
  plugin: JobPluginManifest;
  fields: IntentCardInput;
  producer: string;
}): FactoryRunDetail {
  const status = statusForIntentCard(input.fields.openQuestions);
  const id = `local-${Date.now()}`;
  const runId = Number.parseInt(id.replace(/\D/g, "").slice(-6), 10) || 1;
  const title = `Repair ${input.fields.markdownPath} → ${input.fields.destination}`;
  const ready = status === "ready";

  return {
    id,
    attempt: 1,
    jobId: input.plugin.id,
    repository: "local/mock",
    status,
    startedAt: new Date().toISOString(),
    title,
    approvedIntent: {
      markdownPath: input.fields.markdownPath,
      brokenLink: input.fields.brokenLink,
      destination: input.fields.destination,
    },
    baseSha: "local-mock-base",
    recipeId: input.plugin.recipeId,
    checks: ready
      ? [
          {
            name: "Link destination",
            before: "Original destination missing",
            after: "Approved destination resolves",
          },
        ]
      : [],
    coverageGaps: [
      "Whether the installation instructions work",
      "GitHub identity and Git provenance (local mock)",
    ],
    patchUnified: ready
      ? `--- a/${input.fields.markdownPath}
+++ b/${input.fields.markdownPath}
@@ -1,3 +1,3 @@
 # Setup
 
-Read the [installation guide](${input.fields.brokenLink}) first.
+Read the [installation guide](${input.fields.destination}) first.
`
      : null,
    receipt: {
      version: 1,
      status,
      reason: ready ? `local_mock_${input.producer}` : "blocking_question",
      runId,
      attempt: 1,
      baseRevision: "local-mock",
      intentDigest: "local-mock-intent",
      recipe: input.plugin.recipeId,
      changedPaths: ready ? [input.fields.markdownPath] : [],
      before: "original_destination_missing",
      after: ready ? "approved_destination_resolves" : "not_accepted",
      patchSha256: null,
      notChecked: [
        "Whether the installation instructions work",
        "GitHub identity and Git provenance (local mock)",
      ],
    },
    nextAction: ready
      ? "Confirm the current base before using the patch."
      : "Supply an approved destination and start a fresh dispatch.",
  };
}
