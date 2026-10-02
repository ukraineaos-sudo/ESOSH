import type { AppLocale } from "@/i18n/routing";
import { APP_LOCALES } from "@/lib/locale";

/**
 * Document stem without `-{locale}.pdf`.
 * Examples: `codex`, `terms`, `offer`, `trainings/uav-attacks-certificate`
 */
export type LocaleDocId =
  | "codex"
  | "terms"
  | "offer"
  | "trainings/uav-attacks-certificate"
  | "trainings/risk-assessment-certificate";

/**
 * Explicit inventory of PDFs that exist under `public/docs/`.
 * Update when adding `*-{locale}.pdf` files — do not silently serve another locale.
 */
export const DOC_INVENTORY: Record<LocaleDocId, readonly AppLocale[]> = {
  codex: ["uk", "en"],
  terms: ["uk", "en"],
  offer: ["uk", "en"],
  "trainings/uav-attacks-certificate": ["uk", "en"],
  "trainings/risk-assessment-certificate": ["uk", "en"],
};

export type LocaleDocResolution =
  | {
      status: "available";
      href: string;
      locale: AppLocale;
      docId: LocaleDocId;
    }
  | {
      status: "unavailable";
      docId: LocaleDocId;
      requestedLocale: AppLocale;
      /** Locales that have a real file — for UI to list alternatives without silent swap. */
      availableLocales: AppLocale[];
      availableHrefs: Partial<Record<AppLocale, string>>;
    };

/** RU: Публичный URL PDF по соглашению имён. EN: Public PDF URL by naming convention. */
export function localeDocHref(docId: LocaleDocId, locale: AppLocale): string {
  return `/docs/${docId}-${locale}.pdf`;
}

/** RU: Резолв документа без silent fallback на другую локаль. EN: Resolve doc; never pretend another locale file is this one. */
export function resolveLocaleDoc(
  docId: LocaleDocId,
  locale: AppLocale,
): LocaleDocResolution {
  const availableLocales = [...(DOC_INVENTORY[docId] ?? [])] as AppLocale[];
  const availableHrefs: Partial<Record<AppLocale, string>> = {};
  for (const loc of availableLocales) {
    availableHrefs[loc] = localeDocHref(docId, loc);
  }

  if (availableLocales.includes(locale)) {
    return {
      status: "available",
      href: localeDocHref(docId, locale),
      locale,
      docId,
    };
  }

  return {
    status: "unavailable",
    docId,
    requestedLocale: locale,
    availableLocales,
    availableHrefs,
  };
}

/** RU: Список всех ожидаемых слотов PDF (для документации / аудита). EN: Expected PDF path slots. */
export function expectedDocSlots(docId: LocaleDocId): string[] {
  return APP_LOCALES.map((locale) => localeDocHref(docId, locale));
}
