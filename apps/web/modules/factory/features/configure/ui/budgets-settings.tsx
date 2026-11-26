"use client";

import { Stack, Text } from "@mantine/core";
import { useTranslations } from "next-intl";

import { BUDGETS } from "../domain/operator";

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <Stack gap={2}>
      <Text size="sm" fw={600}>
        {label}
      </Text>
      <Text size="sm">{value}</Text>
    </Stack>
  );
}

export function BudgetsSettings() {
  const t = useTranslations("Settings");

  return (
    <Stack gap="md" maw={640}>
      <Fact label={t("budgetAttempts")} value={BUDGETS.attemptCap} />
      <Fact label={t("budgetSpend")} value={BUDGETS.spendLimit} />
      <Fact label={t("budgetQuiet")} value={BUDGETS.quietHours} />
    </Stack>
  );
}
