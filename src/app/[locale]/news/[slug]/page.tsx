import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getPage } from "@/content/get-page";
import { getPageMetadata } from "@/content/get-page-metadata";
import pages from "@/content/page-metadata.json";
import { CmsNewsArticle } from "@/components/cms/CmsNewsArticle";
import { getCmsNews, getCmsNewsPresence } from "@/lib/cms/public";
import { pageLoaders } from "@/content/page-loaders";

/** RU: Статические legacy-пути + динамические CMS. EN: Legacy SSG + dynamic CMS params. */
export function generateStaticParams({ params }: { params: { locale: string } }) {
  const prefix = params.locale === "en" ? "/en/news/" : "/news/";
  return Object.keys(pages)
    .filter((path) => path.startsWith(prefix))
    .map((path) => ({ slug: path.slice(prefix.length) }));
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
  const presence = await getCmsNewsPresence(locale, slug);
  if (presence === "unpublished" && !preview) {
    return { title: "Not found" };
  }
  const cms = await getCmsNews(locale, slug, { preview });
  if (cms) {
    return { title: cms.title };
  }
  if (presence === "unpublished") {
    return { title: "Not found" };
  }
  return getPageMetadata(locale, `/news/${slug}`);
}

/** RU: Dual-read CMS → legacy TSX. EN: CMS news article or legacy page. */
export default async function Page({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  const query = await searchParams;
  const preview = query.preview === "1";
  setRequestLocale(locale);

  const presence = await getCmsNewsPresence(locale, slug);
  // CMS draft/deleted must not resurrect legacy TSX for the same slug.
  if (presence === "unpublished" && !preview) {
    notFound();
  }

  const cms = await getCmsNews(locale, slug, { preview });
  if (cms) {
    return <CmsNewsArticle post={cms} draftBanner={cms.status !== "published"} />;
  }

  if (presence === "unpublished") {
    notFound();
  }

  const path = locale === "en" ? `/en/news/${slug}` : `/news/${slug}`;
  if (!Object.prototype.hasOwnProperty.call(pageLoaders, path)) notFound();
  const Content = await getPage(locale, `/news/${slug}`);
  return <Content />;
}
