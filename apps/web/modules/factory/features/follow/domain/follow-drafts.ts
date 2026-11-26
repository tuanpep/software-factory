export type FollowDraft = {
  id: string;
  runId: string;
  title: string;
  currentHead: string;
  receiptHead: string;
  stale: boolean;
  question: string | null;
};

export const FOLLOW_DRAFTS: FollowDraft[] = [
  {
    id: "draft-1042",
    runId: "1042",
    title: "Repair docs/setup.md",
    currentHead: "a1b2c3d4e5f60718",
    receiptHead: "a1b2c3d4e5f60718",
    stale: false,
    question:
      "The docs check failed on this head. Re-verify before another follow-up?",
  },
  {
    id: "draft-1047",
    runId: "1047",
    title: "Stale base for docs/setup.md",
    currentHead: "f9e8d7c6b5a49382",
    receiptHead: "a1b2c3d4e5f60718",
    stale: true,
    question: null,
  },
];

export function getFollowDraft(id: string): FollowDraft | undefined {
  return FOLLOW_DRAFTS.find((draft) => draft.id === id);
}
