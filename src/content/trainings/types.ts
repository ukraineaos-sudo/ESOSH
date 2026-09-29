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
 * Quiz copy follows the video language (uk for current courses).
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
};

export type TrainingListItem = {
  slug: string;
  href: string;
  title: LocalizedString;
  summary: LocalizedString;
};
