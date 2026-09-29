"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import {
  LOCALE_FLAG_SRC,
  LOCALE_NATIVE_LABELS,
  LOCALE_SHORT_LABELS,
  switchLocalePath,
} from "@/lib/locale";

function LocaleFlag({ locale, className }: { locale: AppLocale; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={LOCALE_FLAG_SRC[locale]}
      alt=""
      width={20}
      height={14}
      decoding="async"
      aria-hidden="true"
    />
  );
}

/** RU: Выпадающий переключатель локалей с флагами. EN: Locale dropdown with flags. */
export function LocaleSwitch() {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname, locale]);

  const currentCode = LOCALE_SHORT_LABELS[locale];
  const currentNative = LOCALE_NATIVE_LABELS[locale];

  return (
    <div className={`locale-switch${open ? " is-open" : ""}`} ref={rootRef}>
      <button
        type="button"
        className="locale-switch__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={currentNative}
        onClick={() => setOpen((value) => !value)}
      >
        <LocaleFlag locale={locale} className="locale-switch__flag" />
        <span className="locale-switch__code">{currentCode}</span>
        <span className="locale-switch__chevron" aria-hidden="true" />
      </button>

      <ul
        id={listId}
        className="locale-switch__menu"
        role="listbox"
        aria-label="Language"
        hidden={!open}
      >
        {routing.locales.map((language) => {
          const code = language as AppLocale;
          const href = switchLocalePath(pathname || "/", code);
          const active = locale === code;
          const native = LOCALE_NATIVE_LABELS[code];
          return (
            <li key={code} role="option" aria-selected={active}>
              <a
                href={href}
                hrefLang={code}
                lang={code}
                className={`locale-switch__option${active ? " is-current" : ""}`}
                onClick={() => setOpen(false)}
              >
                <LocaleFlag locale={code} className="locale-switch__flag" />
                <span className="locale-switch__option-code">{LOCALE_SHORT_LABELS[code]}</span>
                <span className="locale-switch__option-native">{native}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
