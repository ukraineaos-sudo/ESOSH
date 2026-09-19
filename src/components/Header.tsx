"use client";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { NavigationDropdown } from "./navigation/NavigationDropdown";
import { MobileMenu } from "./navigation/MobileMenu";
import { LocaleSwitch } from "./navigation/LocaleSwitch";
import { navigationGroups } from "./navigation/navigation-groups";

/** RU: Общая навигация сайта. EN: Shared site navigation. */
export function Header() {
  const locale = useLocale();
  const t = useTranslations("nav");
  const pathname = usePathname();
  const prefix = locale === "en" ? "/en" : "";
  return <header className="w-layout-blockcontainer container is--nav w-container">
    <nav className="nav" aria-label={t("menu")}>
      <a href={prefix || "/"} className="nav-logo-wrapper w-inline-block" aria-label="ESOSH">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo-color.png" alt="ESOSH" className="nav-logo" width={104} height={40} />
      </a>
      <div className="nav-menu-wrapper">
        {navigationGroups.map((group) => group.items ? (
          <NavigationDropdown key={group.key} label={t(group.key)}>
            {group.items.map((item) => <a key={item.href} href={prefix + item.href} className="menu-dropdown-item is--w-100p">{t(item.key)}</a>)}
          </NavigationDropdown>
        ) : (
          <a key={group.key} href={prefix + group.href} aria-current={pathname === prefix + group.href ? "page" : undefined} className="nav-menu-link is--light-blue-bg">{t(group.key)}</a>
        ))}
      </div>
      <div className="hamburger-and-locale"><LocaleSwitch /><MobileMenu key={pathname} /></div>
    </nav>
  </header>;
}
