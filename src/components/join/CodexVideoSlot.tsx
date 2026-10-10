"use client";

import { useTranslations } from "next-intl";
import { hasConsent } from "@/lib/consent";
import { useConsent } from "@/components/consent/ConsentProvider";

type Props = {
  youtubeId: string;
  title: string;
  watchUrl: string;
  openOnYoutubeLabel: string;
  /** Shown only if youtubeId is empty (legacy placeholder). */
  comingSoonLabel?: string;
};

/** RU: Consent-aware YouTube на сторінці кодексу (без anti-seek). EN: Codex page YouTube embed. */
export function CodexVideoSlot({
  youtubeId,
  title,
  watchUrl,
  openOnYoutubeLabel,
  comingSoonLabel,
}: Props) {
  const t = useTranslations("trainings");
  const { ready, consent, openSettings } = useConsent();
  const id = youtubeId.trim();

  if (!id) {
    return (
      <div className="codex-video-slot is--margin-bottom-48" aria-label={comingSoonLabel}>
        <div className="codex-video-slot__frame">
          <p className="regular-l is--center is--grey-60">{comingSoonLabel ?? ""}</p>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="codex-video-slot is--margin-bottom-48" aria-busy="true">
        <div className="codex-video-slot__frame codex-video-slot__frame--pending">
          <p className="regular-l">{t("youtubePendingConsent")}</p>
        </div>
      </div>
    );
  }

  if (!hasConsent(consent, "marketing")) {
    return (
      <div className="codex-video-slot is--margin-bottom-48">
        <div className="codex-video-slot__frame codex-video-slot__frame--pending">
          <p className="regular-l is--margin-bottom-16">{t("youtubePendingConsent")}</p>
          <p className="regular-s is--margin-bottom-24">{t("youtubeEnableHint")}</p>
          <button type="button" className="btn is--primary w-button" onClick={openSettings}>
            {t("youtubeOpenSettings")}
          </button>
        </div>
      </div>
    );
  }

  const src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`;

  return (
    <div className="codex-video-slot is--margin-bottom-48">
      <div className="codex-video-slot__frame">
        <iframe
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <a
        href={watchUrl}
        className="codex-video-slot__open is--accent regular-s"
        target="_blank"
        rel="noopener noreferrer"
      >
        {openOnYoutubeLabel}
      </a>
    </div>
  );
}
