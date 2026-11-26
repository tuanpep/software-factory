export type FactoryDecision = {
  id: string;
  title: string;
  recommendation: string;
  risk: string;
  owner: string;
};

export const FACTORY_DECISIONS: FactoryDecision[] = [
  {
    id: "release",
    title: "Ship the docs-link repair",
    recommendation:
      "The receipt is ready and the diff changes one link. A person still merges.",
    risk: "Release notes would describe a repair the factory did not publish.",
    owner: "Maintainer",
  },
  {
    id: "public-reply",
    title: "Reply on the setup-guide issue",
    recommendation:
      "Tell the requester the link is repaired after a person merges.",
    risk: "A public reply would go out before the change exists on the default branch.",
    owner: "Maintainer",
  },
  {
    id: "auth",
    title: "Allow the guest a GitHub token",
    recommendation: "Keep the guest on staged context with no token.",
    risk: "A token in the guest can publish outside the verifier.",
    owner: "Factory operator",
  },
];

export function getDecision(id: string): FactoryDecision | undefined {
  return FACTORY_DECISIONS.find((decision) => decision.id === id);
}
