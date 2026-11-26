"use client";

import {
  Button,
  Group,
  Radio,
  Select,
  Stack,
  Stepper,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { z } from "zod/v4";

import { PageBreadcrumbs } from "@/modules/ui/components/page-breadcrumbs";
import { PageHeader } from "@/modules/ui/components/page-header";

import { createLocalRun } from "../domain/create-local-run";
import { addLocalRun } from "../domain/local-runs";
import { listInstalledPlugins } from "../domain/plugins";

const STEPS = ["job", "fields", "producer", "review"] as const;
type WizardStep = (typeof STEPS)[number];

const docsLinkFieldsSchema = z.object({
  markdownPath: z
    .string()
    .trim()
    .min(1)
    .refine(
      (value) => value.startsWith("docs/") && value.endsWith(".md"),
      "markdownPathFormat",
    ),
  brokenLink: z.string().trim().min(1),
  destination: z.string().trim().min(1),
  observed: z.string(),
  desired: z.string(),
  nonGoals: z.string(),
  evidencePlan: z.string(),
  openQuestions: z.string(),
});

type DocsLinkFields = z.infer<typeof docsLinkFieldsSchema>;

type FieldErrors = Partial<Record<keyof DocsLinkFields, string>>;

const DEFAULT_FIELDS: DocsLinkFields = {
  markdownPath: "docs/setup.md",
  brokenLink: "",
  destination: "",
  observed: "",
  desired: "",
  nonGoals: "",
  evidencePlan: "",
  openQuestions: "",
};

function fieldsFromSearch(params: URLSearchParams): DocsLinkFields {
  return {
    markdownPath: params.get("markdownPath") || DEFAULT_FIELDS.markdownPath,
    brokenLink: params.get("brokenLink") ?? "",
    destination: params.get("destination") ?? "",
    observed: params.get("observed") ?? "",
    desired: params.get("desired") ?? "",
    nonGoals: params.get("nonGoals") ?? "",
    evidencePlan: params.get("evidencePlan") ?? "",
    openQuestions: params.get("openQuestions") ?? "",
  };
}

export function NewRunWizard() {
  const t = useTranslations("Factory");
  const router = useRouter();
  const searchParams = useSearchParams();
  const plugins = useMemo(() => listInstalledPlugins(), []);

  const [active, setActive] = useState(0);
  const [pluginId, setPluginId] = useState<string | null>(
    plugins[0]?.id ?? null,
  );
  const [fields, setFields] = useState<DocsLinkFields>(() =>
    fieldsFromSearch(searchParams),
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [producer, setProducer] = useState<string | null>(null);
  const [producerError, setProducerError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  const plugin = plugins.find((item) => item.id === pluginId) ?? null;
  const step = STEPS[active] as WizardStep | undefined;

  const producerOptions = useMemo(
    () =>
      (plugin?.allowedProducers ?? []).map((value) => ({
        value,
        label:
          value === "deterministic" ? t("newRunProducerDeterministic") : value,
      })),
    [plugin, t],
  );

  function validateFields(): boolean {
    const result = docsLinkFieldsSchema.safeParse(fields);
    if (result.success) {
      setFieldErrors({});
      setFields(result.data);
      return true;
    }
    const next: FieldErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0];
      if (
        key === "markdownPath" ||
        key === "brokenLink" ||
        key === "destination"
      ) {
        if (issue.message === "markdownPathFormat") {
          next[key] = t("newRunFieldMarkdownPathHint");
        } else {
          next[key] = t("newRunFieldRequired");
        }
      }
    }
    setFieldErrors(next);
    return false;
  }

  function goNext() {
    if (step === "job") {
      if (!plugin) {
        return;
      }
      if (!producer && plugin.allowedProducers[0]) {
        setProducer(plugin.allowedProducers[0]);
      }
      setActive(1);
      return;
    }
    if (step === "fields") {
      if (!validateFields()) {
        return;
      }
      setActive(2);
      return;
    }
    if (step === "producer") {
      if (!producer || !plugin?.allowedProducers.includes(producer)) {
        setProducerError(t("newRunFieldRequired"));
        return;
      }
      setProducerError(null);
      setActive(3);
    }
  }

  function goBack() {
    setActive((current) => Math.max(0, current - 1));
  }

  function startRun() {
    if (!plugin || !producer) {
      return;
    }
    const parsed = docsLinkFieldsSchema.safeParse(fields);
    if (!parsed.success) {
      setActive(1);
      validateFields();
      return;
    }
    setStarting(true);
    const run = addLocalRun(
      createLocalRun({
        plugin,
        fields: parsed.data,
        producer,
      }),
    );
    router.push(`/runs/${run.id}`);
  }

  return (
    <Stack gap="lg" maw={640}>
      <PageHeader
        breadcrumbs={
          <PageBreadcrumbs
            items={[
              { href: "/", label: t("reviewTitle") },
              { href: "/runs/new", label: t("newRunTitle") },
            ]}
          />
        }
        title={t("newRunTitle")}
        meta={
          <Text size="sm" c="dimmed">
            {t("newRunMockNote")}
          </Text>
        }
      />

      <Stepper
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={false}
        styles={{
          steps: {
            flexWrap: "wrap",
            rowGap: "var(--mantine-spacing-sm)",
          },
        }}
      >
        <Stepper.Step label={t("newRunStepJob")}>
          <Stack gap="md" mt="md">
            <Radio.Group
              label={t("newRunJobLabel")}
              value={pluginId ?? undefined}
              onChange={setPluginId}
            >
              <Stack gap="xs" mt="xs">
                {plugins.map((item) => (
                  <Radio
                    key={item.id}
                    value={item.id}
                    label={item.title}
                    description={item.description}
                  />
                ))}
              </Stack>
            </Radio.Group>
          </Stack>
        </Stepper.Step>

        <Stepper.Step label={t("newRunStepFields")}>
          <Stack gap="md" mt="md">
            <TextInput
              label={t("newRunFieldMarkdownPath")}
              value={fields.markdownPath}
              error={fieldErrors.markdownPath}
              onChange={(event) =>
                setFields((current) => ({
                  ...current,
                  markdownPath: event.currentTarget.value,
                }))
              }
            />
            <TextInput
              label={t("newRunFieldBrokenLink")}
              value={fields.brokenLink}
              error={fieldErrors.brokenLink}
              onChange={(event) =>
                setFields((current) => ({
                  ...current,
                  brokenLink: event.currentTarget.value,
                }))
              }
            />
            <TextInput
              label={t("newRunFieldDestination")}
              value={fields.destination}
              error={fieldErrors.destination}
              onChange={(event) =>
                setFields((current) => ({
                  ...current,
                  destination: event.currentTarget.value,
                }))
              }
            />
            <Textarea
              label={t("newRunFieldObserved")}
              value={fields.observed}
              autosize
              minRows={2}
              onChange={(event) =>
                setFields((current) => ({
                  ...current,
                  observed: event.currentTarget.value,
                }))
              }
            />
            <Textarea
              label={t("newRunFieldDesired")}
              value={fields.desired}
              autosize
              minRows={2}
              onChange={(event) =>
                setFields((current) => ({
                  ...current,
                  desired: event.currentTarget.value,
                }))
              }
            />
            <Textarea
              label={t("newRunFieldNonGoals")}
              value={fields.nonGoals}
              autosize
              minRows={2}
              onChange={(event) =>
                setFields((current) => ({
                  ...current,
                  nonGoals: event.currentTarget.value,
                }))
              }
            />
            <Textarea
              label={t("newRunFieldEvidencePlan")}
              value={fields.evidencePlan}
              autosize
              minRows={2}
              onChange={(event) =>
                setFields((current) => ({
                  ...current,
                  evidencePlan: event.currentTarget.value,
                }))
              }
            />
            <Textarea
              label={t("newRunFieldOpenQuestions")}
              value={fields.openQuestions}
              autosize
              minRows={2}
              onChange={(event) =>
                setFields((current) => ({
                  ...current,
                  openQuestions: event.currentTarget.value,
                }))
              }
            />
          </Stack>
        </Stepper.Step>

        <Stepper.Step label={t("newRunStepProducer")}>
          <Stack gap="md" mt="md">
            <Select
              label={t("newRunProducerLabel")}
              data={producerOptions}
              value={producer}
              error={producerError}
              onChange={(value) => {
                setProducer(value);
                setProducerError(null);
              }}
              allowDeselect={false}
            />
            {producer === "deterministic" && (
              <Text size="sm" c="dimmed">
                {t("newRunProducerDeterministicNote")}
              </Text>
            )}
          </Stack>
        </Stepper.Step>

        <Stepper.Step label={t("newRunStepReview")}>
          <Stack gap="sm" mt="md">
            <Text>
              <Text span fw={600}>
                {t("newRunReviewJob")}
              </Text>
              {": "}
              {plugin?.title ?? "—"}
            </Text>
            <Text>
              <Text span fw={600}>
                {t("newRunFieldMarkdownPath")}
              </Text>
              {": "}
              {fields.markdownPath}
            </Text>
            <Text>
              <Text span fw={600}>
                {t("newRunFieldBrokenLink")}
              </Text>
              {": "}
              {fields.brokenLink}
            </Text>
            <Text>
              <Text span fw={600}>
                {t("newRunFieldDestination")}
              </Text>
              {": "}
              {fields.destination}
            </Text>
            <Text>
              <Text span fw={600}>
                {t("newRunFieldObserved")}
              </Text>
              {": "}
              {fields.observed || "—"}
            </Text>
            <Text>
              <Text span fw={600}>
                {t("newRunFieldDesired")}
              </Text>
              {": "}
              {fields.desired || "—"}
            </Text>
            <Text>
              <Text span fw={600}>
                {t("newRunFieldNonGoals")}
              </Text>
              {": "}
              {fields.nonGoals || "—"}
            </Text>
            <Text>
              <Text span fw={600}>
                {t("newRunFieldEvidencePlan")}
              </Text>
              {": "}
              {fields.evidencePlan || "—"}
            </Text>
            <Text>
              <Text span fw={600}>
                {t("newRunFieldOpenQuestions")}
              </Text>
              {": "}
              {fields.openQuestions || "—"}
            </Text>
            {fields.openQuestions.trim() && (
              <Text size="sm">{t("newRunBlockingQuestion")}</Text>
            )}
            <Text>
              <Text span fw={600}>
                {t("newRunReviewProducer")}
              </Text>
              {": "}
              {producer === "deterministic"
                ? t("newRunProducerDeterministic")
                : (producer ?? "—")}
            </Text>
          </Stack>
        </Stepper.Step>
      </Stepper>

      <Group justify="space-between">
        <Button
          variant="default"
          onClick={goBack}
          disabled={active === 0 || starting}
        >
          {t("newRunBack")}
        </Button>
        {active < STEPS.length - 1 ? (
          <Button onClick={goNext} disabled={!pluginId}>
            {step === "job"
              ? t("newRunContinueFields")
              : step === "fields"
                ? t("newRunContinueProducer")
                : t("newRunContinueReview")}
          </Button>
        ) : (
          <Button onClick={startRun} loading={starting}>
            {t("newRunStart")}
          </Button>
        )}
      </Group>
    </Stack>
  );
}
