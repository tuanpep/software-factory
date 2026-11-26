import { DOCS_LINK_PLUGIN } from "./docs-link";
import type { JobPluginManifest } from "./types";

/** Installed job plugins available to the web client. */
export function listInstalledPlugins(): JobPluginManifest[] {
  return [DOCS_LINK_PLUGIN];
}
