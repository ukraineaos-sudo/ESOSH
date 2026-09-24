"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useConsent } from "@/components/consent/ConsentProvider";

/** RU: Діалог налаштувань категорій cookies. EN: Cookie category settings dialog. */
export function ConsentSettings() {
  const t = useTranslations("consent");
  const { consent, closeSettings, saveChoice, acceptAll, acceptNecessary } = useConsent();
  const [communications, setCommunications] = useState(Boolean(consent?.communications));

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") closeSettings();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeSettings]);

  return (
    <div className="consent-modal" role="presentation">
      <button type="button" className="consent-modal__backdrop" aria-label={t("close")} onClick={closeSettings} />
      <div
        className="consent-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-settings-title"
      >
        <h2 id="consent-settings-title" className="consent-modal__title">
          {t("settingsTitle")}
        </h2>
        <p className="consent-modal__lead">{t("settingsLead")}</p>

        <ul className="consent-cats">
          <li className="consent-cat">
            <div>
              <strong>{t("catNecessary")}</strong>
              <p>{t("catNecessaryDesc")}</p>
            </div>
            <input type="checkbox" checked disabled aria-label={t("catNecessary")} />
          </li>
          <li className="consent-cat">
            <div>
              <strong>{t("catCommunications")}</strong>
              <p>{t("catCommunicationsDesc")}</p>
            </div>
            <input
              type="checkbox"
              checked={communications}
              onChange={(e) => setCommunications(e.target.checked)}
              aria-label={t("catCommunications")}
            />
          </li>
          <li className="consent-cat consent-cat--muted">
            <div>
              <strong>{t("catAnalytics")}</strong>
              <p>{t("catAnalyticsDesc")}</p>
            </div>
            <input type="checkbox" checked={Boolean(consent?.analytics)} disabled aria-label={t("catAnalytics")} />
          </li>
          <li className="consent-cat consent-cat--muted">
            <div>
              <strong>{t("catMarketing")}</strong>
              <p>{t("catMarketingDesc")}</p>
            </div>
            <input type="checkbox" checked={Boolean(consent?.marketing)} disabled aria-label={t("catMarketing")} />
          </li>
        </ul>

        <p className="consent-modal__links">
          <Link href="/privacy-policy" onClick={closeSettings}>
            {t("privacyLink")}
          </Link>
          {" · "}
          <Link href="/cookie-policy" onClick={closeSettings}>
            {t("cookieLink")}
          </Link>
        </p>

        <div className="consent-modal__actions">
          <button
            type="button"
            className="consent-btn consent-btn--primary"
            onClick={() =>
              saveChoice({
                communications,
                analytics: Boolean(consent?.analytics),
                marketing: Boolean(consent?.marketing),
              })
            }
          >
            {t("save")}
          </button>
          <button type="button" className="consent-btn consent-btn--secondary" onClick={acceptAll}>
            {t("acceptAll")}
          </button>
          <button type="button" className="consent-btn consent-btn--ghost" onClick={acceptNecessary}>
            {t("necessaryOnly")}
          </button>
        </div>
      </div>
    </div>
  );
}
