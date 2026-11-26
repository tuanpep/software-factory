import {
  ActionIcon,
  Alert,
  AppShell,
  Autocomplete,
  Badge,
  Button,
  Card,
  Cascader,
  Checkbox,
  Combobox,
  ComboboxChevron,
  Drawer,
  Input,
  Menu,
  Modal,
  MultiSelect,
  NavLink,
  Overlay,
  Pagination,
  Paper,
  Pill,
  Popover,
  Radio,
  SegmentedControl,
  Select,
  Switch,
  Table,
  Tabs,
  TagsInput,
  Tooltip,
  TreeSelect,
} from "@mantine/core";

import classes from "./arco-components.module.css";
import { arcoExtraComponents } from "./arco-extra-components";

const selectClassNames = {
  dropdown: classes["select-dropdown"],
  option: classes.option,
  empty: classes["select-empty"],
  groupLabel: classes["select-group-label"],
  input: classes["select-input"],
};

const selectDropdown = { radius: "sm", shadow: "md", offset: 4 };

export const arcoComponents = {
  ...arcoExtraComponents,
  Button: Button.extend({
    defaultProps: { size: "md" },
    classNames: { root: classes.button },
    vars: (_theme, props) => ({
      root:
        props.variant === "default" && !props.color
          ? {
              "--button-bg": "var(--arco-fill-2)",
              "--button-hover": "var(--arco-fill-3)",
              "--button-color": "var(--arco-text-secondary)",
              "--button-bd": "1px solid transparent",
            }
          : {},
    }),
  }),
  ActionIcon: ActionIcon.extend({
    defaultProps: { size: "md" },
    classNames: { root: classes["action-icon"] },
    vars: (_theme, props) => ({
      root:
        props.variant === "default" && !props.color
          ? {
              "--ai-bg": "var(--arco-fill-2)",
              "--ai-hover": "var(--arco-fill-3)",
              "--ai-color": "var(--arco-text-secondary)",
              "--ai-bd": "1px solid transparent",
            }
          : {},
    }),
  }),
  Input: Input.extend({
    defaultProps: { size: "md" },
    classNames: { wrapper: classes["input-wrapper"], input: classes.input },
  }),
  Checkbox: Checkbox.extend({
    defaultProps: { radius: "xs" },
    classNames: {
      root: classes.checkbox,
      body: classes["choice-body"],
      inner: classes["choice-inner"],
      input: classes.choice,
    },
  }),
  Radio: Radio.extend({
    classNames: {
      root: classes.radio,
      body: classes["choice-body"],
      inner: classes["choice-inner"],
      radio: classes.choice,
    },
  }),
  Switch: Switch.extend({
    classNames: { root: classes.switch, track: classes.track },
  }),
  SegmentedControl: SegmentedControl.extend({
    classNames: { root: classes.segmented, indicator: classes.surface },
  }),
  Combobox: Combobox.extend({
    defaultProps: selectDropdown,
    classNames: {
      dropdown: selectClassNames.dropdown,
      option: selectClassNames.option,
      empty: selectClassNames.empty,
      groupLabel: selectClassNames.groupLabel,
    },
  }),
  ComboboxChevron: ComboboxChevron.extend({
    classNames: { chevron: classes["select-chevron"] },
  }),
  Select: Select.extend({
    defaultProps: {
      size: "md",
      checkIconPosition: "right",
      maxDropdownHeight: 200,
    },
    classNames: selectClassNames,
  }),
  MultiSelect: MultiSelect.extend({
    defaultProps: {
      size: "md",
      checkIconPosition: "right",
      maxDropdownHeight: 200,
    },
    classNames: { ...selectClassNames, pill: classes["select-pill"] },
  }),
  Autocomplete: Autocomplete.extend({
    defaultProps: { size: "md", maxDropdownHeight: 200 },
    classNames: selectClassNames,
  }),
  TagsInput: TagsInput.extend({
    defaultProps: { size: "md", maxDropdownHeight: 200 },
    classNames: { ...selectClassNames, pill: classes["select-pill"] },
  }),
  Cascader: Cascader.extend({
    classNames: { ...selectClassNames, columnOption: classes.option },
  }),
  TreeSelect: TreeSelect.extend({
    classNames: { ...selectClassNames, pill: classes["select-pill"] },
  }),
  Pill: Pill.extend({
    defaultProps: { radius: "xs" },
  }),
  Menu: Menu.extend({
    classNames: { dropdown: classes.dropdown, item: classes["menu-item"] },
  }),
  Popover: Popover.extend({ classNames: { dropdown: classes.dropdown } }),
  Tooltip: Tooltip.extend({ classNames: { tooltip: classes.tooltip } }),
  Overlay: Overlay.extend({ classNames: { root: classes.overlay } }),
  Modal: Modal.extend({
    defaultProps: { radius: "sm", centered: true, size: 520 },
    classNames: { content: classes.surface, header: classes.surface },
  }),
  Drawer: Drawer.extend({
    defaultProps: { position: "right" },
    classNames: { content: classes.surface, header: classes.surface },
  }),
  Card: Card.extend({ classNames: { root: classes.surface } }),
  Paper: Paper.extend({ classNames: { root: classes.surface } }),
  AppShell: AppShell.extend({
    classNames: {
      header: classes["shell-section"],
      navbar: classes["shell-section"],
      aside: classes["shell-section"],
      footer: classes["shell-section"],
    },
  }),
  Table: Table.extend({
    defaultProps: {
      highlightOnHover: true,
      withTableBorder: true,
      horizontalSpacing: "md",
      verticalSpacing: 9,
    },
    classNames: { table: classes.table, thead: classes["table-head"] },
  }),
  Tabs: Tabs.extend({ classNames: { root: classes.tabs, tab: classes.tab } }),
  NavLink: NavLink.extend({ classNames: { root: classes["nav-link"] } }),
  Pagination: Pagination.extend({
    classNames: { control: classes["pagination-control"] },
    vars: (_theme, props) => ({
      root: props.color
        ? {}
        : {
            "--pagination-active-bg": "var(--mantine-primary-color-light)",
            "--pagination-active-color":
              "var(--mantine-primary-color-light-color)",
          },
    }),
  }),
  Alert: Alert.extend({ classNames: { title: classes["alert-title"] } }),
  Badge: Badge.extend({ classNames: { root: classes.badge } }),
};
