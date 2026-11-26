import {
  createTheme,
  defaultVariantColorsResolver,
  rem,
  type CSSVariablesResolver,
  type MantineColorsTuple,
  type VariantColorsResolver,
} from "@mantine/core";

import { arcoComponents } from "./arco-components";

// Arco React 2.66.8 palettes, in Arco shade order (1–10).
const lightColors = {
  blue: [
    "#e8f3ff",
    "#bedaff",
    "#94bfff",
    "#6aa1ff",
    "#4080ff",
    "#165dff",
    "#0e42d2",
    "#072ca6",
    "#031a79",
    "#000d4d",
  ],
  gray: [
    "#f7f8fa",
    "#f2f3f5",
    "#e5e6eb",
    "#c9cdd4",
    "#a9aeb8",
    "#86909c",
    "#6b7785",
    "#4e5969",
    "#272e3b",
    "#1d2129",
  ],
  red: [
    "#ffece8",
    "#fdcdc5",
    "#fbaca3",
    "#f98981",
    "#f76560",
    "#f53f3f",
    "#cb272d",
    "#a1151e",
    "#770813",
    "#4d000a",
  ],
  green: [
    "#e8ffea",
    "#aff0b5",
    "#7be188",
    "#4cd263",
    "#23c343",
    "#00b42a",
    "#009a29",
    "#008026",
    "#006622",
    "#004d1c",
  ],
  orange: [
    "#fff7e8",
    "#ffe4ba",
    "#ffcf8b",
    "#ffb65d",
    "#ff9a2e",
    "#ff7d00",
    "#d25f00",
    "#a64500",
    "#792e00",
    "#4d1b00",
  ],
} satisfies Record<string, MantineColorsTuple>;

type ArcoColor = keyof typeof lightColors;

const darkColors = {
  blue: [
    "#000d4d",
    "#041b79",
    "#0e32a6",
    "#1d4dd2",
    "#306fff",
    "#3c7eff",
    "#689fff",
    "#93beff",
    "#bedaff",
    "#eaf4ff",
  ],
  gray: [
    "#17171a",
    "#2e2e30",
    "#484849",
    "#5f5f60",
    "#78787a",
    "#929293",
    "#ababac",
    "#c5c5c5",
    "#dfdfdf",
    "#f6f6f6",
  ],
  red: [
    "#4d000a",
    "#770611",
    "#a1161f",
    "#cb2e34",
    "#f54e4e",
    "#f76965",
    "#f98d86",
    "#fbb0a7",
    "#fdd1ca",
    "#fff0ec",
  ],
  green: [
    "#004d1c",
    "#046625",
    "#0a802d",
    "#129a37",
    "#1db440",
    "#27c346",
    "#50d266",
    "#7ee18b",
    "#b2f0b7",
    "#ebffec",
  ],
  orange: [
    "#4d1b00",
    "#793004",
    "#a64b0a",
    "#d26913",
    "#ff8d1f",
    "#ff9626",
    "#ffb357",
    "#ffcd87",
    "#ffe3b8",
    "#fff7e8",
  ],
} satisfies Record<ArcoColor, MantineColorsTuple>;

const fontFamily =
  'Inter, -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Noto Sans", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif';

const variantColorResolver: VariantColorsResolver = (input) => {
  if (input.variant === "dashed") {
    return {
      background: "var(--arco-fill-2)",
      hover: "var(--arco-fill-3)",
      color: "var(--arco-text-secondary)",
      border: "1px dashed var(--arco-border)",
    };
  }

  if (input.variant === "outline") {
    return {
      ...defaultVariantColorsResolver(input),
      hover: "transparent",
    };
  }

  const resolved = defaultVariantColorsResolver(input);
  const color = input.color ?? input.theme.primaryColor;

  if (input.variant === "filled" && Object.hasOwn(lightColors, color)) {
    return {
      ...resolved,
      color:
        input.autoContrast === false
          ? resolved.color
          : `var(--arco-on-${color})`,
    };
  }

  return resolved;
};

export const arcoTheme = createTheme({
  colors: {
    ...lightColors,
    dark: [
      "#f6f6f6",
      "#dfdfdf",
      "#ababac",
      "#929293",
      "#5f5f60",
      "#373739",
      "#232324",
      "#17171a",
      "#101012",
      "#09090a",
    ],
  },
  primaryColor: "blue",
  primaryShade: 5,
  variantColorResolver,
  black: "#1d2129",
  cursorType: "pointer",
  fontFamily,
  fontFamilyMonospace: "Consolas, Menlo, monospace",
  fontSizes: {
    xs: rem(12),
    sm: rem(13),
    md: rem(14),
    lg: rem(16),
    xl: rem(20),
  },
  lineHeights: { xs: "1.5", sm: "1.5", md: "1.5715", lg: "1.5", xl: "1.4" },
  headings: {
    fontFamily,
    fontWeight: "500",
    sizes: {
      h1: { fontSize: rem(32), lineHeight: "1.25" },
      h2: { fontSize: rem(24), lineHeight: "1.33" },
      h3: { fontSize: rem(20), lineHeight: "1.4" },
      h4: { fontSize: rem(16), lineHeight: "1.5" },
      h5: { fontSize: rem(14), lineHeight: "1.57" },
      h6: { fontSize: rem(12), lineHeight: "1.5" },
    },
  },
  spacing: { xs: rem(8), sm: rem(12), md: rem(16), lg: rem(24), xl: rem(32) },
  radius: { xs: rem(2), sm: rem(4), md: rem(8), lg: rem(12), xl: rem(16) },
  defaultRadius: "xs",
  shadows: {
    xs: "0 0 5px rgb(0 0 0 / 10%)",
    sm: "0 2px 5px rgb(0 0 0 / 10%)",
    md: "0 4px 10px rgb(0 0 0 / 10%)",
    lg: "0 8px 20px rgb(0 0 0 / 10%)",
    xl: "0 8px 20px rgb(0 0 0 / 20%)",
  },
  components: arcoComponents,
});

