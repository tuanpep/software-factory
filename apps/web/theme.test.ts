import type { MantineTheme } from "@mantine/core";
import { expect, test } from "vitest";

import { cssVariablesResolver, theme } from "./theme";

test("maps pajamas blue 500 to the filled shade", () => {
  expect(theme.colors?.blue?.[5]).toBe("#1f73ca");
  expect(theme.primaryShade).toEqual({ light: 5, dark: 5 });
  expect(theme.fontSizes?.md).toBe("calc(0.875rem * var(--mantine-scale))");
  expect(theme.defaultRadius).toBe("lg");
  expect(theme.radius).toMatchObject({
    none: "0",
    xs: "1px",
    sm: "calc(0.125rem * var(--mantine-scale))",
    md: "calc(0.25rem * var(--mantine-scale))",
    lg: "calc(0.5rem * var(--mantine-scale))",
    xl: "calc(0.75rem * var(--mantine-scale))",
    "2xl": "calc(1rem * var(--mantine-scale))",
    "3xl": "calc(1.5rem * var(--mantine-scale))",
    full: "9999px",
  });
  expect(theme.components?.Button?.defaultProps?.variant).toBe("default");
  expect(theme.components?.Card?.defaultProps?.radius).toBe("xl");
  expect(theme.components?.Paper?.defaultProps?.radius).toBe("xl");
  expect(theme.components?.Modal?.defaultProps?.radius).toBe("2xl");
  expect(theme.components?.Alert?.defaultProps?.radius).toBe("lg");
  expect(theme.components?.Badge?.defaultProps?.radius).toBe("full");
  expect(theme.components?.Progress?.defaultProps?.radius).toBe("full");
  expect(theme.components?.Avatar?.defaultProps?.radius).toBe("full");
});

test("resolves light text and border roles", () => {
  const variables = cssVariablesResolver({} as MantineTheme);

  expect(variables.light["--mantine-color-anchor"]).toBe("#27599f");
  expect(variables.light["--mantine-color-default-border"]).toBe("#dcdbd9");
  expect(variables.light["--gl-text-heading"]).toBe("#18171d");
  expect(variables.light["--gl-bg-canvas"]).toBe("#f7f7f5");
  expect(variables.light["--gl-chrome-bg"]).toBe("#ecebea");
  expect(variables.light["--gl-main-bg"]).toBe("#fff");
  expect(variables.light["--gl-confirm-bg"]).toBe("#3a383d");
  expect(variables.light["--gl-focus-outer"]).toBe("#1f73ca");
  expect(variables.light["--gl-tab-indicator"]).toBe("#050408");
  expect(variables.light["--gl-tab-fg"]).toBe("#28272d");
  expect(variables.dark["--gl-tab-indicator"]).toBe("#fff");
  expect(variables.light["--gl-badge-info-bg"]).toBe("#c8e0f9");
  expect(variables.light["--gl-segment-selected-bg"]).toBe("#ecebea");
  expect(variables.light["--gl-toggle-checked-bg"]).toBe("#1f73ca");
  expect(variables.light["--gl-alert-danger-bg"]).toBe("#feeef0");
  expect(variables.light["--gl-pagination-active-bg"]).toBe("#3a383d");
  expect(variables.dark["--gl-segment-selected-bg"]).toBe("#a5a3a3");
  expect(variables.dark["--gl-pagination-active-bg"]).toBe("#ecebea");
  expect(variables.dark["--gl-toggle-checked-bg"]).toBe("#64a7e9");
  expect(variables.dark["--mantine-color-anchor"]).toBe("#9dc8f2");
  expect(variables.dark["--gl-bg-canvas"]).toBe("#18171d");
  expect(variables.dark["--gl-chrome-bg"]).toBe("#050408");
  expect(variables.dark["--gl-main-bg"]).toBe("#18171d");
  expect(variables.dark["--gl-focus-outer"]).toBe("#3f8edd");
  expect(theme.shadows?.md).toContain("var(--gl-shadow-color)");
});
