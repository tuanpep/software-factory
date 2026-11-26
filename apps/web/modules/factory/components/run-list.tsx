import { Paper, Stack, Text, Title } from "@mantine/core";
import { useTranslations } from "next-intl";

export function RunList() {
  const t = useTranslations("Factory");

  return (
    <Stack gap="lg">
      <Title order={1}>{t("runs")}</Title>
      <Paper withBorder p="md" radius="md">
        <Stack gap="xs">
          <Title order={2} size="h4">
            {t("empty")}
          </Title>
          <Text size="sm" c="dimmed">
            {t("notConnected")}
          </Text>
        </Stack>
      </Paper>
    </Stack>
  );
}
