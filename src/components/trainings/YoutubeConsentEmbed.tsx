"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { hasConsent } from "@/lib/consent";
import { useConsent } from "@/components/consent/ConsentProvider";
import type { LocaleCode } from "@/content/trainings/types";

type Props = {
  locale: LocaleCode;
  videoId: string;
  title: string;
  /** Fired once when the learner reaches the natural end of the video. */
  onCompleted: () => void;
  completed: boolean;
  /** When false, hide the seek-limit tip; anti-seek still applies (default true). */
  showSeekHint?: boolean;
};

const SEEK_TOLERANCE_SEC = 1.4;
const POLL_MS = 400;
/** TEMP: set `true` only for local seek-bypass testing; keep `false` in production. */
const DISABLE_ANTI_SEEK = false;

type YtPlayer = {
  destroy: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
};

type YtNamespace = {
  Player: new (
    elementId: string,
    options: {
      videoId: string;
      width?: string | number;
      height?: string | number;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: () => void;
        onStateChange?: (event: { data: number }) => void;
      };
    },
  ) => YtPlayer;
  PlayerState: { ENDED: number; PLAYING: number; PAUSED: number; BUFFERING: number };
};

declare global {
  interface Window {
    YT?: YtNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;

function loadYoutubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    }
    // API may already be mid-load
    const check = window.setInterval(() => {
      if (window.YT?.Player) {
        window.clearInterval(check);
        resolve();
      }
    }, 50);
  });
  return apiPromise;
}

function storageKey(videoId: string) {
  return `esosh-training-watch-v1:${videoId}`;
}

function readStoredMax(videoId: string): number {
  try {
    const raw = sessionStorage.getItem(storageKey(videoId));
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as { max?: number; done?: boolean };
    return typeof parsed.max === "number" && parsed.max > 0 ? parsed.max : 0;
  } catch {
    return 0;
  }
}

function writeStored(videoId: string, max: number, done: boolean) {
  try {
    sessionStorage.setItem(storageKey(videoId), JSON.stringify({ max, done }));
  } catch {
    /* ignore quota */
  }
}

function readStoredDone(videoId: string): boolean {
  try {
    const raw = sessionStorage.getItem(storageKey(videoId));
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { done?: boolean };
    return Boolean(parsed.done);
  } catch {
    return false;
  }
}

