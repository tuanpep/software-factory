"use client";

import {
  ActionIcon,
  Anchor,
  Group,
  Select,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { useMounted } from "@mantine/hooks";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import { setLocale } from "@/lib/i18n/actions";

import classes from "./app-header.module.css";

export function AppSkipLink() {
  const t = useTranslations("App");

  return (
    <Anchor
      href="#main-content"
      size="sm"
      className={classes["skip-link"]}
    >
      {t("skipToContent")}
    </Anchor>
  );
}

export function AppHeaderToolbar() {
  const t = useTranslations("App");
  const locale = useLocale();
  const [pending, startTransition] = useTransition();
  const [languageError, setLanguageError] = useState(false);
  const mounted = useMounted();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <>
      <Group gap="sm" wrap="nowrap">
        <Select
          aria-label={t("language")}
          value={locale}
          disabled={!mounted || pending}
          size="xs"
          w={110}
          data={[
            { value: "vi", label: "Tiếng Việt" },
            { value: "en", label: "English" },
          ]}
          allowDeselect={false}
          onChange={(nextLocale) => {
            if (nextLocale === null) return;
            setLanguageError(false);
            startTransition(async () => {
              try {
                await setLocale(nextLocale);
              } catch {
                setLanguageError(true);
              }
            });
          }}
        />
        <ActionIcon
          variant="subtle"
          c="dimmed"
          onClick={toggleColorScheme}
          aria-label={colorScheme === "dark" ? t("lightTheme") : t("darkTheme")}
        >
          {colorScheme === "dark" ? (
            <IconSun size={18} />
          ) : (
            <IconMoon size={18} />
          )}
        </ActionIcon>
      </Group>
      {languageError && (
        <Text
          role="alert"
          c="red"
          size="sm"
          className={classes["language-error"]}
        >
          {t("languageError")}
        </Text>
      )}
    </>
  );
}
