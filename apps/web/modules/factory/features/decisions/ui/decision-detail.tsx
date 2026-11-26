"use client";

import { Button, Group, Stack, Text } from "@mantine/core";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";

import { PageBreadcrumbs } from "@/modules/ui/components/page-breadcrumbs";
import { PageHeader } from "@/modules/ui/components/page-header";

import { getDecision } from "../domain/decisions";
import {
  chooseDecision,
  useWorkspaceSession,
  type DecisionChoice,
} from "@/modules/factory/data/workspace-session";

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <Stack gap={2}>
      <Text size="sm" fw={600}>
        {label}
      </Text>
      <Text size="sm">{value}</Text>
    </Stack>
  );
}

export function DecisionDetail({ decisionId }: { decisionId: string }) {
  const t = useTranslations("Factory");
  const decision = getDecision(decisionId);
  const choice: DecisionChoice | null =
    useWorkspaceSession().decisionChoices[decisionId] ?? null;

  if (!decision) {
    notFound();
  }

  function choose(next: DecisionChoice) {
    chooseDecision(decisionId, next);
  }

  return (
    <Stack gap="lg" maw={720}>
      <PageHeader
        breadcrumbs={
          <PageBreadcrumbs
            items={[
              { href: "/decisions", label: t("decisionsTitle") },
              { href: `/decisions/${decision.id}`, label: decision.title },
            ]}
          />
        }
        title={decision.title}
        meta={
          <Text size="sm" c="dimmed">
            {t("decisionsNote")}
          </Text>
        }
      />
      <Fact
        label={t("decisionRecommendation")}
        value={decision.recommendation}
      />
      <Fact label={t("decisionRisk")} value={decision.risk} />
      <Fact label={t("decisionOwner")} value={decision.owner} />
      {choice === "accepted" && <Text size="sm">{t("decisionAccepted")}</Text>}
      {choice === "rejected" && <Text size="sm">{t("decisionRejected")}</Text>}
      <Group gap="sm">
        <Button onClick={() => choose("accepted")}>
          {t("decisionAccept")}
        </Button>
        <Button variant="default" onClick={() => choose("rejected")}>
          {t("decisionReject")}
        </Button>
      </Group>
    </Stack>
  );
}
