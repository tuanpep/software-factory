import "@mantine/core/styles.css";
import "@/pajamas.module.css";

import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Suspense, type ReactNode } from "react";

import { fontClassName } from "@/lib/fonts";

import { AppProviders } from "./providers";

export const metadata: Metadata = {
  title: { default: "Software Factory", template: "%s | Software Factory" },
  description: "Review Software Factory runs and verification evidence.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <LocalizedDocument>{children}</LocalizedDocument>
    </Suspense>
  );
}

async function LocalizedDocument({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} {...mantineHtmlProps} className={fontClassName}>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppProviders>{children}</AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
