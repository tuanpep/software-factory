"use client";

import { Button, Stack, Text } from "@mantine/core";
import { useTranslations } from "next-intl";

import { AFFECTED_RUN_IDS } from "../domain/operator";
import {
  setPaused,
  useWorkspaceSession,
} from "@/modules/factory/data/workspace-session";

export function PauseSettings() {
  const t = useTranslations("Settings");
  const paused = useWorkspaceSession().paused;

  return (
    <Stack gap="md" maw={640}>
      <Text size="sm">{paused ? t("pauseOn") : t("pauseOff")}</Text>
      <Text size="sm" ff="monospace">
        {t("pauseRuns")}: {AFFECTED_RUN_IDS.join(", ")}
      </Text>
      <Button
        variant={paused ? "default" : "filled"}
        w="fit-content"
        onClick={() => {
          setPaused(!paused);
        }}
      >
        {paused ? t("resumeAction") : t("pauseAction")}
      </Button>
    </Stack>
  );
}
