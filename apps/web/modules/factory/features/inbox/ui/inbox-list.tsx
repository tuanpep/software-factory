"use client";

import { Button, Stack, Table, Text } from "@mantine/core";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { PageHeader } from "@/modules/ui/components/page-header";

import { intentPrefillHref, listInboxSignals } from "../domain/signals";
import {
  ignoreSignal,
  useWorkspaceSession,
} from "@/modules/factory/data/workspace-session";

export function InboxList() {
  const t = useTranslations("Factory");
  const signals = listInboxSignals(useWorkspaceSession().ignoredSignalIds);

  return (
    <Stack gap="lg">
      <PageHeader
        title={t("inboxTitle")}
        meta={
          <Text size="sm" c="dimmed">
            {t("inboxNote")}
          </Text>
        }
      />
      {signals.length === 0 ? (
        <Text fw={600}>{t("inboxEmpty")}</Text>
      ) : (
        <Table.ScrollContainer minWidth={720}>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t("inboxColSource")}</Table.Th>
                <Table.Th>{t("colTitle")}</Table.Th>
                <Table.Th>{t("inboxColDraft")}</Table.Th>
                <Table.Th>{t("inboxColAction")}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {signals.map((signal) => (
                <Table.Tr key={signal.id}>
                  <Table.Td>
                    {signal.source === "github_issue"
                      ? t("inboxSourceIssue")
                      : t("inboxSourceAlert")}
                  </Table.Td>
                  <Table.Td>
                    <Stack gap={4}>
                      <Text size="sm" fw={500}>
                        {signal.title}
                      </Text>
                      {signal.duplicateCount > 0 && (
                        <Text size="sm" c="dimmed">
                          {t("inboxDuplicate", {
                            count: signal.duplicateCount,
                          })}
                        </Text>
                      )}
                    </Stack>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {t("inboxUntrusted")}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Stack gap="xs">
                      <Button
                        component={Link}
                        href={intentPrefillHref(signal.draft)}
                        size="xs"
                      >
                        {t("inboxOpenIntent")}
                      </Button>
                      <Button
                        variant="default"
                        size="xs"
                        onClick={() => {
                          ignoreSignal(signal.id);
                        }}
                      >
                        {t("inboxIgnore")}
                      </Button>
                    </Stack>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      )}
    </Stack>
  );
}
