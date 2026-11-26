import { afterEach, describe, expect, it } from "vitest";

import {
  addLocalRun,
  clearLocalRuns,
  getLocalRun,
  getLocalRuns,
} from "./local-runs";
import { MOCK_RUNS } from "./mock-runs";
import { getRunById } from "./runs";

afterEach(() => {
  clearLocalRuns();
});

describe("local runs", () => {
  it("stores and retrieves a run", () => {
    const seed = { ...MOCK_RUNS[0]!, id: "local-test-1" };
    addLocalRun(seed);
    expect(getLocalRun("local-test-1")?.title).toBe(seed.title);
    expect(getLocalRuns()).toHaveLength(1);
  });

  it("getRunById prefers local over mock", () => {
    const mock = MOCK_RUNS[0]!;
    addLocalRun({ ...mock, title: "Local override" });
    expect(getRunById(mock.id)?.title).toBe("Local override");
  });
});
