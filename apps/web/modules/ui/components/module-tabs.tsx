"use client";

import { Stack, Tabs, Text } from "@mantine/core";
import { useLocale } from "next-intl";
import type { ReactNode } from "react";

export type ModuleTab = {
  value: string;
  label: string;
  count?: number;
};

export function ModuleTabs({
  label,
  value,
  onChange,
  tabs,
  header,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  tabs: ModuleTab[];
  header: ReactNode;
  children: ReactNode;
}) {
  const locale = useLocale();
  const formatCount = new Intl.NumberFormat(locale).format;

  return (
    <Tabs
      value={value}
      onChange={(next) => {
        if (next) {
          onChange(next);
        }
      }}
    >
      <Stack gap="sm">
        {header}
        <Tabs.List aria-label={label}>
          {tabs.map((tab) => (
            <Tabs.Tab key={tab.value} value={tab.value}>
              {tab.label}
              {tab.count !== undefined && (
                <Text
                  span
                  ms={6}
                  fw={600}
                  c={value === tab.value ? undefined : "dimmed"}
                >
                  {formatCount(tab.count)}
                </Text>
              )}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Stack>
      <Tabs.Panel value={value} pt="lg">
        {children}
      </Tabs.Panel>
    </Tabs>
  );
}
