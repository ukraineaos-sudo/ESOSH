"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { EnrollmentForm } from "@/components/EnrollmentForm";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { isAppLocale } from "@/lib/locale";

/** RU: Перевірка Turnstile перед анкетою вступу. EN: Turnstile gate before enrollment form. */
export function EnrollmentCaptchaGate() {
  const t = useTranslations("enrollment");
  const rawLocale = useLocale();
  const locale = isAppLocale(rawLocale) ? rawLocale : "uk";
  // Turnstile widget UI: only uk/en supported well — use en for other locales.
  const widgetLocale = locale === "uk" ? "uk" : "en";
  // Client bundle: NODE_ENV is "development" under `next dev` — skip widget (error 110200 on localhost).
  const siteKey =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || ""
      : "";
  const [unlocked, setUnlocked] = useState(!siteKey);
  const [token, setToken] = useState<string | null>(null);
  const [widgetError, setWidgetError] = useState(false);

  if (!siteKey) {
    return <EnrollmentForm turnstileToken={null} />;
  }

  if (!unlocked) {
    return (
      <div className="enrollment-captcha-gate" role="group" aria-labelledby="enrollment-captcha-title">
        <h2 id="enrollment-captcha-title" className="h3 is--margin-bottom-12">
          {t("captcha.gateTitle")}
        </h2>
        <p className="regular-m is--margin-bottom-20">{t("captcha.gateHint")}</p>
        <TurnstileWidget
          siteKey={siteKey}
          language={widgetLocale}
          onSuccess={(next) => {
            setToken(next);
            setWidgetError(false);
            setUnlocked(true);
          }}
          onExpire={() => {
            setToken(null);
            setUnlocked(false);
          }}
          onError={() => setWidgetError(true)}
        />
        {widgetError ? (
          <p className="site-form-error is--margin-top-12" role="alert">
            {t("captcha.widgetError")}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <EnrollmentForm
      turnstileToken={token}
      onTurnstileToken={setToken}
      turnstileSiteKey={siteKey}
    />
  );
}
