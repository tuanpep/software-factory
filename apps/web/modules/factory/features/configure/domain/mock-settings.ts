import type { AgentProfile, ModelConfig, ProviderConfig } from "./types";

export const MOCK_PROVIDERS: ProviderConfig[] = [
  {
    id: "local-deterministic",
    displayName: "Local deterministic",
    type: "local",
    credentialRef: "env:FACTORY_LOCAL_NO_CREDENTIAL",
    defaultModelId: "deterministic-docs",
  },
  {
    id: "openai-compatible",
    displayName: "OpenAI-compatible",
    type: "openai_compatible",
    baseUrl: "https://api.example.com/v1",
    credentialRef: "env:FACTORY_OPENAI_API_KEY",
    defaultModelId: "gpt-4.1-mini",
  },
];

export const MOCK_MODELS: ModelConfig[] = [
  {
    id: "deterministic-docs",
    providerId: "local-deterministic",
    modelId: "deterministic",
    alias: "Deterministic docs",
    contextWindow: 8192,
  },
  {
    id: "gpt-4.1-mini",
    providerId: "openai-compatible",
    modelId: "gpt-4.1-mini",
    alias: "GPT-4.1 Mini",
    contextWindow: 128000,
  },
  {
    id: "opencode-review",
    providerId: "openai-compatible",
    modelId: "gpt-4.1",
    alias: "OpenCode review",
    contextWindow: 128000,
    supportsThinking: true,
    thinkingEffort: "medium",
  },
  {
    id: "alias-latest",
    providerId: "openai-compatible",
    modelId: "gpt-4.1",
    alias: "latest",
    contextWindow: 128000,
    aliasDrifts: true,
  },
];

export const MOCK_AGENT_PROFILES: AgentProfile[] = [
  {
    id: "deterministic-docs",
    name: "Deterministic docs",
    providerId: "local-deterministic",
    modelId: "deterministic-docs",
    whenToUse: "Docs-link repair with the trusted deterministic producer.",
    mode: "propose",
  },
  {
    id: "opencode-review-notes",
    name: "OpenCode review notes",
    providerId: "openai-compatible",
    modelId: "opencode-review",
    whenToUse:
      "Draft maintainer review notes after a ready receipt; never author the candidate edit.",
    mode: "review",
  },
];
