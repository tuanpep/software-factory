"use client";

import { Stack, Table, Text } from "@mantine/core";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { PageHeader } from "@/modules/ui/components/page-header";

import { FACTORY_DECISIONS } from "../domain/decisions";

export function DecisionList() {
  const t = useTranslations("Factory");

  return (
    <Stack gap="lg">
      <PageHeader
        title={t("decisionsTitle")}
        meta={
          <Text size="sm" c="dimmed">
            {t("decisionsNote")}
          </Text>
        }
      />
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t("colTitle")}</Table.Th>
            <Table.Th>{t("decisionOwner")}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {FACTORY_DECISIONS.map((decision) => (
            <Table.Tr key={decision.id}>
              <Table.Td>
                <Text
                  component={Link}
                  href={`/decisions/${decision.id}`}
                  size="sm"
                  fw={500}
                  c="var(--mantine-color-anchor)"
                  style={{ textDecoration: "none" }}
                >
                  {decision.title}
                </Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm">{decision.owner}</Text>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  );
}
