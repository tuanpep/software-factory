"use client";

import { Tooltip, VisuallyHidden } from "@mantine/core";
import {
  IconAlertTriangle,
  IconCheck,
  IconMinus,
  IconPlayerPlay,
  IconX,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import {
  pipelineStages,
  pipelineStatusState,
  type PipelineStageState,
} from "../domain/pipeline";
import type { FactoryRunStatus } from "../domain/types";

import classes from "./pipeline-graph.module.css";

function StageGlyph({ state }: { state: PipelineStageState }) {
  const size = 12;

  switch (state) {
    case "success":
      return <IconCheck size={size} stroke={2.5} />;
    case "failed":
      return <IconX size={size} stroke={2.5} />;
    case "warning":
      return <IconAlertTriangle size={size} stroke={2.5} />;
    case "canceled":
      return <IconMinus size={size} stroke={2.5} />;
    case "manual":
      return <IconPlayerPlay size={size} stroke={2.5} />;
    case "pending":
    case "skipped":
    case "running":
      return null;
  }
}

export function PipelineStatusIcon({ status }: { status: FactoryRunStatus }) {
  return (
    <span
      className={classes.node}
      data-state={pipelineStatusState(status)}
      aria-hidden
    >
      <StageGlyph state={pipelineStatusState(status)} />
    </span>
  );
}

export function PipelineGraph({
  status,
  variant = "mini",
}: {
  status: FactoryRunStatus;
  variant?: "mini" | "full";
}) {
  const t = useTranslations("Factory");
  const stages = pipelineStages(status);

  return (
    <ol
      className={classes.graph}
      data-variant={variant}
      aria-label={t("pipelineStagesLabel")}
    >
      {stages.map((stage, index) => {
        const previous = stages[index - 1];
        const name = t(`stage.${stage.id}`);
        const stateLabel = t(`stageState.${stage.state}`);
        const label = `${name}: ${stateLabel}`;

        return (
          <li key={stage.id} className={classes.stage}>
            <div className={classes.track}>
              {index > 0 ? (
                <span
                  className={classes.connector}
                  data-complete={previous?.state === "success"}
                  aria-hidden
                />
              ) : null}
              <StageNode label={label} state={stage.state}>
                <StageGlyph state={stage.state} />
              </StageNode>
            </div>
            {variant === "full" ? (
              <span className={classes.stageName}>{name}</span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function StageNode({
  label,
  state,
  children,
}: {
  label: string;
  state: PipelineStageState;
  children: ReactNode;
}) {
  return (
    <Tooltip label={label} withArrow openDelay={300}>
      <span className={classes.node} data-state={state}>
        {children}
        <VisuallyHidden>{label}</VisuallyHidden>
      </span>
    </Tooltip>
  );
}
