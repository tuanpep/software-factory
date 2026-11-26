import { afterEach, expect, it } from "vitest";

import {
  clearWorkspaceSession,
  ignoreSignal,
  readWorkspaceSession,
} from "../../../data/workspace-session";
import { listInboxSignals } from "./signals";

afterEach(() => {
  clearWorkspaceSession();
});

it("collapses duplicates and hides ignored signals", () => {
  expect(listInboxSignals([])).toHaveLength(2);
  expect(listInboxSignals([])[0]?.duplicateCount).toBe(1);
  ignoreSignal("alert-windows-locale");
  const visible = listInboxSignals(readWorkspaceSession().ignoredSignalIds);
  expect(visible.map((signal) => signal.id)).toEqual(["issue-42"]);
});
