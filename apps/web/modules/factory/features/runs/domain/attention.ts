import type { FactoryRunStatus, FactoryRunSummary } from "./types";

export const ATTENTION_FILTERS = [
  "all",
  "ready",
  "needs_input",
  "failed",
] as const;

export type AttentionFilter = (typeof ATTENTION_FILTERS)[number];

const FAILED: ReadonlySet<FactoryRunStatus> = new Set([
  "verification_failed",
  "policy_rejected",
  "infrastructure_failed",
  "budget_exhausted",
  "cancelled",
  "evidence_unavailable",
  "stale_base",
]);

export function countAttention(runs: FactoryRunSummary[]) {
  return {
    ready: runs.filter((run) => run.status === "ready").length,
    needs_input: runs.filter((run) => run.status === "needs_input").length,
    failed: runs.filter((run) => FAILED.has(run.status)).length,
  };
}

export function matchesAttentionFilter(
  run: FactoryRunSummary,
  filter: AttentionFilter,
): boolean {
  if (filter === "all") return true;
  if (filter === "ready") return run.status === "ready";
  if (filter === "needs_input") return run.status === "needs_input";
  return FAILED.has(run.status);
}
