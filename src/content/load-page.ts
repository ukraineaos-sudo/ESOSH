import { createElement, type ComponentType } from "react";
import { notFound } from "next/navigation";
import { CmsPageShell } from "@/components/cms/CmsPageShell";
import { ContentTranslationPending } from "@/components/content/ContentTranslationPending";
import { pageLoaders } from "./page-loaders";
import { getCmsPage } from "@/lib/cms/public";
import {
  hasLegacyPageContent,
  isAppLocale,
  localizedPath,
  type AppLocale,
} from "@/lib/locale";

/** RU: Dual-read: CMS → legacy TSX → честный pending для новых локалей. EN: CMS → legacy → pending for new locales. */
export async function getPage(
  locale: string,
  route: string,
  opts?: { preview?: boolean },
): Promise<ComponentType> {
  const cms = await getCmsPage(locale, route, { preview: opts?.preview });
  if (cms) {
    const draftBanner = cms.status !== "published";
    const title = cms.title;
    const blocks = cms.blocks;
    return function CmsContent() {
      return createElement(CmsPageShell, { title, blocks, draftBanner });
    };
  }

  const path = localizedPath(locale, route);
  if (Object.prototype.hasOwnProperty.call(pageLoaders, path)) {
    return (await pageLoaders[path as keyof typeof pageLoaders]()).default;
  }

  // New locales: do not serve uk/en body under a different lang attribute.
  if (isAppLocale(locale) && !hasLegacyPageContent(locale)) {
    const ukPath = localizedPath("uk", route);
    const enPath = localizedPath("en", route);
    const hasSibling =
      Object.prototype.hasOwnProperty.call(pageLoaders, ukPath) ||
      Object.prototype.hasOwnProperty.call(pageLoaders, enPath);
    if (hasSibling) {
      const appLocale = locale as AppLocale;
      return function PendingContent() {
        return createElement(ContentTranslationPending, {
          locale: appLocale,
          route,
        });
      };
    }
  }

  notFound();
}
