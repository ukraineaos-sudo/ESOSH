import { setRequestLocale } from "next-intl/server";
import { getPage } from "@/content/get-page";
import { getPageMetadata } from "@/content/get-page-metadata";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ preview?: string }>;
};

/** RU: Рендер локальной страницы с optional CMS preview. EN: Render locale page with optional CMS preview. */
export async function renderLocalizedPage(
  route: string,
  { params, searchParams }: Props,
) {
  const { locale } = await params;
  const query = await searchParams;
  setRequestLocale(locale);
  const Content = await getPage(locale, route, { preview: query.preview === "1" });
  return <Content />;
}

/** RU: Metadata helper. EN: Metadata helper for locale pages. */
export async function metadataForRoute(
  route: string,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  return getPageMetadata(locale, route);
}
