"use client";

import { Box, Flex, NavLink, Stack } from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { PageHeader } from "@/modules/ui/components/page-header";

import { CredentialBrokerNote } from "./credential-broker-note";

const SECTIONS = [
  { href: "/configure/providers", key: "providersTitle" as const },
  { href: "/configure/models", key: "modelsTitle" as const },
  { href: "/configure/profiles", key: "profilesTitle" as const },
  { href: "/configure/enrollment", key: "enrollmentTitle" as const },
  { href: "/configure/pause", key: "pauseTitle" as const },
  { href: "/configure/budgets", key: "budgetsTitle" as const },
];

function activeSection(pathname: string) {
  const match = SECTIONS.find(
    (section) =>
      pathname === section.href || pathname.startsWith(`${section.href}/`),
  );
  if (match) {
    return match.href;
  }
  if (pathname.startsWith("/models")) {
    return "/configure/models";
  }
  if (pathname.startsWith("/profiles")) {
    return "/configure/profiles";
  }
  return "/configure/providers";
}

export function ConfigureNav({ children }: { children: ReactNode }) {
  const t = useTranslations("Settings");
  const pathname = usePathname();
  const current = activeSection(pathname);

  return (
    <Stack gap="lg">
      <PageHeader title={t("configureTitle")} />
      <CredentialBrokerNote />
      <Flex
        gap="xl"
        direction={{ base: "column", sm: "row" }}
        align="flex-start"
      >
        <Stack
          component="nav"
          aria-label={t("configureNavLabel")}
          gap={4}
          w={{ base: "100%", sm: 200 }}
          style={{ flexShrink: 0 }}
        >
          {SECTIONS.map((section) => {
            const active = current === section.href;
            return (
              <NavLink
                key={section.href}
                component={Link}
                href={section.href}
                label={t(section.key)}
                active={active}
                aria-current={active ? "page" : undefined}
              />
            );
          })}
        </Stack>
        <Box flex={1} miw={0} w="100%">
          {children}
        </Box>
      </Flex>
    </Stack>
  );
}
