import { expect, test } from "vitest";

import {
  factoryRunDetailSchema,
  factoryRunStatusSchema,
  type FactoryRunStatus,
} from "./types";

import { MOCK_RUNS, getMockRun, listMockRunSummaries } from "./mock-runs";

const REQUIRED_STATUSES: FactoryRunStatus[] = [
  "ready",
  "needs_input",
  "verification_failed",
  "cancelled",
  "verifying",
  "stale_base",
];

test("mock runs cover the required prototype statuses", () => {
  const statuses = new Set(MOCK_RUNS.map((run) => run.status));
  for (const status of REQUIRED_STATUSES) {
    expect(statuses.has(status)).toBe(true);
  }
});

test("every mock run status is a known FactoryRunStatus", () => {
  for (const run of MOCK_RUNS) {
    expect(() => factoryRunStatusSchema.parse(run.status)).not.toThrow();
  }
});

test("every mock run parses as FactoryRunDetail", () => {
  for (const run of MOCK_RUNS) {
    expect(() => factoryRunDetailSchema.parse(run)).not.toThrow();
  }
});

test("ready run includes a docs/setup.md link-fix patch", () => {
  const ready = MOCK_RUNS.find((run) => run.status === "ready");
  expect(ready).toBeDefined();
  expect(ready?.approvedIntent.markdownPath).toBe("docs/setup.md");
  expect(ready?.approvedIntent.brokenLink).toBe("./old-install.md");
  expect(ready?.approvedIntent.destination).toBe("./install.md");
  expect(ready?.patchUnified).toContain(
    "-Read the [installation guide](./old-install.md)",
  );
  expect(ready?.patchUnified).toContain(
    "+Read the [installation guide](./install.md)",
  );
});

test("getMockRun and listMockRunSummaries expose list helpers", () => {
  expect(getMockRun("1042")?.status).toBe("ready");
  expect(getMockRun("missing")).toBeUndefined();
  const summaries = listMockRunSummaries();
  expect(summaries).toHaveLength(MOCK_RUNS.length);
  expect(summaries[0]).toEqual({
    id: MOCK_RUNS[0]!.id,
    attempt: MOCK_RUNS[0]!.attempt,
    jobId: MOCK_RUNS[0]!.jobId,
    repository: MOCK_RUNS[0]!.repository,
    status: MOCK_RUNS[0]!.status,
    startedAt: MOCK_RUNS[0]!.startedAt,
    title: MOCK_RUNS[0]!.title,
  });
});
