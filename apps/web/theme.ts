"use client";

import {
  Accordion,
  ActionIcon,
  Alert,
  Anchor,
  AppShell,
  Avatar,
  Badge,
  Breadcrumbs,
  Burger,
  Button,
  Card,
  Checkbox,
  CloseButton,
  Combobox,
  ComboboxPopover,
  Divider,
  Drawer,
  Input,
  Loader,
  Menu,
  Modal,
  NavLink,
  Pagination,
  Paper,
  Popover,
  Progress,
  Radio,
  SegmentedControl,
  Skeleton,
  Switch,
  Table,
  Tabs,
  Title,
  Tooltip,
  createTheme,
  defaultVariantColorsResolver,
  parseThemeColor,
  rem,
  type AccordionProps,
  type CSSVariablesResolver,
  type MantineColorsTuple,
  type MantineTheme,
  type VariantColorsResolver,
} from "@mantine/core";

import classes from "./pajamas.module.css";

const sansFamily =
  'var(--font-gitlab-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", Ubuntu, Cantarell, "Helvetica Neue", sans-serif)';
const monoFamily =
  'var(--font-gitlab-mono, Menlo, "DejaVu Sans Mono", "Liberation Mono", Consolas, "Ubuntu Mono", "Courier New", monospace)';

const neutral = {
  0: "#fff",
  10: "#f7f7f5",
  50: "#ecebea",
  100: "#dcdbd9",
  200: "#c1bfbe",
  300: "#a5a3a3",
  400: "#8a8888",
  500: "#747273",
  600: "#646163",
  700: "#4d4b4e",
  800: "#3a383d",
  900: "#28272d",
  950: "#18171d",
  1000: "#050408",
} as const;

const alpha = {
  dark6: "rgba(5, 5, 6, 0.06)",
  dark16: "rgba(5, 5, 6, 0.16)",
  dark24: "rgba(5, 5, 6, 0.24)",
  dark8: "rgba(5, 5, 6, 0.08)",
  dark40: "rgba(5, 5, 6, 0.4)",
  light8: "rgba(255, 255, 255, 0.08)",
  light16: "rgba(255, 255, 255, 0.16)",
} as const;

function ramp(
  step50: string,
  step100: string,
  step200: string,
  step300: string,
  step400: string,
  step500: string,
  step600: string,
  step700: string,
  step800: string,
  step900: string,
  step950: string,
): MantineColorsTuple {
  return [
    step50,
    step100,
    step200,
    step300,
    step400,
    step500,
    step600,
    step700,
    step800,
    step900,
    step950,
  ];
}

const blue = ramp(
  "#e8f2fd",
  "#c8e0f9",
  "#9dc8f2",
  "#64a7e9",
  "#3f8edd",
  "#1f73ca",
  "#2566b5",
  "#27599f",
  "#254581",
  "#1f3166",
  "#1d2153",
);
const green = ramp(
  "#e6f5ea",
  "#bee6d0",
  "#84d4b6",
  "#35b597",
  "#129c84",
  "#0d8070",
  "#0c7265",
  "#0b645a",
  "#075048",
  "#003c36",
  "#002c26",
);
const orange = ramp(
  "#fdf0d5",
  "#fada9c",
  "#f7b951",
  "#fb8017",
  "#e95f21",
  "#c74816",
  "#b34013",
  "#9e3811",
  "#7d2d0e",
  "#5d220d",
  "#461807",
);
const red = ramp(
  "#feeef0",
  "#ffd3d7",
  "#ffafb8",
  "#fc7988",
  "#f15168",
  "#de1d4b",
  "#c52042",
  "#ac203a",
  "#891c2f",
  "#641925",
  "#48151d",
);
const purple = ramp(
  "#f4f0fc",
  "#e1daf7",
  "#c9beef",
  "#a997e1",
  "#927cd7",
  "#7862c8",
  "#6a54c0",
  "#5b46b8",
  "#483698",
  "#362676",
  "#291a5c",
);

