"use client";

import { hasConsent } from "@/lib/consent";
import { useConsent } from "@/components/consent/ConsentProvider";
import type { LocaleCode } from "@/content/trainings/types";

type Props = {
  locale: LocaleCode;
  videoId: string;
  title: string;
};

const copy = {
  uk: {
    pending:
      "Відео з YouTube завантажується лише після згоди на категорію «Маркетинг» (сторонній плеєр).",
    openSettings: "Відкрити налаштування cookies",
    enableHint: "Увімкніть «Маркетинг», збережіть вибір — і плеєр з’явиться на цій сторінці.",
  },
  en: {
    pending:
      "The YouTube video loads only after you consent to the Marketing category (third-party player).",
    openSettings: "Open cookie settings",
    enableHint: "Enable Marketing, save your choice, and the player will appear on this page.",
  },
} as const;

/** RU: YouTube nocookie embed після marketing consent. EN: YouTube nocookie embed after marketing consent. */
export function YoutubeConsentEmbed({ locale, videoId, title }: Props) {
  const { ready, consent, openSettings } = useConsent();
  const allowed = ready && hasConsent(consent, "marketing");
  const t = copy[locale];

  if (!ready) {
    return (
      <div className="training-video training-video--pending" aria-busy="true">
        <div className="training-video__placeholder">
          <p className="regular-l">{t.pending}</p>
        </div>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="training-video training-video--pending">
        <div className="training-video__placeholder">
          <p className="regular-l is--margin-bottom-16">{t.pending}</p>
          <p className="regular-s is--margin-bottom-24">{t.enableHint}</p>
          <button type="button" className="btn is--primary w-button" onClick={openSettings}>
            {t.openSettings}
          </button>
        </div>
      </div>
    );
  }

  const src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`;

  return (
    <div className="training-video">
      <div className="training-video__frame">
        <iframe
          src={src}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  );
}
