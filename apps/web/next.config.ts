import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

import "./app/env";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});
const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    optimizePackageImports: [
      "@mantine/core",
      "@mantine/form",
      "@mantine/hooks",
      "@tabler/icons-react",
      "@tanstack/react-query",
    ],
  },
  async redirects() {
    return [
      {
        source: "/providers",
        destination: "/configure/providers",
        permanent: false,
      },
      { source: "/models", destination: "/configure/models", permanent: false },
      {
        source: "/profiles",
        destination: "/configure/profiles",
        permanent: false,
      },
    ];
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
