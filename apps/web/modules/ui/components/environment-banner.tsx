"use client";

import { Text } from "@mantine/core";
import { useTranslations } from "next-intl";

/** Single session-level limitation notice for the local mock prototype. */
export function EnvironmentBanner() {
  const t = useTranslations("App");

  return (
    <Text
      size="sm"
      c="dimmed"
      py={6}
      px="sm"
      style={{
        borderInlineStartWidth: 3,
        borderInlineStartStyle: "solid",
        borderInlineStartColor: "var(--mantine-color-gray-5)",
      }}
    >
      {t("envBannerLocal")}
    </Text>
  );
}
