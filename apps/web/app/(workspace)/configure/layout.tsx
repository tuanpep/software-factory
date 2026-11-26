"use client";

import type { ReactNode } from "react";

import { ConfigureNav } from "@/modules/factory/features/configure/ui/configure-nav";

export default function Layout({ children }: { children: ReactNode }) {
  return <ConfigureNav>{children}</ConfigureNav>;
}
