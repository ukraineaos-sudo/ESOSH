import { getLocale } from "next-intl/server";
import UkrainianFooter from "@/content/chrome/footer-uk";
import EnglishFooter from "@/content/chrome/footer-en";
import { getContactSettings } from "@/lib/site-settings";
import { isAppLocale, localePathPrefix } from "@/lib/locale";

/** RU: Подвал: uk — украинский chrome; остальные — EN chrome с префиксом локали. EN: uk footer vs EN chrome + locale prefix. */
export async function Footer() {
  const contacts = await getContactSettings();
  const locale = await getLocale();
  if (locale === "uk") {
    return <UkrainianFooter contacts={contacts} />;
  }
  const prefix = isAppLocale(locale) ? localePathPrefix(locale) : "/en";
  return <EnglishFooter contacts={contacts} localePrefix={prefix || "/en"} />;
}
