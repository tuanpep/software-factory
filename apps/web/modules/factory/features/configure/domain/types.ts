import { z } from "zod/v4";

export const providerTypeSchema = z.enum([
  "openai_compatible",
  "anthropic",
  "local",
]);

export type ProviderType = z.infer<typeof providerTypeSchema>;

export const providerConfigSchema = z.object({
  id: z.string().min(1),
  displayName: z.string().min(1),
  type: providerTypeSchema,
  baseUrl: z.string().url().optional(),
  credentialRef: z.string().min(1),
  defaultModelId: z.string().min(1).optional(),
});

export type ProviderConfig = z.infer<typeof providerConfigSchema>;

export const modelConfigSchema = z.object({
  id: z.string().min(1),
  providerId: z.string().min(1),
  modelId: z.string().min(1),
  alias: z.string().min(1),
  contextWindow: z.number().int().positive().optional(),
  supportsThinking: z.boolean().optional(),
  thinkingEffort: z.string().optional(),
  aliasDrifts: z.boolean().optional(),
});

export type ModelConfig = z.infer<typeof modelConfigSchema>;

export const agentProfileSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  providerId: z.string().min(1),
  modelId: z.string().min(1),
  whenToUse: z.string().min(1),
  mode: z.string().optional(),
});

export type AgentProfile = z.infer<typeof agentProfileSchema>;
