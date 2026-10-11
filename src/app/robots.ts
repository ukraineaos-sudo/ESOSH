import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { shouldBlockSearchIndexing } from "@/lib/seo-host";

/** RU: Правила індексації (на *.vercel.app — повна заборона). EN: robots.txt; block all on Vercel default host. */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  if (shouldBlockSearchIndexing(host)) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  const sitemapBase = process.env.NEXT_PUBLIC_SITE_URL || "https://www.esosh.net";
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: new URL("/sitemap.xml", sitemapBase).href,
  };
}