function paletteVariables(dark: boolean) {
  return Object.fromEntries(
    Object.entries(dark ? darkColors : lightColors).flatMap(
      ([name, shades]) => {
        const tone = (index: number) => `var(--mantine-color-${name}-${index})`;
        const ink = tone(dark ? 6 : name === "blue" ? 5 : 7);
        const filled = tone(name === "gray" ? (dark ? 8 : 7) : 5);
        // Darken light-mode blue hover to keep white text legible.
        const hover = tone(
          name === "gray" ? (dark ? 7 : 8) : !dark && name === "red" ? 4 : 6,
        );

        return [
          ...shades.map((shade, index) => [
            `--mantine-color-${name}-${index}`,
            shade,
          ]),
          [`--mantine-color-${name}-filled`, filled],
          [`--mantine-color-${name}-filled-hover`, hover],
          [
            `--mantine-color-${name}-light`,
            dark ? `color-mix(in srgb, ${tone(5)} 20%, transparent)` : tone(0),
          ],
          [
            `--mantine-color-${name}-light-hover`,
            dark ? `color-mix(in srgb, ${tone(5)} 30%, transparent)` : tone(1),
          ],
          [`--mantine-color-${name}-light-color`, ink],
          [`--mantine-color-${name}-text`, ink],
          [`--mantine-color-${name}-outline`, ink],
          [
            `--mantine-color-${name}-outline-hover`,
            `color-mix(in srgb, ${ink} 8%, transparent)`,
          ],
          [
            `--arco-on-${name}`,
            !dark && (name === "blue" || name === "gray") ? "#fff" : "#000",
          ],
        ];
      },
    ),
  );
}

const semanticVariables = {
  "--mantine-color-default": "var(--arco-fill-2)",
  "--mantine-color-default-hover": "var(--arco-fill-3)",
  "--mantine-color-default-border": "var(--arco-border)",
  "--mantine-color-default-color": "var(--arco-text-secondary)",
  "--mantine-color-disabled": "var(--arco-fill-2)",
  "--mantine-color-disabled-border": "var(--arco-border)",
  "--mantine-color-anchor": "var(--mantine-primary-color-light-color)",
  "--mantine-color-error": "var(--mantine-color-red-text)",
  "--mantine-color-success": "var(--mantine-color-green-text)",
  "--mantine-primary-color-contrast": "var(--arco-on-blue)",
  "--mantine-color-placeholder": "var(--mantine-color-dimmed)",
  "--arco-tooltip-text": "#fff",
};

export const arcoCssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {},
  light: {
    ...semanticVariables,
    ...paletteVariables(false),
    "--mantine-color-body": "#fff",
    "--mantine-color-text": "#1d2129",
    "--mantine-color-dimmed": "var(--mantine-color-gray-6)",
    "--mantine-color-disabled-color": "var(--mantine-color-gray-5)",
    "--arco-surface": "#fff",
    "--arco-popup": "#fff",
    "--arco-border": "var(--mantine-color-gray-2)",
    "--arco-fill-1": "var(--mantine-color-gray-0)",
    "--arco-fill-2": "var(--mantine-color-gray-1)",
    "--arco-fill-3": "var(--mantine-color-gray-2)",
    "--arco-fill-4": "var(--mantine-color-gray-3)",
    "--arco-text-secondary": "var(--mantine-color-gray-7)",
    "--arco-mask": "rgb(29 33 41 / 60%)",
    "--arco-tooltip-bg": "#1d2129",
  },
  dark: {
    ...semanticVariables,
    ...paletteVariables(true),
    "--mantine-color-body": "#17171a",
    "--mantine-color-text": "rgb(255 255 255 / 90%)",
    "--mantine-color-dimmed": "rgb(255 255 255 / 60%)",
    "--mantine-color-disabled-color": "rgb(255 255 255 / 38%)",
    "--arco-surface": "#232324",
    "--arco-popup": "#373739",
    "--arco-border": "#333335",
    "--arco-fill-1": "rgb(255 255 255 / 4%)",
    "--arco-fill-2": "rgb(255 255 255 / 8%)",
    "--arco-fill-3": "rgb(255 255 255 / 12%)",
    "--arco-fill-4": "rgb(255 255 255 / 16%)",
    "--arco-text-secondary": "rgb(255 255 255 / 70%)",
    "--arco-mask": "rgb(23 23 26 / 60%)",
    "--arco-tooltip-bg": "var(--arco-popup)",
  },
});
