"use client";

import { Badge } from "@mantine/core";
import { useTranslations } from "next-intl";

import type { FactoryRunStatus } from "../domain/types";

const STATUS_COLOR: Record<FactoryRunStatus, string> = {
  queued: "blue",
  producing: "blue",
  verifying: "blue",
  ready: "green",
  needs_input: "orange",
  stale_base: "orange",
  policy_rejected: "red",
  verification_failed: "red",
  infrastructure_failed: "red",
  budget_exhausted: "red",
  cancelled: "gray",
  evidence_unavailable: "red",
};

export function RunStatusPill({ status }: { status: FactoryRunStatus }) {
  const t = useTranslations("Factory");

  return (
    <Badge
      variant="light"
      color={STATUS_COLOR[status]}
      size="md"
      radius="xs"
      styles={{
        root: { flexShrink: 0, maxWidth: "none", overflow: "visible" },
        label: { overflow: "visible" },
      }}
    >
      {t(`status.${status}`)}
    </Badge>
  );
}
