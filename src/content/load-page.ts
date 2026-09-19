import { createElement, type ComponentType } from "react";
import { notFound } from "next/navigation";
import { CmsPageShell } from "@/components/cms/CmsPageShell";
import { pageLoaders } from "./page-loaders";
import { getCmsPage } from "@/lib/cms/public";

/** RU: Dual-read: CMS published/preview → иначе legacy TSX. EN: CMS first, then legacy loader. */
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

  const path = locale === "en" ? "/en" + (route === "/" ? "" : route) : route;
  if (!Object.prototype.hasOwnProperty.call(pageLoaders, path)) notFound();
  return (await pageLoaders[path as keyof typeof pageLoaders]()).default;
}