const gray: MantineColorsTuple = [
  neutral[50],
  neutral[100],
  neutral[200],
  neutral[300],
  neutral[400],
  neutral[500],
  neutral[600],
  neutral[700],
  neutral[800],
  neutral[900],
  neutral[950],
];

const dark: MantineColorsTuple = [
  neutral[50],
  neutral[100],
  neutral[200],
  neutral[400],
  neutral[700],
  neutral[800],
  neutral[900],
  neutral[950],
  neutral[950],
  neutral[1000],
];

function primaryShadeIndex(theme: MantineTheme) {
  if (typeof theme.primaryShade === "number") {
    return theme.primaryShade;
  }

  return theme.primaryShade.light;
}

function filledActiveColor(theme: MantineTheme, color: string | undefined) {
  const parsed = parseThemeColor({
    color: color || theme.primaryColor,
    theme,
  });

  if (!parsed.isThemeColor) {
    return undefined;
  }

  const shade = parsed.shade ?? primaryShadeIndex(theme);
  const activeShade = Math.min(shade + 2, 9);

  return `var(--mantine-color-${parsed.color}-${activeShade})`;
}

function controlMetrics(size: string | undefined) {
  if (size === "xs" || size?.startsWith("compact-")) {
    return {
      height: rem(24),
      paddingX: rem(8),
      fontSize: rem(12),
    };
  }

  return {
    height: rem(32),
    paddingX: rem(8),
    fontSize: rem(14),
  };
}

const shadowColor = "var(--gl-shadow-color)";
const shadow = {
  sm: `0 0 2px 0 ${shadowColor}, 0 1px 4px 0 ${shadowColor}`,
  md: `0 0 1px 0 ${shadowColor}, 0 0 2px 0 ${shadowColor}, 0 2px 8px 0 ${shadowColor}`,
  lg: `0 0 2px 0 ${shadowColor}, 0 0 2px 0 ${shadowColor}, 0 4px 12px 0 ${shadowColor}`,
} as const;

type BadgeTone =
  "info" | "success" | "warning" | "danger" | "neutral" | "brand";

function badgeTone(color: string | undefined): BadgeTone {
  switch (color) {
    case "green":
      return "success";
    case "orange":
      return "warning";
    case "red":
      return "danger";
    case "gray":
    case "dark":
      return "neutral";
    case "violet":
      return "brand";
    case "blue":
    case undefined:
      return "info";
    default:
      return "info";
  }
}

const variantColorResolver: VariantColorsResolver = (input) => {
  const resolved = defaultVariantColorsResolver(input);

  if (input.variant === "subtle") {
    return {
      ...resolved,
      background: "transparent",
      hover: "var(--gl-action-hover)",
      border: `${rem(1)} solid transparent`,
    };
  }

  if (input.variant === "transparent") {
    return {
      background: "transparent",
      hover: "transparent",
      color: "var(--mantine-color-anchor)",
      border: `${rem(1)} solid transparent`,
    };
  }

  return resolved;
};

const badgeVariables = (step: "light" | "dark") =>
  step === "light"
    ? {
        "--gl-badge-info-bg": blue[1],
        "--gl-badge-info-fg": blue[7],
        "--gl-badge-success-bg": green[1],
        "--gl-badge-success-fg": green[7],
        "--gl-badge-warning-bg": orange[1],
        "--gl-badge-warning-fg": orange[7],
        "--gl-badge-danger-bg": red[1],
        "--gl-badge-danger-fg": red[7],
        "--gl-badge-neutral-bg": neutral[100],
        "--gl-badge-neutral-fg": neutral[700],
        "--gl-badge-brand-bg": purple[1],
        "--gl-badge-brand-fg": purple[7],
      }
    : {
        "--gl-badge-info-bg": blue[3],
        "--gl-badge-info-fg": blue[10],
        "--gl-badge-success-bg": green[3],
        "--gl-badge-success-fg": green[10],
        "--gl-badge-warning-bg": orange[3],
        "--gl-badge-warning-fg": orange[10],
        "--gl-badge-danger-bg": red[3],
        "--gl-badge-danger-fg": red[10],
        "--gl-badge-neutral-bg": neutral[300],
        "--gl-badge-neutral-fg": neutral[950],
        "--gl-badge-brand-bg": purple[3],
        "--gl-badge-brand-fg": purple[10],
      };

