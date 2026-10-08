import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // pdf-lib + fontkit use Node font engine; keep them external for serverless routes
  // exceljs pulls Node fs/stream helpers — keep external for admin export route
  serverExternalPackages: ["pdf-lib", "@pdf-lib/fontkit", "exceljs"],
  // Prevent Next from auto-writing AI rule files into the repo
  agentRules: false,
};

export default withNextIntl(nextConfig);
