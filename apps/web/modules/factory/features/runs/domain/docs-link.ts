import type { JobPluginManifest } from "./types";

/**
 * Docs-link job plugin. Intake fields match the Rust `Request` contract
 * (`markdownPath` / `brokenLink` / `destination` in camelCase JSON;
 * fixture request.json uses the same semantics under snake_case keys).
 */
export const DOCS_LINK_PLUGIN: JobPluginManifest = {
  id: "docs-link",
  version: "1.0.0",
  title: "Docs link repair",
  description:
    "Repair one broken relative Markdown link to an approved destination under docs/.",
  intakeSchema: {
    type: "object",
    additionalProperties: false,
    required: ["markdown_path", "broken_link", "destination"],
    properties: {
      markdown_path: {
        type: "string",
        description: "Repository-relative Markdown path (docs/*.md).",
      },
      broken_link: {
        type: "string",
        description: "Current unresolved relative link destination.",
      },
      destination: {
        type: "string",
        description: "Approved relative destination that must resolve.",
      },
    },
  },
  allowedProducers: ["deterministic"],
  recipeId: "docs-link/v1",
  replaySuitePath: "apps/factory/tests/fixtures/docs-link",
  proofSlots: ["original_destination_missing", "approved_destination_resolves"],
};
