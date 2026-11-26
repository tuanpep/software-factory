"use client";

import { NavLink, Stack } from "@mantine/core";
import {
  IconAdjustments,
  IconChartBar,
  IconGitPullRequest,
  IconInbox,
  IconListDetails,
  IconPlayerPlay,
  IconScale,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import type { ComponentType } from "react";

const LINKS: {
  href: string;
  key:
    | "navReview"
    | "navInbox"
    | "navStart"
    | "navFollow"
    | "navDecisions"
    | "navRecord"
    | "navConfigure";
  icon: ComponentType<{ size?: number; stroke?: number }>;
  match: (pathname: string) => boolean;
}[] = [
  {
    href: "/",
    key: "navReview",
    icon: IconListDetails,
    match: (pathname) =>
      pathname === "/" ||
      (pathname.startsWith("/runs") && !pathname.startsWith("/runs/new")),
  },
  {
    href: "/inbox",
    key: "navInbox",
    icon: IconInbox,
    match: (pathname) => pathname.startsWith("/inbox"),
  },
  {
    href: "/runs/new",
    key: "navStart",
    icon: IconPlayerPlay,
    match: (pathname) => pathname.startsWith("/runs/new"),
  },
  {
    href: "/follow",
    key: "navFollow",
    icon: IconGitPullRequest,
    match: (pathname) => pathname.startsWith("/follow"),
  },
  {
    href: "/decisions",
    key: "navDecisions",
    icon: IconScale,
    match: (pathname) => pathname.startsWith("/decisions"),
  },
  {
    href: "/record",
    key: "navRecord",
    icon: IconChartBar,
    match: (pathname) => pathname.startsWith("/record"),
  },
  {
    href: "/configure/providers",
    key: "navConfigure",
    icon: IconAdjustments,
    match: (pathname) =>
      pathname.startsWith("/configure") ||
      pathname.startsWith("/providers") ||
      pathname.startsWith("/models") ||
      pathname.startsWith("/profiles"),
  },
];

export function AppNav({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("App");
  const pathname = usePathname();

  return (
    <Stack gap={4}>
      {LINKS.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.href}
            component={Link}
            href={link.href}
            label={t(link.key)}
            active={link.match(pathname)}
            aria-current={link.match(pathname) ? "page" : undefined}
            leftSection={<Icon size={18} stroke={1.5} />}
            onClick={onNavigate}
          />
        );
      })}
    </Stack>
  );
}
