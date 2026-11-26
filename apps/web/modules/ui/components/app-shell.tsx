"use client";

import { AppShell as Shell, Burger, Group, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, type ReactNode } from "react";

import { AppHeaderToolbar, AppSkipLink } from "./app-header";
import { AppNav } from "./app-nav";
import { EnvironmentBanner } from "./environment-banner";

import classes from "./app-shell.module.css";

export function AppShell({ children }: { children: ReactNode }) {
  const t = useTranslations("App");
  const pathname = usePathname();
  const [opened, { toggle, close }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  useEffect(() => {
    close();
  }, [pathname, close]);

  return (
    <Shell
      className={classes.root}
      padding="lg"
      header={{ height: 48 }}
      navbar={{
        width: 240,
        breakpoint: "lg",
        collapsed: { mobile: !opened, desktop: !desktopOpened },
      }}
    >
      <AppSkipLink />
      <Shell.Header>
        <div className={classes["header-bar"]}>
          <Group gap="sm" wrap="nowrap" miw={0}>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="lg"
              size="sm"
              aria-label={t("menu")}
            />
            <Burger
              opened={desktopOpened}
              onClick={toggleDesktop}
              visibleFrom="lg"
              size="sm"
              aria-label={t("menu")}
            />
            <Text
              component={Link}
              href="/"
              fw={600}
              size="sm"
              truncate
              className={classes.brand}
            >
              {t("productName")}
            </Text>
          </Group>
          <AppHeaderToolbar />
        </div>
      </Shell.Header>
      <Shell.Navbar p="sm" aria-label={t("navLabel")}>
        <AppNav onNavigate={close} />
      </Shell.Navbar>
      <Shell.Main id="main-content" tabIndex={-1}>
        <Stack gap="lg">
          <EnvironmentBanner />
          {children}
        </Stack>
      </Shell.Main>
    </Shell>
  );
}
