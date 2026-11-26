"use client";

import { Button, Stack, Text } from "@mantine/core";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";

import { getMockRun } from "@/modules/factory/features/runs";
import { PageBreadcrumbs } from "@/modules/ui/components/page-breadcrumbs";
import { PageHeader } from "@/modules/ui/components/page-header";

import { getFollowDraft } from "../domain/follow-drafts";
import {
  stopFollowUp,
  useWorkspaceSession,
} from "@/modules/factory/data/workspace-session";

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <Stack gap={2}>
      <Text size="sm" fw={600}>
        {label}
      </Text>
      <Text size="sm" ff="monospace">
        {value}
      </Text>
    </Stack>
  );
}

export function FollowDetail({ draftId }: { draftId: string }) {
  const t = useTranslations("Factory");
  const draft = getFollowDraft(draftId);
  const stopped = useWorkspaceSession().stoppedFollowIds.includes(draftId);

  if (!draft) {
    notFound();
  }

  const run = getMockRun(draft.runId);

  return (
    <Stack gap="lg" maw={720}>
      <PageHeader
        breadcrumbs={
          <PageBreadcrumbs
            items={[
              { href: "/follow", label: t("followTitle") },
              { href: `/follow/${draft.id}`, label: draft.title },
            ]}
          />
        }
        title={draft.title}
        meta={
          <Text size="sm" c="dimmed">
            {t("followNote")}
          </Text>
        }
        actions={
          <>
            {run?.githubRunUrl && (
              <Button component="a" href={run.githubRunUrl} variant="default">
                {t("followOpenGitHub")}
              </Button>
            )}
            <Button
              variant="default"
              disabled={stopped}
              onClick={() => {
                stopFollowUp(draft.id);
              }}
            >
              {stopped ? t("followStopped") : t("followStop")}
            </Button>
          </>
        }
      />
      <Fact label={t("followCurrentHead")} value={draft.currentHead} />
      <Fact label={t("followReceiptHead")} value={draft.receiptHead} />
      {draft.stale && <Text size="sm">{t("followStale")}</Text>}
      {draft.question && (
        <Stack gap={2}>
          <Text size="sm" fw={600}>
            {t("followQuestion")}
          </Text>
          <Text size="sm">{draft.question}</Text>
        </Stack>
      )}
    </Stack>
  );
}
