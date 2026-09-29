import { routing, type AppLocale } from "@/i18n/routing";

export type { AppLocale };

/** Locales that have full legacy TSX page bodies today. */
export const CONTENT_LOCALES = ["uk", "en"] as const;
export type ContentLocale = (typeof CONTENT_LOCALES)[number];

export const LOCALE_NATIVE_LABELS: Record<AppLocale, string> = {
  uk: "Українська",
  en: "English",
  de: "Deutsch",
  es: "Español",
  fr: "Français",
  az: "Azərbaycan",
  kk: "Қазақша",
};

/** Compact switcher labels (native short forms). */
export const LOCALE_SHORT_LABELS: Record<AppLocale, string> = {
  uk: "UA",
  en: "EN",
  de: "DE",
  es: "ES",
  fr: "FR",
  az: "AZ",
  kk: "KK",
};

/** Local PNG flags (Windows does not render emoji flags reliably). */
export const LOCALE_FLAG_SRC: Record<AppLocale, string> = {
  uk: "/images/flags/ua.png",
  en: "/images/flags/gb.png",
  de: "/images/flags/de.png",
  es: "/images/flags/es.png",
  fr: "/images/flags/fr.png",
  az: "/images/flags/az.png",
  kk: "/images/flags/kz.png",
};

export const LOCALE_OG_TAGS: Record<AppLocale, string> = {
  uk: "uk_UA",
  en: "en_US",
  de: "de_DE",
  es: "es_ES",
  fr: "fr_FR",
  az: "az_AZ",
  kk: "kk_KZ",
};

export const LOCALE_BCP47: Record<AppLocale, string> = {
  uk: "uk-UA",
  en: "en-GB",
  de: "de-DE",
  es: "es-ES",
  fr: "fr-FR",
  az: "az-AZ",
  kk: "kk-KZ",
};

const PREFIXED_LOCALES = new Set(
  routing.locales.filter((locale) => locale !== routing.defaultLocale),
);

/** RU: Является ли локаль дефолтной (без префикса). EN: Default locale has no URL prefix. */
export function isDefaultLocale(locale: string): locale is typeof routing.defaultLocale {
  return locale === routing.defaultLocale;
}

/** RU: Есть ли полное тело страницы (legacy TSX). EN: Whether legacy page TSX exists for locale. */
export function hasLegacyPageContent(locale: string): locale is ContentLocale {
  return (CONTENT_LOCALES as readonly string[]).includes(locale);
}

/** RU: Префикс пути локали (`""` для uk, `/de` для de). EN: Locale path prefix. */
export function localePathPrefix(locale: string): string {
  if (!locale || isDefaultLocale(locale)) return "";
  if ((routing.locales as readonly string[]).includes(locale)) return `/${locale}`;
  return "";
}

/**
 * RU: Канонический путь страницы для локали.
 * EN: Canonical pathname for locale + unprefixed route (`/` or `/about-esosh`).
 */
export function localizedPath(locale: string, route: string): string {
  const normalized =
    !route || route === "/"
      ? ""
      : route.startsWith("/")
        ? route
        : `/${route}`;
  const prefix = localePathPrefix(locale);
  if (!normalized) return prefix || "/";
  return `${prefix}${normalized}`;
}

/** RU: Снять известный префикс локали с pathname. EN: Strip known locale prefix from pathname. */
export function stripLocalePrefix(pathname: string): string {
  const clean = pathname.split("?")[0] || "/";
  for (const locale of PREFIXED_LOCALES) {
    const prefix = `/${locale}`;
    if (clean === prefix) return "/";
    if (clean.startsWith(`${prefix}/`)) return clean.slice(prefix.length) || "/";
  }
  return clean || "/";
}

/**
 * RU: Переключить текущий pathname на другую локаль (без silent remap slug).
 * EN: Rebuild the same unprefixed route under another locale.
 */
export function switchLocalePath(pathname: string, targetLocale: AppLocale): string {
  return localizedPath(targetLocale, stripLocalePrefix(pathname));
}

/** RU: Zod / runtime enum всех публичных локалей. EN: All public AppLocale values. */
export const APP_LOCALES = routing.locales;

export function isAppLocale(value: string): value is AppLocale {
  return (routing.locales as readonly string[]).includes(value);
}
