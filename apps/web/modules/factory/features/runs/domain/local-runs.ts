import type { FactoryRunDetail } from "./types";

const STORAGE_KEY = "software-factory.local-runs";

/** In-memory mirror so SSR/tests work when sessionStorage is unavailable. */
let memoryStore: FactoryRunDetail[] = [];

function canUseSessionStorage(): boolean {
  return typeof window !== "undefined" && typeof sessionStorage !== "undefined";
}

function readStore(): FactoryRunDetail[] {
  if (!canUseSessionStorage()) {
    return memoryStore;
  }
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      memoryStore = [];
      return memoryStore;
    }
    const parsed: unknown = JSON.parse(raw);
    memoryStore = Array.isArray(parsed) ? (parsed as FactoryRunDetail[]) : [];
    return memoryStore;
  } catch {
    return memoryStore;
  }
}

function writeStore(runs: FactoryRunDetail[]): void {
  memoryStore = runs;
  if (!canUseSessionStorage()) {
    return;
  }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(runs));
}

/** Runs created in this browser session (mock start, no GitHub dispatch). */
export function getLocalRuns(): FactoryRunDetail[] {
  return readStore();
}

export function getLocalRun(id: string): FactoryRunDetail | undefined {
  return readStore().find((run) => run.id === id);
}

/** Prepend a run. Same id replaces the previous entry. */
export function addLocalRun(run: FactoryRunDetail): FactoryRunDetail {
  const existing = readStore().filter((item) => item.id !== run.id);
  writeStore([run, ...existing]);
  return run;
}

/** Test helper: clear local runs from memory and sessionStorage. */
export function clearLocalRuns(): void {
  writeStore([]);
}
