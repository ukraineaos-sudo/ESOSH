"use client";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import alternates from "@/content/locale-links.json";

/** RU: Переключает на существующий перевод. EN: Link to an existing page translation. */
export function LocaleSwitch() {
  const locale = useLocale();
  const pathname = usePathname();
  const links = (alternates as Record<string, Record<string, string>>)[pathname] ?? { uk: "/", en: "/en" };
  return <div className="locales-wrapper"><div className="locales-list">
    {(["uk", "en"] as const).map((language) => <a key={language} href={links[language] || (language === "en" ? "/en/news" : "/news")} hrefLang={language} aria-current={locale === language ? "page" : undefined} className={`locale-link${locale === language ? " w--current" : ""}`}>{language === "uk" ? "UA" : "EN"}</a>)}
  </div></div>;
}
