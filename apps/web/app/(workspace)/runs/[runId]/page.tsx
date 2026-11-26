import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { RunDetailRoute } from "@/modules/factory/features/runs/ui/run-detail-route";
import { getMockRun } from "@/modules/factory/features/runs";

type PageProps = {
  params: Promise<{ runId: string }>;
};

export default function RunDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={null}>
      <RunDetailContent params={params} />
    </Suspense>
  );
}

async function RunDetailContent({ params }: PageProps) {
  const { runId } = await params;
  const serverRun = getMockRun(runId) ?? null;

  return <RunDetailRoute runId={runId} serverRun={serverRun} />;
}

export async function generateMetadata({ params }: PageProps) {
  const { runId } = await params;
  const run = getMockRun(runId);
  const t = await getTranslations("Factory");

  return {
    title: run
      ? t("runIdAttempt", { id: run.id, attempt: run.attempt })
      : t("runNotFound"),
  };
}
