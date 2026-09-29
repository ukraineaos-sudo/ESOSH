import type { Metadata } from "next";
import { notFound } from "next/navigation";
import pages from "./page-metadata.json";
import { routing } from "@/i18n/routing";
import {
  hasLegacyPageContent,
  isAppLocale,
  LOCALE_OG_TAGS,
  localizedPath,
  type AppLocale,
} from "@/lib/locale";

type PageMeta = {
  title: string;
  description: string;
  image: string | null;
  alternates: Record<string, string>;
};

function buildLanguageAlternates(route: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    const href = localizedPath(locale, route);
    // uk/en: only if inventoried; new locales always expose the pending slot URL
    if (hasLegacyPageContent(locale)) {
      if (Object.hasOwn(pages, href)) languages[locale] = href;
    } else {
      const ukHref = localizedPath("uk", route);
      if (Object.hasOwn(pages, ukHref) || Object.hasOwn(pages, localizedPath("en", route))) {
        languages[locale] = href;
      }
    }
  }
  return languages;
}

/** RU: SEO из локальных материалов (+ pending для новых локалей). EN: Metadata from inventory or pending stub. */
export function getPageMetadata(locale: string, route: string): Metadata {
  const path = localizedPath(locale, route);
  const inventory = pages as Record<string, PageMeta>;
  const page = inventory[path];
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://www.esosh.net";
  const languages = buildLanguageAlternates(route);

  if (page) {
    return {
      metadataBase: new URL(origin),
      title: page.title,
      description: page.description,
      alternates: { canonical: path, languages },
      openGraph: {
        title: page.title,
        description: page.description,
        url: path,
        siteName: "ESOSH",
        locale: isAppLocale(locale) ? LOCALE_OG_TAGS[locale] : LOCALE_OG_TAGS.uk,
        ...(page.image?.startsWith("/") ? { images: [page.image] } : {}),
      },
      icons: { icon: "/favicon/favicon-32.png" },
    };
  }

  // Pending locales: metadata without pretending uk/en copy is this language's body.
  if (isAppLocale(locale) && !hasLegacyPageContent(locale)) {
    const ukPage = inventory[localizedPath("uk", route)];
    const enPage = inventory[localizedPath("en", route)];
    if (ukPage || enPage) {
      const titleByLocale: Record<AppLocale, string> = {
        uk: "ESOSH — переклад сторінки готується",
        en: "ESOSH — page translation in progress",
        de: "ESOSH — Seitenübersetzung in Arbeit",
        es: "ESOSH — traducción de la página en curso",
        fr: "ESOSH — traduction de la page en cours",
        az: "ESOSH — səhifə tərcüməsi hazırlanır",
        kk: "ESOSH — бет аудармасы дайындалуда",
      };
      const descriptionByLocale: Record<AppLocale, string> = {
        uk: "Інтерфейс доступний обраною мовою; повний текст сторінки ще перекладається.",
        en: "The interface is available in your language; the full page body is still being translated.",
        de: "Die Oberfläche ist in Ihrer Sprache verfügbar; der Seiteninhalt wird noch übersetzt.",
        es: "La interfaz ya está en su idioma; el contenido completo de la página aún se está traduciendo.",
        fr: "L’interface est disponible dans votre langue ; le contenu complet de la page est encore en cours de traduction.",
        az: "İnterfeys seçilmiş dildə mövcuddur; səhifənin tam mətni hələ tərcümə olunur.",
        kk: "Интерфейс таңдалған тілде қолжетімді; беттің толық мәтіні әлі аударылуда.",
      };
      const title = titleByLocale[locale];
      const description = descriptionByLocale[locale];
      return {
        metadataBase: new URL(origin),
        title,
        description,
        alternates: { canonical: path, languages },
        openGraph: {
          title,
          description,
          url: path,
          siteName: "ESOSH",
          locale: LOCALE_OG_TAGS[locale],
        },
        icons: { icon: "/favicon/favicon-32.png" },
      };
    }
  }

  notFound();
}
