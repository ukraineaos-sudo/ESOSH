import type { MetadataRoute } from "next";
import pages from "@/content/page-metadata.json";
import { listPublishedCmsNewsPaths } from "@/lib/cms/public";

/** RU: Карта страниц + CMS-новости. EN: Sitemap of migrated pages plus CMS news. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://www.esosh.net";
  const legacy = Object.entries(pages).map(([path, page]) => ({
    url: new URL(path, origin).href,
    alternates: {
      languages: Object.fromEntries(
        Object.entries(page.alternates)
          .filter(([, href]) => Object.hasOwn(pages, href))
          .map(([lang, href]) => [lang, new URL(href, origin).href]),
      ),
    },
  }));
  const cmsPaths = await listPublishedCmsNewsPaths();
  const legacyUrls = new Set(legacy.map((item) => item.url));
  const cms = cmsPaths
    .map((path) => ({ url: new URL(path, origin).href }))
    .filter((item) => !legacyUrls.has(item.url));
  return [...legacy, ...cms];
}
