"use client";

import {
  Button,
  Divider,
  Group,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";

import { MOCK_PROVIDERS } from "../domain/mock-settings";
import {
  providerConfigSchema,
  type ProviderConfig,
  type ProviderType,
} from "../domain/types";

const PROVIDER_TYPES: ProviderType[] = [
  "openai_compatible",
  "anthropic",
  "local",
];

type ProviderFormState = {
  displayName: string;
  type: ProviderType | null;
  baseUrl: string;
  credentialRef: string;
  defaultModelId: string;
};

const emptyForm: ProviderFormState = {
  displayName: "",
  type: null,
  baseUrl: "",
  credentialRef: "",
  defaultModelId: "",
};

export function ProvidersSettings() {
  const t = useTranslations("Settings");
  const [providers, setProviders] = useState<ProviderConfig[]>(MOCK_PROVIDERS);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<ProviderFormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const typeOptions = PROVIDER_TYPES.map((value) => ({
    value,
    label: t(`providerType.${value}`),
  }));

  function resetForm() {
    setForm(emptyForm);
    setError(null);
    setFormOpen(false);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const parsed = providerConfigSchema.safeParse({
      id: `provider-${crypto.randomUUID()}`,
      displayName: form.displayName.trim(),
      type: form.type,
      baseUrl: form.baseUrl.trim() || undefined,
      credentialRef: form.credentialRef.trim(),
      defaultModelId: form.defaultModelId.trim() || undefined,
    });

    if (!parsed.success) {
      setError(t("formInvalid"));
      return;
    }

    setProviders((prev) => [...prev, parsed.data]);
    resetForm();
  }

  const rows = providers.map((provider) => (
    <Table.Tr key={provider.id}>
      <Table.Td>{provider.displayName}</Table.Td>
      <Table.Td>{t(`providerType.${provider.type}`)}</Table.Td>
      <Table.Td>
        <Text size="sm" ff="monospace">
          {provider.baseUrl ?? "—"}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm" ff="monospace">
          {provider.credentialRef}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm" ff="monospace">
          {provider.defaultModelId ?? "—"}
        </Text>
      </Table.Td>
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
          {t("addProvider")}
        </Button>
      </Group>

      {providers.length === 0 ? (
        <Text size="sm" c="dimmed">
          {t("providersEmpty")}
        </Text>
      ) : (
        <Table.ScrollContainer minWidth={640}>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t("displayName")}</Table.Th>
                <Table.Th>{t("type")}</Table.Th>
                <Table.Th>{t("baseUrl")}</Table.Th>
                <Table.Th>{t("credentialRef")}</Table.Th>
                <Table.Th>{t("defaultModelId")}</Table.Th>
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
            {t("addProvider")}
          </Title>
          <TextInput
            label={t("displayName")}
            required
            autoFocus
            value={form.displayName}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                displayName: event.currentTarget.value,
              }))
            }
          />
          <Select
            label={t("type")}
            required
            data={typeOptions}
            value={form.type}
            allowDeselect={false}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                type: value as ProviderType | null,
              }))
            }
          />
          <TextInput
            label={t("baseUrl")}
            value={form.baseUrl}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                baseUrl: event.currentTarget.value,
              }))
            }
          />
          <TextInput
            label={t("credentialRef")}
            required
            value={form.credentialRef}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                credentialRef: event.currentTarget.value,
              }))
            }
          />
          <TextInput
            label={t("defaultModelId")}
            value={form.defaultModelId}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                defaultModelId: event.currentTarget.value,
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
