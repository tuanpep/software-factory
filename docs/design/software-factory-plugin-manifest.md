# Software factory job plugin manifest

**Status:** web-client contract for Track A. The Rust harness remains the authority for prepare, propose, verify, and replay.

## Purpose

A `JobPluginManifest` describes one factory job to the Next.js client: intake fields, allowed producers, recipe id, and where replay fixtures live. It does not execute the job.

## Docs-link (`docs-link` / `1.0.0`)

| Field | Value |
| --- | --- |
| Intake | `markdown_path`, `broken_link`, `destination` (JSON Schema; same semantics as fixture `request.json`) |
| Producers | `deterministic` only for the first slice |
| Recipe | `docs-link/v1` |
| Replay suite | `apps/factory/tests/fixtures/docs-link` |

Import `DOCS_LINK_PLUGIN` from `@/modules/factory/features/runs/domain/docs-link` and `listInstalledPlugins` from `@/modules/factory/features/runs/domain/plugins`. Run and manifest types live in `@/modules/factory/features/runs/domain/types`. Mock runs live beside those files. Provider, model, and profile settings live in `@/modules/factory/features/configure/domain/`.
