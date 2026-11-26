import { RunList } from "@/modules/factory/components/run-list";

import { env } from "../env";

export default function Page() {
  const repository = env.FACTORY_GITHUB_REPOSITORY;
  const workflowHref = repository
    ? `https://github.com/${repository}/actions/workflows/synthetic-handoff.yml`
    : undefined;

  return <RunList workflowHref={workflowHref} />;
}
