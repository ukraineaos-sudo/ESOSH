"use client";

import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";
import type { LocaleDocId } from "@/lib/docs";
import { resolveLocaleDoc } from "@/lib/docs";
import { isAppLocale, LOCALE_NATIVE_LABELS, type AppLocale } from "@/lib/locale";

type Props = {
  docId: LocaleDocId;
  className?: string;
  children: ReactNode;
  /** Optional override; defaults to active UI locale. */
  locale?: AppLocale;
};

/**
 * RU: Ссылка на PDF выбранной локали без silent fallback.
 * EN: Locale PDF link; if missing, show available alternatives (never swap silently).
 */
export function LocaleDocLink({ docId, className, children, locale: localeProp }: Props) {
  const raw = useLocale();
  const locale = localeProp ?? (isAppLocale(raw) ? raw : "uk");
  const t = useTranslations("docs");
  const resolved = resolveLocaleDoc(docId, locale);

  if (resolved.status === "available") {
    return (
      <a href={resolved.href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <div className="locale-doc-unavailable">
      <button type="button" className={className} disabled aria-disabled="true">
        {children}
      </button>
      <p className="regular-s" role="status">
        {t("unavailable")}
      </p>
      {resolved.availableLocales.length > 0 ? (
        <p className="regular-s">
          {t("availableIn")}{" "}
          {resolved.availableLocales.map((loc, index) => (
            <span key={loc}>
              {index > 0 ? ", " : null}
              <a href={resolved.availableHrefs[loc]} target="_blank" rel="noopener noreferrer">
                {t("openLocale", { locale: LOCALE_NATIVE_LABELS[loc] })}
              </a>
            </span>
          ))}
        </p>
      ) : null}
    </div>
  );
}
