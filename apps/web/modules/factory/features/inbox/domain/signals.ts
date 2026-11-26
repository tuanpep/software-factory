export type SignalDraft = {
  markdownPath: string;
  brokenLink: string;
  destination: string;
  observed: string;
  desired: string;
  nonGoals: string;
  evidencePlan: string;
  openQuestions: string;
};

export type FactorySignal = {
  id: string;
  source: "github_issue" | "alert";
  title: string;
  duplicateOf: string | null;
  draft: SignalDraft;
};

export type InboxSignal = FactorySignal & { duplicateCount: number };

export const FACTORY_SIGNALS: FactorySignal[] = [
  {
    id: "issue-42",
    source: "github_issue",
    title: "Repair the setup guide link",
    duplicateOf: null,
    draft: {
      markdownPath: "docs/setup.md",
      brokenLink: "./old-install.md",
      destination: "./install.md",
      observed: "docs/setup.md links to ./old-install.md, which is missing.",
      desired: "The link resolves to ./install.md.",
      nonGoals: "Do not rewrite the install steps.",
      evidencePlan: "Fail before the patch, pass after, on the pinned base.",
      openQuestions: "",
    },
  },
  {
    id: "issue-42-dup",
    source: "github_issue",
    title: "Setup guide link is broken",
    duplicateOf: "issue-42",
    draft: {
      markdownPath: "docs/setup.md",
      brokenLink: "./old-install.md",
      destination: "./install.md",
      observed: "",
      desired: "",
      nonGoals: "",
      evidencePlan: "",
      openQuestions: "",
    },
  },
  {
    id: "alert-windows-locale",
    source: "alert",
    title: "Install check only matches English errors",
    duplicateOf: null,
    draft: {
      markdownPath: "docs/setup.md",
      brokenLink: "./old-install.md",
      destination: "./install.md",
      observed: "The install note assumes an English Windows error string.",
      desired: "The note names the gap instead of claiming a Windows run.",
      nonGoals: "Do not claim a machine that did not run.",
      evidencePlan: "Docs check only. Record that Windows was not executed.",
      openQuestions: "Which locale should the note mention?",
    },
  },
];

export function listInboxSignals(ignoredIds: readonly string[]): InboxSignal[] {
  const ignored = new Set(ignoredIds);
  return FACTORY_SIGNALS.filter(
    (signal) => signal.duplicateOf === null && !ignored.has(signal.id),
  ).map((signal) => ({
    ...signal,
    duplicateCount: FACTORY_SIGNALS.filter(
      (item) => item.duplicateOf === signal.id,
    ).length,
  }));
}

export function intentPrefillHref(draft: SignalDraft): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(draft)) {
    if (value) {
      params.set(key, value);
    }
  }
  const query = params.toString();
  return query ? `/runs/new?${query}` : "/runs/new";
}
