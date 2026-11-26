import { expect, it } from "vitest";

import { DOCS_LINK_PLUGIN } from "./docs-link";
import { createLocalRun, statusForIntentCard } from "./create-local-run";

it("starts needs_input when a question is open", () => {
  expect(statusForIntentCard("Which locale?")).toBe("needs_input");
  const run = createLocalRun({
    plugin: DOCS_LINK_PLUGIN,
    producer: "deterministic",
    fields: {
      markdownPath: "docs/setup.md",
      brokenLink: "./old-install.md",
      destination: "./install.md",
      openQuestions: "Which locale?",
    },
  });
  expect(run.status).toBe("needs_input");
  expect(run.patchUnified).toBeNull();
});

it("starts ready when no question is open", () => {
  expect(statusForIntentCard("  ")).toBe("ready");
  const run = createLocalRun({
    plugin: DOCS_LINK_PLUGIN,
    producer: "deterministic",
    fields: {
      markdownPath: "docs/setup.md",
      brokenLink: "./old-install.md",
      destination: "./install.md",
      openQuestions: "",
    },
  });
  expect(run.status).toBe("ready");
  expect(run.patchUnified).toContain("./install.md");
});
