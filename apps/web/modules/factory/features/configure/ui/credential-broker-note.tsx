"use client";

import { Text } from "@mantine/core";
import { useTranslations } from "next-intl";

export function CredentialBrokerNote() {
  const t = useTranslations("Settings");

  return (
    <Text size="sm" c="dimmed">
      {t("credentialBrokerNote")}
    </Text>
  );
}
