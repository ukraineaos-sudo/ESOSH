"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { EnrollmentForm } from "@/components/EnrollmentForm";
import { TurnstileWidget } from "@/components/TurnstileWidget";

/** RU: Перевірка Turnstile перед анкетою вступу. EN: Turnstile gate before enrollment form. */
export function EnrollmentCaptchaGate() {
  const t = useTranslations("enrollment");
  const locale = useLocale() === "en" ? "en" : "uk";
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || "";
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
          language={locale}
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
