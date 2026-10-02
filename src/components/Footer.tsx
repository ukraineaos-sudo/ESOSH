import { getLocale } from "next-intl/server";
import UkrainianFooter from "@/content/chrome/footer-uk";
import EnglishFooter from "@/content/chrome/footer-en";
import GermanFooter from "@/content/chrome/footer-de";
import SpanishFooter from "@/content/chrome/footer-es";
import FrenchFooter from "@/content/chrome/footer-fr";
import AzerbaijaniFooter from "@/content/chrome/footer-az";
import KazakhFooter from "@/content/chrome/footer-kk";
import { getContactSettings } from "@/lib/site-settings";
import { isAppLocale, localePathPrefix, type AppLocale } from "@/lib/locale";
import type { ContactSettings } from "@/lib/site-settings";
import type { ComponentType } from "react";

type PrefixedFooter = ComponentType<{
  contacts?: ContactSettings;
  localePrefix?: string;
}>;

const PREFIXED_FOOTERS: Partial<Record<AppLocale, PrefixedFooter>> = {
  en: EnglishFooter,
  de: GermanFooter,
  es: SpanishFooter,
  fr: FrenchFooter,
  az: AzerbaijaniFooter,
  kk: KazakhFooter,
};

/** RU: Подвал по локали (отдельный chrome; без silent EN-текста для de/es/…). EN: Locale-specific footer chrome. */
export async function Footer() {
  const contacts = await getContactSettings();
  const locale = await getLocale();
  if (locale === "uk") {
    return <UkrainianFooter contacts={contacts} />;
  }
  const appLocale = isAppLocale(locale) ? locale : "en";
  const FooterChrome = PREFIXED_FOOTERS[appLocale] ?? EnglishFooter;
  const prefix = isAppLocale(locale) ? localePathPrefix(locale) : "/en";
  return <FooterChrome contacts={contacts} localePrefix={prefix || "/en"} />;
}
