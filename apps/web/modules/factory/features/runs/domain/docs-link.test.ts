import { expect, test } from "vitest";

import { jobPluginManifestSchema } from "./types";

import { DOCS_LINK_PLUGIN } from "./docs-link";
import { listInstalledPlugins } from "./plugins";

test("docs-link plugin declares stable id and version", () => {
  expect(DOCS_LINK_PLUGIN.id).toBe("docs-link");
  expect(DOCS_LINK_PLUGIN.version).toBe("1.0.0");
  expect(DOCS_LINK_PLUGIN.recipeId).toBe("docs-link/v1");
  expect(DOCS_LINK_PLUGIN.allowedProducers).toEqual(["deterministic"]);
});

test("docs-link plugin matches JobPluginManifest schema", () => {
  expect(() => jobPluginManifestSchema.parse(DOCS_LINK_PLUGIN)).not.toThrow();
});

test("listInstalledPlugins returns docs-link", () => {
  const plugins = listInstalledPlugins();
  expect(plugins).toHaveLength(1);
  expect(plugins[0]?.id).toBe("docs-link");
});
