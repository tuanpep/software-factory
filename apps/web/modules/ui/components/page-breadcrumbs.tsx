"use client";

import { Breadcrumbs } from "@mantine/core";
import Link from "next/link";

export function PageBreadcrumbs({
  items,
}: {
  items: { href: string; label: string }[];
}) {
  return (
    <Breadcrumbs>
      {items.map((item, index) => {
        const current = index === items.length - 1;
        return (
          <Link
            key={`${item.href}-${item.label}`}
            href={item.href}
            aria-current={current ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
