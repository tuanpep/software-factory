import { afterEach, expect, it } from "vitest";

import {
  chooseDecision,
  clearWorkspaceSession,
  readWorkspaceSession,
  setPaused,
} from "./workspace-session";

afterEach(() => {
  clearWorkspaceSession();
});

it("records a decision without a publication", () => {
  const result = chooseDecision("release", "accepted");
  expect(result).toEqual({ choice: "accepted", published: false });
  const session = readWorkspaceSession();
  expect(session.decisionChoices.release).toBe("accepted");
  expect(session).not.toHaveProperty("publication");
});

it("round-trips pause", () => {
  expect(setPaused(true).paused).toBe(true);
  expect(readWorkspaceSession().paused).toBe(true);
  expect(setPaused(false).paused).toBe(false);
  expect(readWorkspaceSession().paused).toBe(false);
});
