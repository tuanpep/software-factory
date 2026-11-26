import { useSyncExternalStore } from "react";

const STORAGE_KEY = "software-factory.workspace";

export type DecisionChoice = "accepted" | "rejected";

export type WorkspaceSession = {
  ignoredSignalIds: string[];
  stoppedFollowIds: string[];
  decisionChoices: Record<string, DecisionChoice>;
  paused: boolean;
};

export type DecisionResult = {
  choice: DecisionChoice;
  published: false;
};

const SERVER_SESSION: WorkspaceSession = emptySession();
let snapshot: WorkspaceSession = SERVER_SESSION;
let clientHydrated = false;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) {
    listener();
  }
}

function ensureClient(): void {
  if (clientHydrated || !canUseSessionStorage()) {
    return;
  }
  clientHydrated = true;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return;
  }
  try {
    snapshot = normalize(JSON.parse(raw));
  } catch {
    snapshot = emptySession();
  }
}

function emptySession(): WorkspaceSession {
  return {
    ignoredSignalIds: [],
    stoppedFollowIds: [],
    decisionChoices: {},
    paused: false,
  };
}

function canUseSessionStorage(): boolean {
  return typeof window !== "undefined" && typeof sessionStorage !== "undefined";
}

function readStore(): WorkspaceSession {
  ensureClient();
  return snapshot;
}

function normalize(value: unknown): WorkspaceSession {
  if (!value || typeof value !== "object") {
    return emptySession();
  }
  const record = value as Partial<WorkspaceSession>;
  const choices: Record<string, DecisionChoice> = {};
  if (record.decisionChoices && typeof record.decisionChoices === "object") {
    for (const [id, choice] of Object.entries(record.decisionChoices)) {
      if (choice === "accepted" || choice === "rejected") {
        choices[id] = choice;
      }
    }
  }
  return {
    ignoredSignalIds: stringList(record.ignoredSignalIds),
    stoppedFollowIds: stringList(record.stoppedFollowIds),
    decisionChoices: choices,
    paused: record.paused === true,
  };
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string");
}

function writeStore(session: WorkspaceSession): void {
  snapshot = session;
  clientHydrated = true;
  if (canUseSessionStorage()) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
  emit();
}

export function subscribeWorkspaceSession(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getServerWorkspaceSession(): WorkspaceSession {
  return SERVER_SESSION;
}

export function useWorkspaceSession(): WorkspaceSession {
  return useSyncExternalStore(
    subscribeWorkspaceSession,
    readWorkspaceSession,
    getServerWorkspaceSession,
  );
}

export function readWorkspaceSession(): WorkspaceSession {
  return readStore();
}

export function ignoreSignal(id: string): WorkspaceSession {
  const current = readStore();
  if (current.ignoredSignalIds.includes(id)) {
    return current;
  }
  const next = {
    ...current,
    ignoredSignalIds: [...current.ignoredSignalIds, id],
  };
  writeStore(next);
  return next;
}

export function stopFollowUp(id: string): WorkspaceSession {
  const current = readStore();
  if (current.stoppedFollowIds.includes(id)) {
    return current;
  }
  const next = {
    ...current,
    stoppedFollowIds: [...current.stoppedFollowIds, id],
  };
  writeStore(next);
  return next;
}

/** Records the person's choice only. Never creates a publication. */
export function chooseDecision(
  id: string,
  choice: DecisionChoice,
): DecisionResult {
  const current = readStore();
  writeStore({
    ...current,
    decisionChoices: { ...current.decisionChoices, [id]: choice },
  });
  return { choice, published: false };
}

export function setPaused(paused: boolean): WorkspaceSession {
  const next = { ...readStore(), paused };
  writeStore(next);
  return next;
}

export function clearWorkspaceSession(): void {
  snapshot = emptySession();
  clientHydrated = true;
  if (canUseSessionStorage()) {
    sessionStorage.removeItem(STORAGE_KEY);
  }
  emit();
}
