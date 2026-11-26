import { schemaResolver } from "@mantine/form";
import { IconLifebuoy } from "@tabler/icons-react";
import { expect, test } from "vitest";
import { z } from "zod/v4";

const summarySchema = z.object({
  summary: z.string().trim().min(1, { error: "Enter a summary" }),
});

const validate = schemaResolver(summarySchema, { sync: true });

test("rejects a blank summary", () => {
  expect(validate({ summary: "   " })).toEqual({
    summary: "Enter a summary",
  });
});

test("accepts a nonblank summary", () => {
  expect(validate({ summary: "The page will not open" })).toEqual({});
});

test("loads a Tabler icon component", () => {
  expect(IconLifebuoy).toBeTruthy();
});
