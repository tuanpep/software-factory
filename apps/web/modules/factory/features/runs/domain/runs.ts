import type { FactoryRunDetail, FactoryRunSummary } from "./types";

import { getLocalRun, getLocalRuns } from "./local-runs";
import { getMockRun, listMockRunSummaries, MOCK_RUNS } from "./mock-runs";

/** Prefer a session-local run, then static mocks. */
export function getRunById(id: string): FactoryRunDetail | undefined {
  return getLocalRun(id) ?? getMockRun(id);
}

/** Local runs first, then mocks whose ids are not already local. */
export function listRuns(): FactoryRunDetail[] {
  const local = getLocalRuns();
  const localIds = new Set(local.map((run) => run.id));
  return [...local, ...MOCK_RUNS.filter((run) => !localIds.has(run.id))];
}

export function listRunSummaries(): FactoryRunSummary[] {
  const local = getLocalRuns().map(
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
  const localIds = new Set(local.map((run) => run.id));
  return [
    ...local,
    ...listMockRunSummaries().filter((run) => !localIds.has(run.id)),
  ];
}
