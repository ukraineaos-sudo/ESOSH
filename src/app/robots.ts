import type { MetadataRoute } from "next";
/** RU: Правила индексации. EN: Search crawler rules. */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: new URL("/sitemap.xml", process.env.NEXT_PUBLIC_SITE_URL || "https://www.esosh.net").href };
}
