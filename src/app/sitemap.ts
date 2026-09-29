import type { MetadataRoute } from "next";
import pages from "@/content/page-metadata.json";
import { listPublishedCmsNewsPaths } from "@/lib/cms/public";
import { routing } from "@/i18n/routing";
import { hasLegacyPageContent, localizedPath, stripLocalePrefix } from "@/lib/locale";

type PageMeta = { alternates: Record<string, string>; locale?: string };

/** RU: Карта страниц + CMS-новости + слоты новых локалей. EN: Sitemap with pending-locale URL slots. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://www.esosh.net";
  const inventory = pages as Record<string, PageMeta>;

  const legacy = Object.entries(inventory).map(([path, page]) => {
    const route = stripLocalePrefix(path);
    const languages: Record<string, string> = {};
    for (const locale of routing.locales) {
      const href = localizedPath(locale, route);
      if (hasLegacyPageContent(locale)) {
        if (Object.hasOwn(inventory, href)) languages[locale] = new URL(href, origin).href;
      } else if (
        Object.hasOwn(inventory, localizedPath("uk", route)) ||
        Object.hasOwn(inventory, localizedPath("en", route))
      ) {
        languages[locale] = new URL(href, origin).href;
      }
    }
    // Keep inventoried alternates that still exist
    for (const [lang, href] of Object.entries(page.alternates)) {
      if (Object.hasOwn(inventory, href) && !languages[lang]) {
        languages[lang] = new URL(href, origin).href;
      }
    }
    return {
      url: new URL(path, origin).href,
      alternates: { languages },
    };
  });

  const seen = new Set(legacy.map((item) => item.url));
  const pendingSlots: MetadataRoute.Sitemap = [];
  const ukPaths = Object.keys(inventory).filter((path) => !path.startsWith("/en"));
  for (const ukPath of ukPaths) {
    const route = stripLocalePrefix(ukPath);
    for (const locale of routing.locales) {
      if (hasLegacyPageContent(locale)) continue;
      const path = localizedPath(locale, route);
      const url = new URL(path, origin).href;
      if (seen.has(url)) continue;
      seen.add(url);
      const languages: Record<string, string> = {};
      for (const loc of routing.locales) {
        const href = localizedPath(loc, route);
        if (hasLegacyPageContent(loc) && !Object.hasOwn(inventory, href)) continue;
        if (
          !hasLegacyPageContent(loc) ||
          Object.hasOwn(inventory, href)
        ) {
          languages[loc] = new URL(href, origin).href;
        }
      }
      pendingSlots.push({ url, alternates: { languages } });
    }
  }

  const cmsPaths = await listPublishedCmsNewsPaths();
  const cms = cmsPaths
    .map((path) => ({ url: new URL(path, origin).href }))
    .filter((item) => !seen.has(item.url));
  return [...legacy, ...pendingSlots, ...cms];
}
