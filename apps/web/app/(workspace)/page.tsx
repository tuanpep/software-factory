import { Suspense } from "react";

import { RunList } from "@/modules/factory/features/runs/ui/run-list";

import { env } from "../env";

export default function Page() {
  const repository = env.FACTORY_GITHUB_REPOSITORY;
  const workflowHref = repository
    ? `https://github.com/${repository}/actions/workflows/synthetic-handoff.yml`
    : undefined;

  return (
    <Suspense fallback={null}>
      <RunList workflowHref={workflowHref} />
    </Suspense>
  );
}
