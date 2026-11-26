import {
  Accordion,
  Avatar,
  Breadcrumbs,
  DataList,
  Divider,
  EmptyState,
  Indicator,
  Notification,
  Progress,
  RangeSlider,
  Rating,
  RingProgress,
  Skeleton,
  Slider,
  Stepper,
  Timeline,
  Tree,
} from "@mantine/core";

import classes from "./arco-extra-components.module.css";

export const arcoExtraComponents = {
  Accordion: Accordion.extend({
    classNames: {
      control: classes["accordion-control"],
      content: classes["accordion-content"],
    },
  }),
  Avatar: Avatar.extend({
    defaultProps: { size: 40, radius: "50%" },
    classNames: { placeholder: classes["avatar-placeholder"] },
  }),
  Breadcrumbs: Breadcrumbs.extend({
    classNames: { separator: classes["breadcrumb-separator"] },
  }),
  Divider: Divider.extend({
    classNames: { label: classes["divider-label"] },
    vars: (_theme, props) => ({
      root: props.color ? {} : { "--divider-color": "var(--arco-border)" },
    }),
  }),
  Slider: Slider.extend({
    defaultProps: { size: 2, thumbSize: 12 },
    classNames: { thumb: classes["slider-thumb"] },
  }),
  RangeSlider: RangeSlider.extend({
    defaultProps: { size: 2, thumbSize: 12 },
    classNames: { thumb: classes["slider-thumb"] },
  }),
  Stepper: Stepper.extend({
    defaultProps: { iconSize: 28 },
    classNames: { stepIcon: classes["step-icon"] },
  }),
  Timeline: Timeline.extend({
    defaultProps: { bulletSize: 6, lineWidth: 1 },
  }),
  DataList: DataList.extend({
    classNames: { itemLabel: classes["data-label"] },
  }),
  EmptyState: EmptyState.extend({
    classNames: { root: classes.empty },
  }),
  Indicator: Indicator.extend({
    classNames: { indicator: classes["indicator-label"] },
  }),
  Notification: Notification.extend({
    defaultProps: { radius: "sm" },
    classNames: {
      root: classes.notification,
      title: classes["notification-title"],
    },
  }),
  Progress: Progress.extend({
    defaultProps: { size: 4, radius: "xl" },
    classNames: { root: classes["progress-track"] },
  }),
  RingProgress: RingProgress.extend({
    defaultProps: { thickness: 4, roundCaps: true },
  }),
  Rating: Rating.extend({
    classNames: { starSymbol: classes.rating },
  }),
  Skeleton: Skeleton.extend({
    classNames: { root: classes.skeleton },
  }),
  Tree: Tree.extend({
    classNames: { label: classes["tree-label"] },
  }),
};
