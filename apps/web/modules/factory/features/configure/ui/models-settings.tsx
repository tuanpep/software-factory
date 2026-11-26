"use client";

import {
  Button,
  Checkbox,
  Divider,
  Group,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";

import { MOCK_MODELS } from "../domain/mock-settings";
import { modelConfigSchema, type ModelConfig } from "../domain/types";

type ModelFormState = {
  providerId: string;
  modelId: string;
  alias: string;
  supportsThinking: boolean;
};

const emptyForm: ModelFormState = {
  providerId: "",
  modelId: "",
  alias: "",
  supportsThinking: false,
};

export function ModelsSettings() {
  const t = useTranslations("Settings");
  const [models, setModels] = useState<ModelConfig[]>(MOCK_MODELS);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<ModelFormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setForm(emptyForm);
    setError(null);
    setFormOpen(false);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const parsed = modelConfigSchema.safeParse({
      id: `model-${crypto.randomUUID()}`,
      providerId: form.providerId.trim(),
      modelId: form.modelId.trim(),
      alias: form.alias.trim(),
      supportsThinking: form.supportsThinking,
    });

    if (!parsed.success) {
      setError(t("formInvalid"));
      return;
    }

    setModels((prev) => [...prev, parsed.data]);
    resetForm();
  }

  const rows = models.map((model) => (
    <Table.Tr key={model.id}>
      <Table.Td>
        <Text size="sm" ff="monospace">
          {model.providerId}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm" ff="monospace">
          {model.modelId}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{model.alias}</Text>
        {model.aliasDrifts && (
          <Text size="sm" c="dimmed">
            {t("aliasDrifts")}
          </Text>
        )}
      </Table.Td>
      <Table.Td>{model.supportsThinking ? t("yes") : t("no")}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack gap="md">
      <Group justify="flex-end">
        <Button
          onClick={() => {
            setFormOpen(true);
            setError(null);
          }}
        >
          {t("addModel")}
        </Button>
      </Group>

      {models.length === 0 ? (
        <Text size="sm" c="dimmed">
          {t("modelsEmpty")}
        </Text>
      ) : (
        <Table.ScrollContainer minWidth={560}>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t("providerId")}</Table.Th>
                <Table.Th>{t("modelId")}</Table.Th>
                <Table.Th>{t("alias")}</Table.Th>
                <Table.Th>{t("supportsThinking")}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      )}

      {formOpen && (
        <Stack component="form" gap="md" maw={480} onSubmit={handleSubmit}>
          <Divider />
          <Title order={2} size="h4">
            {t("addModel")}
          </Title>
          <TextInput
            label={t("providerId")}
            required
            autoFocus
            value={form.providerId}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                providerId: event.currentTarget.value,
              }))
            }
          />
          <TextInput
            label={t("modelId")}
            required
            value={form.modelId}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                modelId: event.currentTarget.value,
              }))
            }
          />
          <TextInput
            label={t("alias")}
            required
            value={form.alias}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                alias: event.currentTarget.value,
              }))
            }
          />
          <Checkbox
            label={t("supportsThinking")}
            checked={form.supportsThinking}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                supportsThinking: event.currentTarget.checked,
              }))
            }
          />
          {error && (
            <Text role="alert" c="red" size="sm">
              {error}
            </Text>
          )}
          <Group gap="sm">
            <Button type="submit">{t("save")}</Button>
            <Button type="button" variant="default" onClick={resetForm}>
              {t("cancel")}
            </Button>
          </Group>
        </Stack>
      )}
    </Stack>
  );
}
