"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
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
};

const SEEK_TOLERANCE_SEC = 1.4;
const POLL_MS = 400;

const copy = {
  uk: {
    pending:
      "Відео з YouTube завантажується лише після згоди на категорію «Маркетинг» (сторонній плеєр).",
    openSettings: "Відкрити налаштування cookies",
    enableHint: "Увімкніть «Маркетинг», збережіть вибір — і плеєр з’явиться на цій сторінці.",
    seekHint: "Перемотка вперед обмежена: перегляньте відео до кінця, щоб відкрити тест.",
    watched: "Відео переглянуте",
    notWatched: "Відео переглянуте",
    loadingPlayer: "Завантаження плеєра…",
  },
  en: {
    pending:
      "The YouTube video loads only after you consent to the Marketing category (third-party player).",
    openSettings: "Open cookie settings",
    enableHint: "Enable Marketing, save your choice, and the player will appear on this page.",
    seekHint: "Forward seeking is limited: watch the video to the end to unlock the quiz.",
    watched: "Video watched",
    notWatched: "Video watched",
    loadingPlayer: "Loading player…",
  },
} as const;

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
}: Props) {
  const { ready, consent, openSettings } = useConsent();
  const allowed = ready && hasConsent(consent, "marketing");
  const t = copy[locale];
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

    if (readStoredDone(videoId)) {
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
        if (tNow > max + SEEK_TOLERANCE_SEC) {
          try {
            player.seekTo(max, true);
          } catch {
            /* ignore */
          }
          return;
        }

        // Advance watermark only while watching forward in small steps
        if (tNow >= max - 0.25 && tNow <= max + SEEK_TOLERANCE_SEC + 0.5) {
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
        <TrainingStatusMark done={false} label={t.notWatched} />
      </div>
    );
  }

  return (
    <div className="training-video">
      <div className="training-video__frame" title={title}>
        <div id={playerHostId} className="training-video__player-host" />
        {!playerReady ? (
          <div className="training-video__loading" aria-live="polite">
            {t.loadingPlayer}
          </div>
        ) : null}
      </div>
      <p className="training-video__seek-hint regular-s">{t.seekHint}</p>
      <TrainingStatusMark done={completed} label={t.watched} />
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
