"use client";

import {
  Button,
  Divider,
  Group,
  Stack,
  Table,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";

import { MOCK_AGENT_PROFILES } from "../domain/mock-settings";
import { agentProfileSchema, type AgentProfile } from "../domain/types";

type ProfileFormState = {
  name: string;
  providerId: string;
  modelId: string;
  whenToUse: string;
};

const emptyForm: ProfileFormState = {
  name: "",
  providerId: "",
  modelId: "",
  whenToUse: "",
};

export function ProfilesSettings() {
  const t = useTranslations("Settings");
  const [profiles, setProfiles] = useState<AgentProfile[]>(MOCK_AGENT_PROFILES);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<ProfileFormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setForm(emptyForm);
    setError(null);
    setFormOpen(false);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const parsed = agentProfileSchema.safeParse({
      id: `profile-${crypto.randomUUID()}`,
      name: form.name.trim(),
      providerId: form.providerId.trim(),
      modelId: form.modelId.trim(),
      whenToUse: form.whenToUse.trim(),
    });

    if (!parsed.success) {
      setError(t("formInvalid"));
      return;
    }

    setProfiles((prev) => [...prev, parsed.data]);
    resetForm();
  }

  const rows = profiles.map((profile) => (
    <Table.Tr key={profile.id}>
      <Table.Td>{profile.name}</Table.Td>
      <Table.Td>
        <Text size="sm" ff="monospace">
          {profile.providerId} / {profile.modelId}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{profile.whenToUse}</Text>
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
          {t("addProfile")}
        </Button>
      </Group>

      {profiles.length === 0 ? (
        <Text size="sm" c="dimmed">
          {t("profilesEmpty")}
        </Text>
      ) : (
        <Table.ScrollContainer minWidth={560}>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t("name")}</Table.Th>
                <Table.Th>{t("providerModel")}</Table.Th>
                <Table.Th>{t("whenToUse")}</Table.Th>
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
            {t("addProfile")}
          </Title>
          <TextInput
            label={t("name")}
            required
            autoFocus
            value={form.name}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                name: event.currentTarget.value,
              }))
            }
          />
          <TextInput
            label={t("providerId")}
            required
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
          <Textarea
            label={t("whenToUse")}
            required
            minRows={2}
            value={form.whenToUse}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                whenToUse: event.currentTarget.value,
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
