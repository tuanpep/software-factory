"use client";

import { Stack, Table, Text } from "@mantine/core";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { PageHeader } from "@/modules/ui/components/page-header";

import { FOLLOW_DRAFTS } from "../domain/follow-drafts";
import { useWorkspaceSession } from "@/modules/factory/data/workspace-session";

export function FollowList() {
  const t = useTranslations("Factory");
  const stopped = useWorkspaceSession().stoppedFollowIds;

  return (
    <Stack gap="lg">
      <PageHeader
        title={t("followTitle")}
        meta={
          <Text size="sm" c="dimmed">
            {t("followNote")}
          </Text>
        }
      />
      <Table.ScrollContainer minWidth={720}>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t("colTitle")}</Table.Th>
              <Table.Th>{t("followCurrentHead")}</Table.Th>
              <Table.Th>{t("followState")}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {FOLLOW_DRAFTS.map((draft) => (
              <Table.Tr key={draft.id}>
                <Table.Td>
                  <Text
                    component={Link}
                    href={`/follow/${draft.id}`}
                    size="sm"
                    fw={500}
                    c="var(--mantine-color-anchor)"
                    style={{ textDecoration: "none" }}
                  >
                    {draft.title}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" ff="monospace">
                    {draft.currentHead.slice(0, 8)}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">
                    {stopped.includes(draft.id)
                      ? t("followStopped")
                      : draft.stale
                        ? t("followStale")
                        : t("followCurrent")}
                  </Text>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Stack>
  );
}
