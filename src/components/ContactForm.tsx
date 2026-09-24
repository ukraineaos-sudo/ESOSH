"use client";
import { useLocale, useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { Link } from "@/i18n/navigation";
import { contactSchema } from "@/lib/contact";

/** RU: Проверяет и отправляет обращение. EN: Validate and deliver a contact request. */
export function ContactForm() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [state, setState] = useState<"idle" | "sending" | "success" | "error" | "unavailable">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  /** RU: Отправляет форму через API. EN: Submit validated form data to the API. */
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      message: data.get("message"),
      company: data.get("company"),
      locale,
      privacyConsent: data.get("privacyConsent") === "on",
    };
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        next[key] =
          key === "name"
            ? t("errorName")
            : key === "email"
              ? t("errorEmail")
              : key === "privacyConsent"
                ? t("privacyRequired")
                : t("errorMessage");
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setState("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!response.ok) {
        setState(response.status === 503 ? "unavailable" : "error");
        return;
      }
      form.reset();
      setState("success");
    } catch {
      setState("error");
    }
  }
  if (state === "success") return <div className="site-form-success" role="status">{t("success")}</div>;
  return (
    <div className="w-form">
      <form className="site-contact-form" onSubmit={onSubmit} noValidate>
        <div className="site-honeypot" aria-hidden="true">
          <label htmlFor="company">Company</label>
          <input id="company" name="company" tabIndex={-1} autoComplete="off" />
        </div>
        {(["name", "email", "message"] as const).map((name) => (
          <div key={name}>
            <label className="regular-s is--label" htmlFor={name}>
              {t(name === "name" ? "nameLabel" : name === "email" ? "emailFieldLabel" : "messageLabel")}
            </label>
            <input
              className="form-input text-field w-input"
              id={name}
              name={name}
              type={name === "email" ? "email" : "text"}
              autoComplete={name === "message" ? "off" : name}
              maxLength={256}
              required
              placeholder={t(
                name === "name" ? "namePlaceholder" : name === "email" ? "emailPlaceholder" : "messagePlaceholder",
              )}
              aria-invalid={Boolean(errors[name])}
              aria-describedby={errors[name] ? name + "-error" : undefined}
            />
            {errors[name] ? (
              <p className="site-form-error" id={name + "-error"} role="alert">
                {errors[name]}
              </p>
            ) : null}
          </div>
        ))}
        <div className="site-privacy-consent">
          <label className="site-privacy-consent__label" htmlFor="privacyConsent">
            <input id="privacyConsent" name="privacyConsent" type="checkbox" required />
            <span>
              {t("privacyLabel")}{" "}
              <Link href="/privacy-policy" className="site-privacy-consent__link">
                {t("privacyLink")}
              </Link>
              .
            </span>
          </label>
          <p className="site-privacy-consent__hint regular-s">{t("privacyHint")}</p>
          {errors.privacyConsent ? (
            <p className="site-form-error" role="alert">
              {errors.privacyConsent}
            </p>
          ) : null}
        </div>
        {state === "error" ? (
          <p className="site-form-error" role="alert">
            {t("error")}
          </p>
        ) : null}
        {state === "unavailable" ? (
          <p className="site-form-error" role="alert">
            {t("unavailable")} <a href="mailto:office@esosh.net">office@esosh.net</a>
          </p>
        ) : null}
        <button className="btn is--primary w-button" type="submit" disabled={state === "sending"}>
          {t(state === "sending" ? "submitting" : "submit")}
        </button>
      </form>
    </div>
  );
}
