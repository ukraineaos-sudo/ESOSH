import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getPage } from "@/content/get-page";
import { getPageMetadata } from "@/content/get-page-metadata";
import pages from "@/content/page-metadata.json";
import { CmsNewsArticle } from "@/components/cms/CmsNewsArticle";
import { getCmsNews, getCmsNewsPresence, NEWS_CONTENT_LOCALE } from "@/lib/cms/public";
import { pageLoaders } from "@/content/page-loaders";

/** RU: Статические legacy-пути + динамические CMS. EN: Legacy SSG + dynamic CMS params. */
export function generateStaticParams() {
  const slugs = new Set<string>();
  for (const path of Object.keys(pages)) {
    const marker = "/news/";
    const idx = path.lastIndexOf(marker);
    if (idx === -1) continue;
    const slug = path.slice(idx + marker.length);
    if (slug) slugs.add(slug);
  }
  return [...slugs].map((slug) => ({ slug }));
}

export const dynamicParams = true;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ preview?: string }>;
};

/** RU: Метаданные страницы. EN: Local page metadata. */
export async function generateMetadata({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  const query = await searchParams;
  const preview = query.preview === "1";

  // Admin preview of a non-uk draft row (rare).
  if (preview) {
    const previewDoc = await getCmsNews(locale, slug, { preview: true });
    if (previewDoc) return { title: previewDoc.title };
  }

  const presence = await getCmsNewsPresence(NEWS_CONTENT_LOCALE, slug);
  if (presence === "unpublished" && !preview) {
    return { title: "Not found" };
  }
  const cms = await getCmsNews(NEWS_CONTENT_LOCALE, slug, { preview });
  if (cms) {
    return { title: cms.title };
  }
  if (presence === "unpublished") {
    return { title: "Not found" };
  }
  return getPageMetadata(NEWS_CONTENT_LOCALE, `/news/${slug}`);
}

/**
 * RU: Публічна стаття — контент завжди uk CMS/legacy; chrome локалі з layout.
 * EN: Article body always Ukrainian CMS/legacy; avoid empty pending for other locales.
 */
export default async function Page({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  const query = await searchParams;
  const preview = query.preview === "1";
  setRequestLocale(locale);

  if (preview) {
    const previewDoc = await getCmsNews(locale, slug, { preview: true });
    if (previewDoc) {
      return (
        <CmsNewsArticle
          post={previewDoc}
          uiLocale={locale}
          draftBanner={previewDoc.status !== "published"}
        />
      );
    }
  }

  const presence = await getCmsNewsPresence(NEWS_CONTENT_LOCALE, slug);
  // CMS draft/deleted must not resurrect legacy TSX for the same slug.
  if (presence === "unpublished" && !preview) {
    notFound();
  }

  const cms = await getCmsNews(NEWS_CONTENT_LOCALE, slug, { preview });
  if (cms) {
    return (
      <CmsNewsArticle
        post={cms}
        uiLocale={locale}
        draftBanner={cms.status !== "published"}
      />
    );
  }

  if (presence === "unpublished") {
    notFound();
  }

  const ukPath = `/news/${slug}`;
  if (!Object.prototype.hasOwnProperty.call(pageLoaders, ukPath)) notFound();
  const Content = await getPage(NEWS_CONTENT_LOCALE, `/news/${slug}`);
  return <Content />;
}
