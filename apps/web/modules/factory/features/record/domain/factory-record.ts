export const FACTORY_RECORD = {
  acceptance: "4 / 5",
  maintainerMinutes: "12",
  falseReady: "0",
  costPerAccepted: "sample spend / 4",
  zeroAcceptanceCohort: "sample spend / 0 acceptances",
  clusterTitle: "Wrong destination still resolves",
  proposedDiff: `--- a/apps/factory/src/jobs/docs_link.rs
+++ b/apps/factory/src/jobs/docs_link.rs
@@
-accept when the destination file exists
+accept only when the destination equals the approved target
`,
} as const;
