"use client";
/* Local static brand icons retain their source dimensions. */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { navigationGroups } from "./navigation-groups";
import { LocaleSwitch } from "./LocaleSwitch";

/** RU: Мобильное меню с управлением фокусом. EN: Mobile dialog with native focus management. */
export function MobileMenu() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const prefix = locale === "en" ? "/en" : "";
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open || !dialog.current) return;
    const element = dialog.current;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => { element.close(); document.body.style.overflow = overflow; };
  }, [open]);
  return <>
    <button type="button" className="hamburger-menu site-icon-button" aria-label={t("openMenu")} aria-expanded={open} onClick={() => setOpen(true)}>
      <img src="/icons/hamburger.svg" alt="" width={40} height={40} />
    </button>
    <dialog ref={dialog} className="nav-adaptation site-mobile-dialog" aria-label={t("menu")} onCancel={() => setOpen(false)}>
      <div className="nav-adaptation-menu">
        <a href={prefix || "/"} aria-label="ESOSH"><img src="/images/logo-color.png" alt="ESOSH" className="nav-logo" width={104} height={40} /></a>
        <LocaleSwitch />
        <button type="button" className="site-icon-button" aria-label={t("closeMenu")} onClick={() => setOpen(false)}><img src="/icons/close.svg" alt="" width={40} height={40} /></button>
      </div>
      <div className="nav-adaptation-menu-content">
        <div className="nav-adaptation-menu-wrapper">
          {navigationGroups.map((group) => group.items ? <details className="adaptation-accordion-item" key={group.key}>
            <summary className="adaptation-accordion-item-trigger"><span className="menu-adaptation-link is--no-hover">{t(group.key)}</span><img src="/icons/chevron-down.svg" alt="" aria-hidden="true" className="is--icon-size-24--m-20" width={24} height={24} /></summary>
            <div className="site-mobile-submenu">{group.items.map((item) => <a key={item.href} className="menu-adaptation-link-small" href={prefix + item.href}>{t(item.key)}</a>)}</div>
          </details> : <a key={group.key} className="menu-adaptation-link" href={prefix + group.href}>{t(group.key)}</a>)}
        </div>
        <div><p className="regular-l">{locale === "en" ? "Follow us" : "Слідкуйте за нами"}</p><div className="site-mobile-social"><a href="https://www.facebook.com/groups/esosh">Facebook</a><a href="https://www.linkedin.com/company/esosh-the-european-society-of-occupational-safety-health/">LinkedIn</a><a href="https://www.youtube.com/@esosh7814">YouTube</a></div><p className="medium-xs is--grey-20">© 2022 ESOSH. All Rights Reserved</p></div>
      </div>
    </dialog>
  </>;
}