const controlVariables = (step: "light" | "dark") =>
  step === "light"
    ? {
        "--gl-segment-selected-bg": neutral[50],
        "--gl-segment-selected-fg": neutral[800],
        "--gl-segment-selected-bd": neutral[300],
        "--gl-toggle-bg": neutral[600],
        "--gl-toggle-checked-bg": blue[5],
        "--gl-toggle-thumb": neutral[0],
        "--gl-alert-info-bg": blue[0],
        "--gl-alert-success-bg": green[0],
        "--gl-alert-warning-bg": orange[0],
        "--gl-alert-danger-bg": red[0],
        "--gl-alert-neutral-bg": neutral[50],
        "--gl-alert-brand-bg": purple[0],
        "--gl-alert-info-accent": blue[5],
        "--gl-alert-success-accent": green[5],
        "--gl-alert-warning-accent": orange[5],
        "--gl-alert-danger-accent": red[5],
        "--gl-alert-neutral-accent": neutral[500],
        "--gl-alert-brand-accent": purple[5],
        "--gl-tooltip-bg": neutral[800],
        "--gl-tooltip-fg": neutral[0],
        "--gl-progress-track": neutral[200],
        "--gl-progress-indicator": blue[5],
        "--gl-skeleton-bg": neutral[100],
        "--gl-loader-color": neutral[700],
        "--gl-pagination-active-bg": neutral[800],
        "--gl-pagination-active-fg": neutral[0],
        "--gl-breadcrumb-separator": neutral[400],
        "--gl-avatar-border": alpha.dark8,
        "--gl-nav-active": neutral[100],
        "--gl-nav-fg": neutral[600],
        "--gl-nav-fg-strong": neutral[950],
        "--gl-nav-bg-hover": neutral[100],
        "--gl-nav-bg-active": neutral[200],
        "--gl-nav-indicator": orange[5],
      }
    : {
        "--gl-segment-selected-bg": neutral[300],
        "--gl-segment-selected-fg": neutral[900],
        "--gl-segment-selected-bd": "transparent",
        "--gl-toggle-bg": neutral[700],
        "--gl-toggle-checked-bg": blue[3],
        "--gl-toggle-thumb": neutral[50],
        "--gl-alert-info-bg": blue[10],
        "--gl-alert-success-bg": green[9],
        "--gl-alert-warning-bg": orange[9],
        "--gl-alert-danger-bg": red[9],
        "--gl-alert-neutral-bg": neutral[900],
        "--gl-alert-brand-bg": purple[10],
        "--gl-alert-info-accent": blue[3],
        "--gl-alert-success-accent": green[3],
        "--gl-alert-warning-accent": orange[3],
        "--gl-alert-danger-accent": red[3],
        "--gl-alert-neutral-accent": neutral[200],
        "--gl-alert-brand-accent": purple[3],
        "--gl-tooltip-bg": neutral[800],
        "--gl-tooltip-fg": neutral[0],
        "--gl-progress-track": neutral[700],
        "--gl-progress-indicator": blue[3],
        "--gl-skeleton-bg": neutral[800],
        "--gl-loader-color": neutral[100],
        "--gl-pagination-active-bg": neutral[50],
        "--gl-pagination-active-fg": neutral[950],
        "--gl-breadcrumb-separator": neutral[400],
        "--gl-avatar-border": alpha.light8,
        "--gl-nav-active": neutral[700],
        "--gl-nav-fg": neutral[200],
        "--gl-nav-fg-strong": neutral[0],
        "--gl-nav-bg-hover": neutral[800],
        "--gl-nav-bg-active": neutral[950],
        "--gl-nav-indicator": orange[3],
      };

