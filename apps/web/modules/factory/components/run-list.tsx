import { Button, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { useTranslations } from "next-intl";

export function RunList({ workflowHref }: { workflowHref?: string }) {
  const t = useTranslations("Factory");

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={1}>{t("runs")}</Title>
        {workflowHref && (
          <Button component="a" href={workflowHref}>
            {t("startInGitHub")}
          </Button>
        )}
      </Group>
      <Paper withBorder p="md" radius="md">
        <Stack gap="xs">
          <Title order={2} size="h4">
            {t("empty")}
          </Title>
          <Text size="sm" c="dimmed">
            {t(workflowHref ? "historyInGitHub" : "notConnected")}
          </Text>
        </Stack>
      </Paper>
    </Stack>
  );
}
