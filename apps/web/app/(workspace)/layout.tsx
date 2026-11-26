"use client";

import type { ReactNode } from "react";

import { AppShell } from "@/modules/ui/components/app-shell";

export default function Layout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
