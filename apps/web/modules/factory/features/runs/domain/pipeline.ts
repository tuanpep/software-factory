import type { FactoryRunStatus } from "./types";

/** Factory pipeline, in execution order. Same four stages on every run. */
export const PIPELINE_STAGE_IDS = [
  "queue",
  "produce",
  "verify",
  "review",
] as const;

export type PipelineStageId = (typeof PIPELINE_STAGE_IDS)[number];

export const PIPELINE_STAGE_STATES = [
  "pending",
  "running",
  "success",
  "failed",
  "canceled",
  "skipped",
  "warning",
  "manual",
] as const;

export type PipelineStageState = (typeof PIPELINE_STAGE_STATES)[number];

export type PipelineStage = {
  id: PipelineStageId;
  state: PipelineStageState;
};

function stages(
  queue: PipelineStageState,
  produce: PipelineStageState,
  verify: PipelineStageState,
  review: PipelineStageState,
): PipelineStage[] {
  return [
    { id: "queue", state: queue },
    { id: "produce", state: produce },
    { id: "verify", state: verify },
    { id: "review", state: review },
  ];
}

/**
 * Stage graph for monitoring. Verifier failures land on Verify.
 * Actions-level outcomes (infrastructure, budget, cancel) stay off Verify
 * so the graph does not invent a factory verdict.
 */
export function pipelineStages(status: FactoryRunStatus): PipelineStage[] {
  switch (status) {
    case "queued":
      return stages("running", "pending", "pending", "pending");
    case "producing":
      return stages("success", "running", "pending", "pending");
    case "verifying":
      return stages("success", "success", "running", "pending");
    case "ready":
      return stages("success", "success", "success", "manual");
    case "needs_input":
      return stages("warning", "skipped", "skipped", "skipped");
    case "policy_rejected":
    case "verification_failed":
      return stages("success", "success", "failed", "skipped");
    case "stale_base":
      return stages("success", "success", "success", "warning");
    case "evidence_unavailable":
      return stages("success", "success", "warning", "skipped");
    case "cancelled":
      return stages("canceled", "skipped", "skipped", "skipped");
    case "infrastructure_failed":
    case "budget_exhausted":
      return stages("warning", "skipped", "skipped", "skipped");
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}

/** Overall run icon. Text beside it still carries the specific status. */
export function pipelineStatusState(
  status: FactoryRunStatus,
): PipelineStageState {
  switch (status) {
    case "queued":
    case "producing":
    case "verifying":
      return "running";
    case "ready":
      return "success";
    case "needs_input":
    case "stale_base":
      return "warning";
    case "policy_rejected":
    case "verification_failed":
    case "infrastructure_failed":
    case "budget_exhausted":
    case "evidence_unavailable":
      return "failed";
    case "cancelled":
      return "canceled";
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}
