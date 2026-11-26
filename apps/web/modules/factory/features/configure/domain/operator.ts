export const ENROLLMENT = {
  repository: "maintainer-org/software-factory",
  workflowPath: ".github/workflows/synthetic-handoff.yml",
} as const;

export const AFFECTED_RUN_IDS = ["1042", "1046"] as const;

export const BUDGETS = {
  attemptCap: "1",
  spendLimit: "sample cap",
  quietHours: "22:00–07:00",
} as const;
