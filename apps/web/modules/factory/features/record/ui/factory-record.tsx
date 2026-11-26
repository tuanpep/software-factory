"use client";

import { Code, Stack, Text } from "@mantine/core";
import { useTranslations } from "next-intl";

import { PageHeader } from "@/modules/ui/components/page-header";

import { FACTORY_RECORD } from "../domain/factory-record";

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Stack gap={2}>
      <Text size="sm" c="dimmed">
        {label}
      </Text>
      <Text fw={600}>{value}</Text>
    </Stack>
  );
}

export function FactoryRecord() {
  const t = useTranslations("Factory");

  return (
    <Stack gap="lg" maw={720}>
      <PageHeader
        title={t("recordTitle")}
        meta={
          <Text size="sm" c="dimmed">
            {t("recordNote")}
          </Text>
        }
      />
      <Metric label={t("recordAcceptance")} value={FACTORY_RECORD.acceptance} />
      <Metric
        label={t("recordMinutes")}
        value={FACTORY_RECORD.maintainerMinutes}
      />
      <Metric label={t("recordFalseReady")} value={FACTORY_RECORD.falseReady} />
      <Metric label={t("recordCost")} value={FACTORY_RECORD.costPerAccepted} />
      <Metric
        label={t("recordZeroCohort")}
        value={FACTORY_RECORD.zeroAcceptanceCohort}
      />
      <Stack gap={4}>
        <Text size="sm" fw={600}>
          {t("recordCluster")}
        </Text>
        <Text size="sm">{FACTORY_RECORD.clusterTitle}</Text>
        <Text size="sm" fw={600}>
          {t("recordProposal")}
        </Text>
        <Code block>{FACTORY_RECORD.proposedDiff}</Code>
      </Stack>
    </Stack>
  );
}
