"use client";

import { Button, Stack } from "@mantine/core";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { PageBreadcrumbs } from "@/modules/ui/components/page-breadcrumbs";
import { PageHeader } from "@/modules/ui/components/page-header";

import { getRunById } from "../domain/runs";
import type { FactoryRunDetail as FactoryRunDetailModel } from "../domain/types";

import { RunDetail } from "./run-detail";

/**
 * Resolves a run on the client so session-local starts are visible.
 * Prefers local storage, then the server-provided mock.
 */
export function RunDetailRoute({
  runId,
  serverRun,
}: {
  runId: string;
  serverRun: FactoryRunDetailModel | null;
}) {
  const t = useTranslations("Factory");
  const run = getRunById(runId) ?? serverRun;

  if (!run) {
    return (
      <Stack gap="md">
        <PageHeader
          breadcrumbs={
            <PageBreadcrumbs
              items={[
                { href: "/", label: t("reviewTitle") },
                { href: `/runs/${runId}`, label: runId },
              ]}
            />
          }
          title={t("runNotFound")}
        />
        <Button component={Link} href="/" variant="default">
          {t("reviewTitle")}
        </Button>
      </Stack>
    );
  }

  return <RunDetail run={run} />;
}
