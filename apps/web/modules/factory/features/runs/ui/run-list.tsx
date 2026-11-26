"use client";

import {
  Button,
  Group,
  Stack,
  Table,
  Text,
  VisuallyHidden,
} from "@mantine/core";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { useMemo } from "react";

import { ModuleTabs } from "@/modules/ui/components/module-tabs";
import { PageHeader } from "@/modules/ui/components/page-header";

import {
  countAttention,
  matchesAttentionFilter,
  type AttentionFilter,
} from "../domain/attention";
import { listRunSummaries } from "../domain/runs";
import { attentionFilterParser } from "../domain/search-params";
import { PipelineGraph, PipelineStatusIcon } from "./pipeline-graph";

function formatStartedAt(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function RunList({ workflowHref }: { workflowHref?: string }) {
  const t = useTranslations("Factory");
  const locale = useLocale();
  const [filter, setFilter] = useQueryState("view", attentionFilterParser);
  const runs = listRunSummaries();
  const counts = useMemo(() => countAttention(runs), [runs]);
  const visible = useMemo(
    () => runs.filter((run) => matchesAttentionFilter(run, filter)),
    [runs, filter],
  );

  const tabs: {
    value: AttentionFilter;
    label: string;
    count: number;
  }[] = [
    { value: "all", label: t("attentionAll"), count: runs.length },
    {
      value: "running",
      label: t("attentionRunning"),
      count: counts.running,
    },
    { value: "ready", label: t("attentionReady"), count: counts.ready },
    {
      value: "needs_input",
      label: t("attentionNeedsInput"),
      count: counts.needs_input,
    },
    { value: "failed", label: t("attentionFailed"), count: counts.failed },
  ];

  return (
    <ModuleTabs
      label={t("attentionLabel")}
      value={filter}
      onChange={(next) => {
        void setFilter(next === "all" ? null : (next as AttentionFilter));
      }}
      tabs={tabs}
      header={
        <PageHeader
          title={t("reviewTitle")}
          actions={
            <>
              {workflowHref && (
                <Button component="a" href={workflowHref} variant="default">
                  {t("startInGitHub")}
                </Button>
              )}
              <Button component={Link} href="/runs/new">
                {t("newRun")}
              </Button>
            </>
          }
        />
      }
    >
      {visible.length === 0 ? (
        <Stack gap="xs">
          <Text fw={600}>{t("empty")}</Text>
          {runs.length === 0 && (
            <Text size="sm" c="dimmed">
              {t(workflowHref ? "historyInGitHub" : "notConnected")}
            </Text>
          )}
        </Stack>
      ) : (
        <Table.ScrollContainer minWidth={720}>
          <Table highlightOnHover verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t("colStatus")}</Table.Th>
                <Table.Th>{t("colPipeline")}</Table.Th>
                <Table.Th>{t("colStages")}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {visible.map((run) => (
                <Table.Tr key={run.id}>
                  <Table.Td>
                    <PipelineStatusIcon status={run.status} />
                    <VisuallyHidden>{t(`status.${run.status}`)}</VisuallyHidden>
                  </Table.Td>
                  <Table.Td>
                    <Stack gap={2}>
                      <Text
                        component={Link}
                        href={`/runs/${run.id}`}
                        size="sm"
                        fw={600}
                        c="var(--mantine-color-anchor)"
                        style={{ textDecoration: "none" }}
                      >
                        {run.title}
                      </Text>
                      <Text size="xs" c="dimmed" ff="monospace">
                        {t("runIdAttempt", {
                          id: run.id,
                          attempt: run.attempt,
                        })}
                        {" · "}
                        {run.jobId}
                      </Text>
                      <Group gap={6} wrap="wrap">
                        <Text size="xs">{t(`status.${run.status}`)}</Text>
                        <Text size="xs" c="dimmed" suppressHydrationWarning>
                          {formatStartedAt(run.startedAt, locale)}
                        </Text>
                      </Group>
                    </Stack>
                  </Table.Td>
                  <Table.Td style={{ whiteSpace: "nowrap" }}>
                    <PipelineGraph status={run.status} />
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      )}
    </ModuleTabs>
  );
}
