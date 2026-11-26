import { expect, test } from "vitest";

import { countAttention, matchesAttentionFilter } from "./attention";
import type { FactoryRunSummary } from "./types";

const runs: FactoryRunSummary[] = [
  {
    id: "1",
    attempt: 1,
    jobId: "docs",
    repository: "local/mock",
    status: "ready",
    startedAt: "2026-01-01T00:00:00.000Z",
    title: "Ready",
  },
  {
    id: "2",
    attempt: 1,
    jobId: "docs",
    repository: "local/mock",
    status: "needs_input",
    startedAt: "2026-01-01T00:00:00.000Z",
    title: "Input",
  },
  {
    id: "3",
    attempt: 1,
    jobId: "docs",
    repository: "local/mock",
    status: "stale_base",
    startedAt: "2026-01-01T00:00:00.000Z",
    title: "Stale",
  },
];

test("counts ready, input, and failed runs", () => {
  expect(countAttention(runs)).toEqual({
    ready: 1,
    needs_input: 1,
    failed: 1,
  });
});

test("matches the failed facet including stale base", () => {
  expect(matchesAttentionFilter(runs[2]!, "failed")).toBe(true);
  expect(matchesAttentionFilter(runs[0]!, "failed")).toBe(false);
});