export const cssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {},
  light: {
    "--gl-bg-canvas": neutral[10],
    "--gl-chrome-bg": neutral[50],
    "--gl-main-bg": neutral[0],
    "--mantine-color-body": neutral[0],
    "--gl-text-heading": neutral[950],
    "--gl-action-hover": alpha.dark6,
    "--gl-action-active": alpha.dark16,
    "--gl-focus-inner": neutral[0],
    "--gl-focus-outer": blue[5],
    "--gl-tab-fg": neutral[900],
    "--gl-tab-indicator": neutral[1000],
    "--gl-tab-hover-indicator": neutral[200],
    "--gl-shadow-color": alpha.dark16,
    "--gl-control-border": neutral[400],
    "--gl-control-border-focus": neutral[900],
    "--gl-button-bg": neutral[0],
    "--gl-button-hover": neutral[50],
    "--gl-button-active": neutral[100],
    "--gl-button-fg": neutral[800],
    "--gl-button-border": neutral[200],
    "--gl-confirm-bg": neutral[800],
    "--gl-confirm-hover": neutral[950],
    "--gl-confirm-active": neutral[1000],
    "--gl-confirm-fg": neutral[0],
    "--gl-danger-bg": red[6],
    "--gl-danger-hover": red[7],
    "--gl-danger-active": red[9],
    "--gl-danger-fg": neutral[0],
    "--gl-danger-bd": red[7],
    ...badgeVariables("light"),
    ...controlVariables("light"),
    "--mantine-color-anchor": blue[7],
    "--mantine-color-error": red[6],
    "--mantine-color-success": green[6],
    "--mantine-color-placeholder": neutral[400],
    "--mantine-color-dimmed": neutral[600],
    "--mantine-color-default": neutral[0],
    "--mantine-color-default-hover": neutral[50],
    "--mantine-color-default-color": neutral[800],
    "--mantine-color-default-border": neutral[100],
    "--mantine-color-disabled": neutral[50],
    "--mantine-color-disabled-color": neutral[400],
    "--mantine-color-disabled-border": neutral[100],
  },
  dark: {
    "--gl-bg-canvas": neutral[950],
    "--gl-chrome-bg": neutral[1000],
    "--gl-main-bg": neutral[950],
    "--mantine-color-body": neutral[900],
    "--gl-text-heading": neutral[0],
    "--gl-action-hover": alpha.light16,
    "--gl-action-active": alpha.light8,
    "--gl-focus-inner": neutral[950],
    "--gl-focus-outer": blue[4],
    "--gl-tab-fg": neutral[50],
    "--gl-tab-indicator": neutral[0],
    "--gl-tab-hover-indicator": neutral[600],
    "--gl-shadow-color": alpha.dark40,
    "--gl-control-border": neutral[500],
    "--gl-control-border-focus": neutral[50],
    "--gl-button-bg": "hsla(252, 2%, 54%, 0.4)",
    "--gl-button-hover": "hsla(252, 2%, 54%, 0.64)",
    "--gl-button-active": "hsla(252, 2%, 54%, 0.32)",
    "--gl-button-fg": neutral[50],
    "--gl-button-border": "transparent",
    "--gl-confirm-bg": neutral[50],
    "--gl-confirm-hover": neutral[10],
    "--gl-confirm-active": neutral[100],
    "--gl-confirm-fg": neutral[950],
    "--gl-danger-bg": red[4],
    "--gl-danger-hover": red[3],
    "--gl-danger-active": red[2],
    "--gl-danger-fg": neutral[950],
    "--gl-danger-bd": "transparent",
    ...badgeVariables("dark"),
    ...controlVariables("dark"),
    "--mantine-color-anchor": blue[2],
    "--mantine-color-error": red[3],
    "--mantine-color-success": green[3],
    "--mantine-color-placeholder": neutral[400],
    "--mantine-color-dimmed": neutral[200],
    "--mantine-color-default": neutral[900],
    "--mantine-color-default-hover": alpha.light16,
    "--mantine-color-default-color": neutral[50],
    "--mantine-color-default-border": neutral[700],
    "--mantine-color-disabled": neutral[900],
    "--mantine-color-disabled-color": neutral[500],
    "--mantine-color-disabled-border": neutral[800],
  },
});

