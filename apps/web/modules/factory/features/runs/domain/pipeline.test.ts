import { expect, test } from "vitest";

import { pipelineStages, pipelineStatusState } from "./pipeline";
import { factoryRunStatusSchema, type FactoryRunStatus } from "./types";

const statuses = factoryRunStatusSchema.options;

test("covers every run status", () => {
  for (const status of statuses) {
    expect(pipelineStages(status).map((stage) => stage.id)).toEqual([
      "queue",
      "produce",
      "verify",
      "review",
    ]);
    expect(pipelineStatusState(status)).toBeTruthy();
  }
});

test("moves the running marker from queue to verify", () => {
  expect(pipelineStages("queued").map((stage) => stage.state)).toEqual([
    "running",
    "pending",
    "pending",
    "pending",
  ]);
  expect(pipelineStages("producing").map((stage) => stage.state)).toEqual([
    "success",
    "running",
    "pending",
    "pending",
  ]);
  expect(pipelineStages("verifying").map((stage) => stage.state)).toEqual([
    "success",
    "success",
    "running",
    "pending",
  ]);
});

test("keeps a passed factory job waiting on review", () => {
  expect(pipelineStages("ready").map((stage) => stage.state)).toEqual([
    "success",
    "success",
    "success",
    "manual",
  ]);
  expect(pipelineStatusState("ready")).toBe("success");
});

test("marks verifier failures on verify and leaves review skipped", () => {
  for (const status of ["policy_rejected", "verification_failed"] as const) {
    expect(pipelineStages(status).map((stage) => stage.state)).toEqual([
      "success",
      "success",
      "failed",
      "skipped",
    ]);
  }
});

test("does not paint verify failed for actions-level outcomes", () => {
  const actionsLevel: FactoryRunStatus[] = [
    "infrastructure_failed",
    "budget_exhausted",
    "cancelled",
  ];

  for (const status of actionsLevel) {
    const verify = pipelineStages(status).find(
      (stage) => stage.id === "verify",
    );
    expect(verify?.state).not.toBe("failed");
  }
});
