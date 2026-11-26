"use client";

import { Container, Group, Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";

import {
  AppHeaderToolbar,
  AppSkipLink,
} from "@/modules/ui/components/navigation/app-header";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Container size="md" py="lg">
      <AppSkipLink />
      <Stack gap="lg">
        <Group component="header" justify="space-between" pos="relative">
          <Text fw={700}>Software Factory</Text>
          <AppHeaderToolbar />
        </Group>
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
      </Stack>
    </Container>
  );
}