const heading = {
  fontWeight: "600",
} as const;

const overlaySurface = {
  header: {
    minHeight: rem(48),
    borderBottom: `${rem(1)} solid var(--mantine-color-default-border)`,
    backgroundColor: "var(--gl-main-bg)",
  },
  title: {
    color: "var(--gl-text-heading)",
    fontSize: rem(16),
    fontWeight: 600,
    lineHeight: 1.25,
  },
  body: {
    paddingTop: rem(16),
  },
  content: {
    backgroundColor: "var(--gl-main-bg)",
  },
} as const;

const choiceLabel = {
  color: "var(--mantine-color-text)",
  fontSize: rem(14),
  fontWeight: 400,
  lineHeight: rem(16),
} as const;

export const theme = createTheme({
  primaryColor: "blue",
  primaryShade: { light: 5, dark: 5 },
  white: neutral[0],
  black: neutral[800],
  fontFamily: sansFamily,
  fontFamilyMonospace: monoFamily,
  fontSizes: {
    xs: rem(12),
    sm: rem(13),
    md: rem(14),
    lg: rem(16),
    xl: rem(18),
  },
  lineHeights: {
    xs: "1.35",
    sm: "1.4",
    md: "1.43",
    lg: "1.5",
    xl: "1.4",
  },
  fontWeights: {
    regular: "400",
    medium: "600",
    bold: "600",
  },
  headings: {
    fontFamily: sansFamily,
    fontWeight: "600",
    sizes: {
      h1: { fontSize: rem(24), lineHeight: "1.25", ...heading },
      h2: { fontSize: rem(21), lineHeight: "1.25", ...heading },
      h3: { fontSize: rem(18), lineHeight: "1.35", ...heading },
      h4: { fontSize: rem(16), lineHeight: "1.4", ...heading },
      h5: { fontSize: rem(14), lineHeight: "1.45", ...heading },
      h6: { fontSize: rem(13), lineHeight: "1.45", ...heading },
    },
  },
  radius: {
    none: "0",
    xs: "1px",
    sm: rem(2),
    md: rem(4),
    lg: rem(8),
    xl: rem(12),
    "2xl": rem(16),
    "3xl": rem(24),
    full: "9999px",
  },
  defaultRadius: "lg",
  spacing: {
    xs: rem(8),
    sm: rem(12),
    md: rem(16),
    lg: rem(24),
    xl: rem(32),
  },
  shadows: {
    xs: shadow.sm,
    sm: shadow.sm,
    md: shadow.md,
    lg: shadow.lg,
    xl: shadow.lg,
  },
  colors: {
    blue,
    green,
    orange,
    red,
    violet: purple,
    gray,
    dark,
  },
  other: {
    neutral0: neutral[0],
    neutral10: neutral[10],
    neutral950: neutral[950],
    neutral1000: neutral[1000],
  },
  activeClassName: classes.active,
  cursorType: "pointer",
  variantColorResolver,
  components: {
    Title: Title.extend({
      styles: {
        root: {
          color: "var(--gl-text-heading)",
          letterSpacing: "-0.01em",
        },
      },
    }),
    Button: Button.extend({
      defaultProps: {
        variant: "default",
      },
      styles: {
        root: {
          fontWeight: 400,
        },
      },
      vars: (theme, props) => {
        const metrics = controlMetrics(props.size);
        const variant = props.variant ?? "default";
        const primary = props.color === undefined || props.color === "blue";
        const border = `${rem(1)} solid`;

        if (variant === "filled" && primary) {
          return {
            root: {
              "--button-height": metrics.height,
              "--button-padding-x": metrics.paddingX,
              "--button-fz": metrics.fontSize,
              "--button-bg": "var(--gl-confirm-bg)",
              "--button-hover": "var(--gl-confirm-hover)",
              "--button-color": "var(--gl-confirm-fg)",
              "--button-hover-color": "var(--gl-confirm-fg)",
              "--button-bd": `${border} transparent`,
              "--button-active": "var(--gl-confirm-active)",
            },
          };
        }

        if (variant === "filled" && props.color === "red") {
          return {
            root: {
              "--button-height": metrics.height,
              "--button-padding-x": metrics.paddingX,
              "--button-fz": metrics.fontSize,
              "--button-bg": "var(--gl-danger-bg)",
              "--button-hover": "var(--gl-danger-hover)",
              "--button-color": "var(--gl-danger-fg)",
              "--button-hover-color": "var(--gl-danger-fg)",
              "--button-bd": `${border} var(--gl-danger-bd)`,
              "--button-active": "var(--gl-danger-active)",
            },
          };
        }

        if (variant === "default") {
          return {
            root: {
              "--button-height": metrics.height,
              "--button-padding-x": metrics.paddingX,
              "--button-fz": metrics.fontSize,
              "--button-bg": "var(--gl-button-bg)",
              "--button-hover": "var(--gl-button-hover)",
              "--button-color": "var(--gl-button-fg)",
              "--button-hover-color": "var(--gl-button-fg)",
              "--button-bd": `${border} var(--gl-button-border)`,
              "--button-active": "var(--gl-button-active)",
            },
          };
        }

        const active =
          variant === "filled"
            ? filledActiveColor(theme, props.color)
            : variant === "subtle"
              ? "var(--gl-action-active)"
              : undefined;

        return {
          root: {
            "--button-height": metrics.height,
            "--button-padding-x": metrics.paddingX,
            "--button-fz": metrics.fontSize,
            ...(active ? { "--button-active": active } : {}),
          },
        };
      },
    }),
    Input: Input.extend({
      classNames: {
        input: classes.input,
      },
      styles: {
        input: {
          "--input-bd": "var(--gl-control-border)",
        },
      },
      vars: (_theme, props) => {
        const metrics = controlMetrics(props.size);

        return {
          wrapper: {
            "--input-height": metrics.height,
            "--input-fz": metrics.fontSize,
          },
        };
      },
    }),
    Badge: Badge.extend({
      defaultProps: {
        variant: "light",
        radius: "full",
      },
      styles: {
        root: {
          fontWeight: 400,
          height: "auto",
          letterSpacing: "normal",
          lineHeight: rem(16),
          padding: `${rem(2)} ${rem(6)}`,
          textTransform: "none",
        },
      },
      vars: (_theme, props) => {
        const tone = badgeTone(props.color);
        const pastel = (props.variant ?? "light") === "light";

        return {
          root: {
            "--badge-fz": rem(12),
            ...(pastel
              ? {
                  "--badge-bg": `var(--gl-badge-${tone}-bg)`,
                  "--badge-color": `var(--gl-badge-${tone}-fg)`,
                }
              : {}),
          },
        };
      },
    }),
    Checkbox: Checkbox.extend({
      defaultProps: {
        size: "xs",
        radius: "md",
      },
      classNames: {
        input: classes["choice-input"],
      },
      styles: {
        root: {
          "--label-offset-start": rem(8),
          "--label-lh": rem(16),
        },
        label: choiceLabel,
      },
    }),
    Radio: Radio.extend({
      defaultProps: {
        size: "xs",
      },
      classNames: {
        radio: classes["choice-input"],
      },
      styles: {
        root: {
          "--label-offset-start": rem(8),
          "--label-lh": rem(16),
        },
        label: choiceLabel,
      },
    }),
    Divider: Divider.extend({
      styles: {
        root: {
          "--divider-color": "var(--mantine-color-default-border)",
        },
      },
    }),
    Table: Table.extend({
      styles: {
        table: {
          "--table-border-color": "var(--mantine-color-default-border)",
          "--table-hover-color": "var(--gl-action-hover)",
          fontSize: "var(--mantine-font-size-md)",
        },
        th: {
          color: "var(--gl-text-heading)",
          fontWeight: 600,
        },
      },
    }),
    Popover: Popover.extend({
      defaultProps: {
        shadow: "md",
      },
      styles: {
        dropdown: {
          "--popover-border-color": "var(--mantine-color-default-border)",
        },
      },
    }),
    Menu: Menu.extend({
      defaultProps: {
        shadow: "md",
        radius: "lg",
      },
      styles: {
        item: {
          "--menu-item-hover": "var(--gl-action-hover)",
          borderRadius: "var(--mantine-radius-md)",
          fontSize: rem(14),
          fontWeight: 400,
          padding: `${rem(8)} ${rem(8)}`,
        },
        label: {
          fontSize: rem(12),
          fontWeight: 600,
        },
        dropdown: {
          backgroundColor: "var(--gl-main-bg)",
        },
      },
    }),
    AppShell: AppShell.extend({
      styles: {
        root: {
          "--app-shell-border-color": "var(--mantine-color-default-border)",
        },
        header: {
          backgroundColor: "var(--gl-chrome-bg)",
        },
        navbar: {
          backgroundColor: "var(--gl-chrome-bg)",
        },
        main: {
          backgroundColor: "var(--gl-main-bg)",
        },
      },
    }),
    Tabs: Tabs.extend({
      classNames: {
        list: classes["tab-list"],
        tab: classes.tab,
      },
    }),
    Paper: Paper.extend({
      defaultProps: {
        radius: "xl",
      },
      styles: {
        root: {
          "--paper-border-color": "var(--mantine-color-default-border)",
        },
      },
    }),
    Card: Card.extend({
      defaultProps: {
        radius: "xl",
        withBorder: true,
      },
    }),
    Modal: Modal.extend({
      defaultProps: {
        radius: "2xl",
        shadow: "lg",
        overlayProps: {
          backgroundOpacity: 0.24,
          color: "#050406",
        },
      },
      styles: overlaySurface,
    }),
    Drawer: Drawer.extend({
      defaultProps: {
        shadow: "lg",
        overlayProps: {
          backgroundOpacity: 0.24,
          color: "#050406",
        },
      },
      styles: overlaySurface,
    }),
    Combobox: Combobox.extend({
      classNames: {
        option: classes["combobox-option"],
      },
      styles: {
        option: {
          padding: `${rem(8)} ${rem(8)}`,
        },
      },
    }),
    ComboboxPopover: ComboboxPopover.extend({
      classNames: {
        option: classes["combobox-option"],
      },
      styles: {
        option: {
          padding: `${rem(8)} ${rem(8)}`,
        },
      },
    }),
    Anchor: Anchor.extend({
      defaultProps: {
        underline: "hover",
      },
    }),
    Burger: Burger.extend({
      defaultProps: {
        size: "sm",
      },
      styles: {
        root: {
          "--burger-color": "var(--gl-button-fg)",
        },
      },
    }),
    CloseButton: CloseButton.extend({
      defaultProps: {
        size: "sm",
        radius: "md",
      },
      classNames: {
        root: classes["close-button"],
      },
      styles: {
        root: {
          color: "var(--gl-button-fg)",
        },
      },
    }),
    SegmentedControl: SegmentedControl.extend({
      classNames: {
        root: classes.segmented,
        control: classes["segmented-control"],
        indicator: classes["segmented-indicator"],
        input: classes["segmented-input"],
        label: classes["segmented-label"],
      },
    }),
    Switch: Switch.extend({
      defaultProps: {
        size: "sm",
      },
      classNames: {
        track: classes["switch-track"],
      },
      styles: {
        track: {
          "--switch-height": rem(20),
          "--switch-width": rem(36),
          "--switch-thumb-size": rem(16),
          "--switch-track-label-padding": rem(2),
        },
      },
    }),
    Alert: Alert.extend({
      defaultProps: {
        radius: "lg",
        variant: "light",
      },
      classNames: {
        root: classes.alert,
      },
      vars: (_theme, props) => {
        const tone = badgeTone(props.color);

        return {
          root: {
            "--alert-bg": `var(--gl-alert-${tone}-bg)`,
            "--alert-color": "var(--mantine-color-text)",
            "--alert-bd": `${rem(1)} solid transparent`,
            "--alert-radius": "var(--mantine-radius-lg)",
          },
        };
      },
      styles: (_theme, props) => ({
        root: {
          "--gl-alert-accent": `var(--gl-alert-${badgeTone(props.color)}-accent)`,
        },
        title: {
          color: "var(--gl-text-heading)",
          fontSize: rem(16),
          fontWeight: 600,
        },
        message: {
          color: "var(--mantine-color-text)",
          fontSize: rem(14),
        },
      }),
    }),
    Pagination: Pagination.extend({
      classNames: {
        control: classes["pagination-control"],
      },
    }),
    Breadcrumbs: Breadcrumbs.extend({
      defaultProps: {
        separator: "/",
      },
      classNames: {
        root: classes.breadcrumbs,
        separator: classes["breadcrumb-separator"],
      },
    }),
    Tooltip: Tooltip.extend({
      defaultProps: {
        radius: "lg",
      },
      styles: {
        tooltip: {
          "--tooltip-bg": "var(--gl-tooltip-bg)",
          "--tooltip-color": "var(--gl-tooltip-fg)",
          fontSize: rem(13),
          fontWeight: 400,
          padding: `${rem(8)} ${rem(12)}`,
        },
      },
    }),
    Avatar: Avatar.extend({
      defaultProps: {
        size: 32,
        radius: "full",
      },
      styles: {
        placeholder: {
          border: `${rem(1)} solid var(--gl-avatar-border)`,
          fontWeight: 400,
        },
      },
    }),
    Progress: Progress.extend({
      defaultProps: {
        radius: "full",
        size: 8,
      },
      styles: {
        root: {
          backgroundColor: "var(--gl-progress-track)",
        },
        section: {
          backgroundColor: "var(--gl-progress-indicator)",
        },
      },
    }),
    Skeleton: Skeleton.extend({
      classNames: {
        root: classes.skeleton,
      },
    }),
    Loader: Loader.extend({
      defaultProps: {
        size: "sm",
      },
      styles: {
        root: {
          "--loader-color": "var(--gl-loader-color)",
        },
      },
    }),
    Accordion: Accordion.extend({
      defaultProps: {
        chevronPosition: "left",
        chevronSize: 16,
        chevronIconSize: 16,
        variant: "default",
        // AccordionProps locks the multiple generic to false, so the theme slot cannot express true.
        multiple: true as unknown as AccordionProps["multiple"],
      },
      classNames: {
        item: classes["accordion-item"],
        itemTitle: classes["accordion-title"],
        control: classes["accordion-control"],
        label: classes["accordion-label"],
        chevron: classes["accordion-chevron"],
        content: classes["accordion-content"],
      },
    }),
    NavLink: NavLink.extend({
      classNames: {
        root: classes["nav-link"],
        section: classes["nav-section"],
        label: classes["nav-label"],
        children: classes["nav-children"],
      },
      styles: {
        root: {
          "--nl-bg": "var(--gl-nav-bg-hover)",
          "--nl-hover": "var(--gl-nav-bg-hover)",
          "--nl-color": "var(--gl-nav-fg-strong)",
        },
        label: {
          fontSize: "var(--mantine-font-size-md)",
          fontWeight: "inherit",
          lineHeight: rem(20),
        },
      },
    }),
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        variant: "default",
      },
      vars: (_theme, props) => {
        if ((props.variant ?? "default") !== "default") {
          return { root: {} };
        }

        return {
          root: {
            "--ai-size": rem(32),
            "--ai-bg": "var(--gl-button-bg)",
            "--ai-hover": "var(--gl-button-hover)",
            "--ai-color": "var(--gl-button-fg)",
            "--ai-hover-color": "var(--gl-button-fg)",
            "--ai-bd": `${rem(1)} solid var(--gl-button-border)`,
          },
        };
      },
    }),
  },
});