/** RU: YouTube з антиперемоткою і подією завершення. EN: YouTube with anti-seek and completion event. */
export function YoutubeConsentEmbed({
  locale,
  videoId,
  title,
  onCompleted,
  completed,
  showSeekHint = true,
}: Props) {
  const { ready, consent, openSettings } = useConsent();
  const allowed = ready && hasConsent(consent, "marketing");
  const t = useTranslations("trainings");
  void locale;
  const hostId = useId().replace(/:/g, "");
  const playerHostId = `yt-host-${hostId}`;

  const playerRef = useRef<YtPlayer | null>(null);
  const maxWatchedRef = useRef(0);
  const completedRef = useRef(completed);
  const onCompletedRef = useRef(onCompleted);
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    completedRef.current = completed;
  }, [completed]);

  useEffect(() => {
    onCompletedRef.current = onCompleted;
  }, [onCompleted]);

  const markComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    writeStored(videoId, maxWatchedRef.current, true);
    onCompletedRef.current();
  }, [videoId]);

  useEffect(() => {
    if (!allowed) return;

    const alreadyDone = completedRef.current || readStoredDone(videoId);
    if (alreadyDone) {
      maxWatchedRef.current = Math.max(maxWatchedRef.current, readStoredMax(videoId));
      markComplete();
    } else {
      maxWatchedRef.current = readStoredMax(videoId);
    }

    let cancelled = false;
    let pollId: number | null = null;

    loadYoutubeApi().then(() => {
      if (cancelled || !window.YT?.Player) return;

      const origin =
        typeof window !== "undefined" ? window.location.origin : undefined;

      playerRef.current = new window.YT.Player(playerHostId, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          fs: 1,
          ...(origin ? { origin } : {}),
        },
        events: {
          onReady: () => {
            if (cancelled) return;
            setPlayerReady(true);
            // After first completion, start at 0 so the learner can rewatch.
            // Before completion, resume from the stored watermark.
            if (alreadyDone) return;
            const start = maxWatchedRef.current;
            if (start > 1) {
              try {
                playerRef.current?.seekTo(start, true);
              } catch {
                /* ignore */
              }
            }
          },
          onStateChange: (event) => {
            if (!window.YT) return;
            if (event.data === window.YT.PlayerState.ENDED) {
              const duration = playerRef.current?.getDuration?.() ?? 0;
              if (duration > 0) {
                maxWatchedRef.current = Math.max(maxWatchedRef.current, duration);
              }
              markComplete();
            }
          },
        },
      });

      pollId = window.setInterval(() => {
        const player = playerRef.current;
        if (!player || !window.YT) return;
        let tNow = 0;
        let duration = 0;
        try {
          tNow = player.getCurrentTime() || 0;
          duration = player.getDuration() || 0;
        } catch {
          return;
        }
        if (tNow <= 0) return;

        const max = maxWatchedRef.current;
        // Free seek while testing, or after the required watch is already done (rewatch).
        const allowFreeSeek = DISABLE_ANTI_SEEK || completedRef.current;
        if (!allowFreeSeek && tNow > max + SEEK_TOLERANCE_SEC) {
          try {
            player.seekTo(max, true);
          } catch {
            /* ignore */
          }
          return;
        }

        if (allowFreeSeek) {
          maxWatchedRef.current = Math.max(max, tNow);
          writeStored(videoId, maxWatchedRef.current, completedRef.current);
        } else if (tNow >= max - 0.25 && tNow <= max + SEEK_TOLERANCE_SEC + 0.5) {
          // Advance watermark only while watching forward in small steps
          maxWatchedRef.current = Math.max(max, tNow);
          writeStored(videoId, maxWatchedRef.current, completedRef.current);
        }

        // Near natural end — treat as completed (ENDED can be flaky with seek fights)
        if (duration > 0 && tNow >= duration - 1.25) {
          maxWatchedRef.current = Math.max(maxWatchedRef.current, duration);
          markComplete();
        }
      }, POLL_MS);
    });

    return () => {
      cancelled = true;
      if (pollId != null) window.clearInterval(pollId);
      try {
        playerRef.current?.destroy();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
    };
  }, [allowed, videoId, playerHostId, markComplete]);

  if (!ready) {
    return (
      <div className="training-video training-video--pending" aria-busy="true">
        <div className="training-video__placeholder">
          <p className="regular-l">{t("youtubePendingConsent")}</p>
        </div>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="training-video training-video--pending">
        <div className="training-video__placeholder">
          <p className="regular-l is--margin-bottom-16">{t("youtubePendingConsent")}</p>
          <p className="regular-s is--margin-bottom-24">{t("youtubeEnableHint")}</p>
          <button type="button" className="btn is--primary w-button" onClick={openSettings}>
            {t("youtubeOpenSettings")}
          </button>
        </div>
        <TrainingStatusMark done={false} label={t("youtubeWatched")} />
      </div>
    );
  }

  return (
    <div className="training-video">
      <div className="training-video__frame" title={title}>
        <div id={playerHostId} className="training-video__player-host" />
        {!playerReady ? (
          <div className="training-video__loading" aria-live="polite">
            {t("youtubeLoading")}
          </div>
        ) : null}
      </div>
      {showSeekHint && !DISABLE_ANTI_SEEK && !completed ? (
        <p className="training-video__seek-hint regular-s">{t("youtubeSeekHint")}</p>
      ) : null}
      <TrainingStatusMark done={completed} label={t("youtubeWatched")} />
    </div>
  );
}

function TrainingStatusMark({ done, label }: { done: boolean; label: string }) {
  return (
    <p
      className={`training-status-mark${done ? " is-done" : ""}`}
      role="status"
      aria-live="polite"
    >
      <span className="training-status-mark__icon" aria-hidden="true">
        {done ? "✓" : "○"}
      </span>
      <span>{label}</span>
    </p>
  );
}

export { TrainingStatusMark };
