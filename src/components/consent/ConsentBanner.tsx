"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useConsent } from "@/components/consent/ConsentProvider";

/** RU: Банер cookies / третіх сторін. EN: Cookie & third-party consent banner. */
export function ConsentBanner() {
  const t = useTranslations("consent");
  const { acceptAll, acceptNecessary, openSettings } = useConsent();

  return (
    <div className="consent-banner" role="region" aria-label={t("bannerAria")}>
      <div className="consent-banner__inner">
        <div className="consent-banner__text">
          <p className="consent-banner__title">{t("bannerTitle")}</p>
          <p className="consent-banner__body">
            {t("bannerBody")}{" "}
            <Link href="/privacy-policy" className="consent-banner__link">
              {t("privacyLink")}
            </Link>
            {" · "}
            <Link href="/cookie-policy" className="consent-banner__link">
              {t("cookieLink")}
            </Link>
          </p>
          <p className="consent-banner__draft">{t("draftNote")}</p>
        </div>
        <div className="consent-banner__actions">
          <button type="button" className="consent-btn consent-btn--primary" onClick={acceptAll}>
            {t("acceptAll")}
          </button>
          <button type="button" className="consent-btn consent-btn--secondary" onClick={acceptNecessary}>
            {t("necessaryOnly")}
          </button>
          <button type="button" className="consent-btn consent-btn--ghost" onClick={openSettings}>
            {t("settings")}
          </button>
        </div>
      </div>
    </div>
  );
}
