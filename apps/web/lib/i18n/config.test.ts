import { describe, expect, it } from "vitest";
import { createTranslator } from "next-intl";

import en from "@/messages/en.json";
import vi from "@/messages/vi.json";
import { isLocale, resolveLocale } from "./config";

function catalogKeys(value: unknown, prefix = ""): string[] {
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) =>
      catalogKeys(child, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [prefix];
}

describe("locale configuration", () => {
  it("defaults missing and unsupported preferences to Vietnamese", () => {
    for (const value of [undefined, "", "fr", "../../en", null]) {
      expect(resolveLocale(value)).toBe("vi");
      expect(isLocale(value)).toBe(false);
    }
  });

  it("preserves supported preferences", () => {
    expect(resolveLocale("en")).toBe("en");
    expect(resolveLocale("vi")).toBe("vi");
  });

  it("keeps both message catalogs aligned", () => {
    expect(catalogKeys(vi).sort()).toEqual(catalogKeys(en).sort());
  });

  it("formats Vietnamese factory strings", () => {
    const t = createTranslator({ locale: "vi", messages: vi });
    expect(t("Factory.runs")).toBe("Lượt chạy Factory");
  });
});
