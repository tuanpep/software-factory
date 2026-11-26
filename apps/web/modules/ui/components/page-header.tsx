"use client";

import { Group, Stack, Title } from "@mantine/core";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  actions,
  breadcrumbs,
  titleAdornment,
  meta,
  children,
}: {
  title: string;
  actions?: ReactNode;
  breadcrumbs?: ReactNode;
  titleAdornment?: ReactNode;
  meta?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Stack gap="sm">
      {breadcrumbs}
      <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
        <Stack gap={4} miw={0}>
          <Group gap="sm" align="center" wrap="wrap">
            <Title order={1} size="h3" style={{ overflowWrap: "anywhere" }}>
              {title}
            </Title>
            {titleAdornment}
          </Group>
          {meta}
        </Stack>
        {actions ? (
          <Group gap="sm" wrap="wrap">
            {actions}
          </Group>
        ) : null}
      </Group>
      {children}
    </Stack>
  );
}
