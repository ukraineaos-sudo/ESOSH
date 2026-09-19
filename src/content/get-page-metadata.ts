import type { Metadata } from "next";
import { notFound } from "next/navigation";
import pages from "./page-metadata.json";

/** RU: SEO из локальных материалов. EN: Build metadata from captured page content. */
export function getPageMetadata(locale: string, route: string): Metadata {
  const path = locale === "en" ? "/en" + (route === "/" ? "" : route) : route;
  const page = (pages as Record<string, { title: string; description: string; image: string | null; alternates: Record<string,string> }>)[path];
  if (!page) notFound();
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://www.esosh.net";
  const languages = Object.fromEntries(Object.entries(page.alternates).filter(([, url]) => Object.hasOwn(pages, url)));
  return {
    metadataBase: new URL(origin), title: page.title, description: page.description,
    alternates: { canonical: path, languages },
    openGraph: { title: page.title, description: page.description, url: path, siteName: "ESOSH", locale: locale === "uk" ? "uk_UA" : "en_US", ...(page.image?.startsWith("/") ? { images: [page.image] } : {}) },
    icons: { icon: "/favicon/favicon-32.png" },
  };
}
