"use client";

import {
  Anchor,
  Button,
  Code,
  Collapse,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { PageBreadcrumbs } from "@/modules/ui/components/page-breadcrumbs";
import { PageHeader } from "@/modules/ui/components/page-header";

import type { FactoryRunDetail as FactoryRunDetailModel } from "../domain/types";
import { PipelineGraph } from "./pipeline-graph";
import { RunStatusPill } from "./run-status-pill";

import classes from "./run-detail.module.css";

const IN_PROGRESS: ReadonlySet<FactoryRunDetailModel["status"]> = new Set([
  "queued",
  "producing",
  "verifying",
]);

function formatStartedAt(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function lineKind(line: string) {
  if (
    line.startsWith("+++") ||
    line.startsWith("---") ||
    line.startsWith("@@") ||
    line.startsWith("diff")
  ) {
    return "meta";
  }
  if (line.startsWith("+")) return "add";
  if (line.startsWith("-")) return "del";
  return "ctx";
}

function Fact({
  label,
  children,
  mono = false,
}: {
  label: string;
  children: ReactNode;
  mono?: boolean;
}) {
  return (
    <div className={classes.fact}>
      <span className={classes["fact-label"]}>{label}</span>
      <p className={classes["fact-value"]} data-mono={mono || undefined}>
        {children}
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Stack gap="xs">
      <Title order={2} size="h4">
        {title}
      </Title>
      {children}
    </Stack>
  );
}

export function RunDetail({ run }: { run: FactoryRunDetailModel }) {
  const t = useTranslations("Factory");
  const locale = useLocale();
  const [receiptOpen, { toggle: toggleReceipt }] = useDisclosure(false);
  const showPatch = run.patchUnified !== null && !IN_PROGRESS.has(run.status);
  const needsDispatch =
    run.status === "stale_base" || run.status === "needs_input";
  const intentLine = `${run.approvedIntent.markdownPath}: ${run.approvedIntent.brokenLink || "—"} → ${run.approvedIntent.destination || "—"}`;
  const patchDigest =
    run.receipt &&
    typeof run.receipt === "object" &&
    "patchSha256" in run.receipt &&
    typeof run.receipt.patchSha256 === "string"
      ? run.receipt.patchSha256.slice(0, 12)
      : null;

  const heading = t("runIdAttempt", { id: run.id, attempt: run.attempt });

  return (
    <Stack gap="lg">
      <PageHeader
        breadcrumbs={
          <PageBreadcrumbs
            items={[
              { href: "/", label: t("reviewTitle") },
              { href: `/runs/${run.id}`, label: heading },
            ]}
          />
        }
        title={heading}
        titleAdornment={<RunStatusPill status={run.status} />}
        meta={
          <Stack gap={4}>
            <Text size="sm">{run.title}</Text>
            <Text size="sm" c="dimmed" ff="monospace" suppressHydrationWarning>
              {t("runMeta", {
                job: run.jobId,
                repository: run.repository,
                started: formatStartedAt(run.startedAt, locale),
              })}
            </Text>
          </Stack>
        }
        actions={
          <>
            {run.githubRunUrl && (
              <Button component="a" href={run.githubRunUrl} variant="default">
                {t("openGitHubRun")}
              </Button>
            )}
            {needsDispatch && (
              <Button component={Link} href="/runs/new">
                {t("freshDispatch")}
              </Button>
            )}
          </>
        }
      />

      <Section title={t("pipelineLabel")}>
        <PipelineGraph status={run.status} variant="full" />
      </Section>

      <div className={classes.verdict}>
        <Fact label={t("nextAction")}>
          {t(`nextActionByStatus.${run.status}`)}
        </Fact>
        {run.status === "stale_base" && (
          <Text size="sm" c="orange">
            {t("staleBaseWarning")}
          </Text>
        )}
      </div>

      <Section title={t("sectionIntent")}>
        <Fact label={t("requested")}>{intentLine}</Fact>
      </Section>

      <Section title={t("sectionChecks")}>
        <Stack gap="sm">
          {run.checks.map((check) => (
            <Stack key={check.name} gap={4}>
              <Text size="sm" fw={600}>
                {check.name}
              </Text>
              <Fact label={t("before")}>{check.before}</Fact>
              <Fact label={t("after")}>{check.after}</Fact>
            </Stack>
          ))}
          {run.coverageGaps.map((gap) => (
            <Fact key={gap} label={t("notChecked")}>
              {gap}
            </Fact>
          ))}
        </Stack>
      </Section>

      <Section title={t("evidence")}>
        <Stack gap="xs">
          <Text size="sm" ff="monospace">
            {t("evidenceSummary", {
              base: `${run.baseSha.slice(0, 8)}…`,
              recipe: run.recipeId,
            })}
          </Text>
          {patchDigest && (
            <Fact label={t("patchDigest")} mono>
              {`${patchDigest}…`}
            </Fact>
          )}
        </Stack>
      </Section>

      {IN_PROGRESS.has(run.status) ? (
        <Text size="sm" c="dimmed">
          {t("patchPending")}
        </Text>
      ) : showPatch && run.patchUnified ? (
        <Section title={t("diff")}>
          <Stack gap="xs">
            <Text size="sm" c="dimmed" ff="monospace">
              {run.approvedIntent.markdownPath}
            </Text>
            {run.status === "stale_base" && (
              <Text size="sm" c="orange">
                {t("historicalPatch")}
              </Text>
            )}
            <pre className={classes.diff}>
              {run.patchUnified.split("\n").map((line, index) => (
                <div
                  key={`${index}-${line}`}
                  className={classes.line}
                  data-kind={lineKind(line)}
                >
                  {line.length === 0 ? " " : line}
                </div>
              ))}
            </pre>
          </Stack>
        </Section>
      ) : null}

      <Stack gap="xs">
        <Button variant="subtle" onClick={toggleReceipt} px={0} w="fit-content">
          {receiptOpen ? t("hideReceipt") : t("showReceipt")}
        </Button>
        <Collapse expanded={receiptOpen}>
          <Code block style={{ whiteSpace: "pre-wrap", overflowX: "auto" }}>
            {JSON.stringify(run.receipt, null, 2)}
          </Code>
        </Collapse>
        {run.githubRunUrl && (
          <Anchor href={run.githubRunUrl} size="sm" w="fit-content">
            {t("diagnosticsInGitHub")}
          </Anchor>
        )}
      </Stack>
    </Stack>
  );
}
