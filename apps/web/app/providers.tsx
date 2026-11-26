"use client";

import { MantineProvider } from "@mantine/core";
import NextTopLoader from "nextjs-toploader";
import type { ReactNode } from "react";

import {
  arcoCssVariablesResolver,
  arcoTheme,
} from "@/modules/ui/theme/arco-theme";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <MantineProvider
      theme={arcoTheme}
      cssVariablesResolver={arcoCssVariablesResolver}
      defaultColorScheme="light"
    >
      <NextTopLoader
        color="var(--mantine-primary-color-filled)"
        height={2}
        shadow={false}
        showSpinner={false}
        showForHashAnchor={false}
      />
      {children}
    </MantineProvider>
  );
}
