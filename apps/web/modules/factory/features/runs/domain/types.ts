import { z } from "zod/v4";

export const factoryRunStatusSchema = z.enum([
  "queued",
  "producing",
  "verifying",
  "ready",
  "needs_input",
  "policy_rejected",
  "verification_failed",
  "infrastructure_failed",
  "budget_exhausted",
  "cancelled",
  "evidence_unavailable",
  "stale_base",
]);

export type FactoryRunStatus = z.infer<typeof factoryRunStatusSchema>;

export const factoryRunSummarySchema = z.object({
  id: z.string().min(1),
  attempt: z.number().int().positive(),
  jobId: z.string().min(1),
  repository: z.string().min(1),
  status: factoryRunStatusSchema,
  startedAt: z.string().min(1),
  title: z.string().min(1),
});

export type FactoryRunSummary = z.infer<typeof factoryRunSummarySchema>;

export const approvedIntentSchema = z.object({
  markdownPath: z.string().min(1),
  /** May be empty when status is `needs_input`. */
  brokenLink: z.string(),
  /** May be empty when status is `needs_input`. */
  destination: z.string(),
});

export type ApprovedIntent = z.infer<typeof approvedIntentSchema>;

export const checkResultSchema = z.object({
  name: z.string().min(1),
  before: z.string().min(1),
  after: z.string().min(1),
});

export type CheckResult = z.infer<typeof checkResultSchema>;

/** Verifier receipt aligned with the Rust `Receipt` contract (camelCase JSON). */
export const evidenceReceiptSchema = z.object({
  version: z.number().int().positive(),
  status: factoryRunStatusSchema,
  reason: z.string().min(1),
  runId: z.number().int().positive(),
  attempt: z.number().int().positive(),
  baseRevision: z.string().min(1),
  intentDigest: z.string().min(1),
  recipe: z.string().min(1),
  changedPaths: z.array(z.string()),
  before: z.string().min(1),
  after: z.string().min(1),
  patchSha256: z.string().nullable(),
  notChecked: z.array(z.string()),
});

export type EvidenceReceipt = z.infer<typeof evidenceReceiptSchema>;

export const factoryRunDetailSchema = factoryRunSummarySchema.extend({
  approvedIntent: approvedIntentSchema,
  baseSha: z.string().min(1),
  recipeId: z.string().min(1),
  checks: z.array(checkResultSchema),
  coverageGaps: z.array(z.string()),
  patchUnified: z.string().nullable(),
  receipt: evidenceReceiptSchema.or(z.record(z.string(), z.unknown())),
  nextAction: z.string().min(1),
  githubRunUrl: z.string().url().optional(),
});

export type FactoryRunDetail = z.infer<typeof factoryRunDetailSchema>;

/** JSON Schema object describing a job's intake fields. */
export type JsonSchemaObject = {
  type: "object";
  properties: Record<string, unknown>;
  required?: string[];
  additionalProperties?: boolean;
  [key: string]: unknown;
};

export const jobPluginManifestSchema = z.object({
  id: z.string().min(1),
  version: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  intakeSchema: z
    .object({
      type: z.literal("object"),
      properties: z.record(z.string(), z.unknown()),
      required: z.array(z.string()).optional(),
      additionalProperties: z.boolean().optional(),
    })
    .passthrough(),
  allowedProducers: z.array(z.string().min(1)).min(1),
  recipeId: z.string().min(1),
  replaySuitePath: z.string().min(1),
  proofSlots: z.array(z.string()).optional(),
});

export type JobPluginManifest = z.infer<typeof jobPluginManifestSchema>;
