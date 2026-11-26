"use client";

import { Stack, Text } from "@mantine/core";
import { useTranslations } from "next-intl";

import { ENROLLMENT } from "../domain/operator";

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

export function EnrollmentSettings() {
  const t = useTranslations("Settings");

  return (
    <Stack gap="md" maw={640}>
      <Fact label={t("enrollmentRepo")} value={ENROLLMENT.repository} />
      <Fact label={t("enrollmentWorkflow")} value={ENROLLMENT.workflowPath} />
    </Stack>
  );
}
