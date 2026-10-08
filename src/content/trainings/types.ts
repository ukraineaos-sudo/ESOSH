/** RU: Типи контенту тренінгів. EN: Training content types. */

import type { AppLocale } from "@/i18n/routing";
import type { LocaleDocId } from "@/lib/docs";

export type LocaleCode = AppLocale;

/**
 * uk+en required today; other locales optional until translated.
 * Do not silently fall back when reading — use `pickLocalized`.
 */
export type LocalizedString = Partial<Record<LocaleCode, string>> & {
  uk: string;
  en: string;
};

/** RU: Строка для локали без silent fallback. EN: Locale string without silent fallback. */
export function pickLocalized(
  map: LocalizedString | undefined,
  locale: LocaleCode,
): string | undefined {
  if (!map) return undefined;
  const value = map[locale];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

/**
 * Quiz copy preferably matches the video language (uk for risk-assessment videos).
 * Other locales optional; missing → show uk (not a silent marketing-page swap).
 */
export type QuizText = { uk: string } & Partial<Record<LocaleCode, string>>;

export function pickQuizText(map: QuizText, locale: LocaleCode): string {
  const value = map[locale];
  if (typeof value === "string" && value.length > 0) return value;
  return map.uk;
}

/** 3–5 options per question (A–E). Only present keys are shown. */
export type QuizOptionId = "A" | "B" | "C" | "D" | "E";

export const QUIZ_OPTION_IDS: readonly QuizOptionId[] = ["A", "B", "C", "D", "E"];

export type QuizQuestion = {
  id: number;
  question: QuizText;
  /** Include only the options used for this question (3–5). */
  options: Partial<Record<QuizOptionId, QuizText>>;
  correct: QuizOptionId;
};

/** Client-safe question (answer key stays server-side). */
export type PublicQuizQuestion = Omit<QuizQuestion, "correct">;

export type TrainingQuizUi = {
  title: LocalizedString;
  submit: LocalizedString;
  reset: LocalizedString;
  incomplete: LocalizedString;
  scoreLabel: LocalizedString;
  correctLabel: LocalizedString;
  wrongLabel: LocalizedString;
  optionPrefix?: Partial<Record<QuizOptionId, string>>;
};

/** One video + quiz gate inside a training. */
export type TrainingModule = {
  id: string;
  title: LocalizedString;
  videoTitle: LocalizedString;
  /** Empty until YouTube upload — UI shows a pending state. */
  youtubeId: string;
  quiz: QuizQuestion[];
};

export type PublicTrainingModule = Omit<TrainingModule, "quiz"> & {
  quiz: PublicQuizQuestion[];
};

export type TrainingDetail = {
  slug: string;
  href: string;
  title: LocalizedString;
  summary: LocalizedString;
  modules: TrainingModule[];
  quizUi: TrainingQuizUi;
  /**
   * Locale-doc id for completion certificate (preferred over hardcoded paths).
   * Resolved via `resolveLocaleDoc` — missing locale → unavailable, not silent swap.
   */
  certificateDocId?: LocaleDocId;
  /** @deprecated Prefer certificateDocId; kept for transitional references. */
  certificatePdf?: LocalizedString;
  /** Minimum overall score percent to unlock certificate (default 80). */
  passThresholdPercent?: number;
  /**
   * When false, hide the forward-seek tip under the player.
   * Anti-seek / watermark behavior stays enabled either way (default true).
   */
  showSeekHint?: boolean;
  /**
   * Short course code for named PDF numbers (e.g. RA → ESOSH-RA-2026-000001).
   * When set, certificate is generated (named PDF) instead of static locale docs.
   */
  courseCode?: string;
  /** Certificate duration lines (not derived from video length). */
  duration?: { uk: string; en: string };
  /**
   * ALL-CAPS titles on the PDF; if omitted, `title.uk`/`title.en` are uppercased.
   */
  certificateTitles?: { uk: string; en: string };
};

export type PublicTrainingDetail = Omit<TrainingDetail, "modules"> & {
  modules: PublicTrainingModule[];
};

/** RU: Рівень у каталозі лістингу. EN: Listing catalog tier. */
export type TrainingTier = "basic" | "professional";

export type TrainingListItem = {
  slug: string;
  href: string;
  title: LocalizedString;
  summary: LocalizedString;
  /** Drives listing sections (basic vs professional). */
  tier: TrainingTier;
};
