"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type {
  LocaleCode,
  PublicQuizQuestion,
  QuizOptionId,
  TrainingQuizUi,
} from "@/content/trainings/types";
import { pickLocalized, pickQuizText, QUIZ_OPTION_IDS } from "@/content/trainings/types";

const DEFAULT_PASS_THRESHOLD = 80;
const ERROR_COOLDOWN_SEC = 3;
const DEFAULT_OPTION_PREFIX: Record<QuizOptionId, string> = {
  A: "A",
  B: "B",
  C: "C",
  D: "D",
  E: "E",
};

export type TrainingQuizQuestionReview = {
  questionId: number;
  selected: QuizOptionId | null;
  correct: QuizOptionId;
  isCorrect: boolean;
};

export type TrainingQuizResult = {
  score: number;
  total: number;
  scorePercent: number;
  answers: Record<string, QuizOptionId>;
  review?: TrainingQuizQuestionReview[];
  certificateToken?: string | null;
} | null;

type ScoreErrorKind = "generic" | "too_many" | "unavailable" | "network";

type Props = {
  locale: LocaleCode;
  slug: string;
  moduleId: string;
  questions: PublicQuizQuestion[];
  ui: TrainingQuizUi;
  /** When true, answers cannot be changed (video not finished). */
  locked?: boolean;
  passThresholdPercent?: number;
  /** Restore UI after reload from progress cookie / sessionStorage. */
  initialResult?: {
    score: number;
    total: number;
    scorePercent: number;
  } | null;
  onResultChange?: (result: TrainingQuizResult) => void;
};

type Answers = Record<number, QuizOptionId | undefined>;

function optionIdsForQuestion(q: PublicQuizQuestion): QuizOptionId[] {
  return QUIZ_OPTION_IDS.filter((id) => q.options[id] != null);
}

function isQuizOptionId(value: unknown): value is QuizOptionId {
  return typeof value === "string" && (QUIZ_OPTION_IDS as readonly string[]).includes(value);
}

function parseReviewPayload(raw: unknown): TrainingQuizQuestionReview[] | null {
  if (!Array.isArray(raw)) return null;
  const out: TrainingQuizQuestionReview[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as {
      questionId?: unknown;
      selected?: unknown;
      correct?: unknown;
      isCorrect?: unknown;
    };
    if (typeof row.questionId !== "number" || !Number.isFinite(row.questionId)) continue;
    if (!isQuizOptionId(row.correct)) continue;
    if (typeof row.isCorrect !== "boolean") continue;
    const selected =
      row.selected == null || row.selected === ""
        ? null
        : isQuizOptionId(row.selected)
          ? row.selected
          : null;
    out.push({
      questionId: row.questionId,
      selected,
      correct: row.correct,
      isCorrect: row.isCorrect,
    });
  }
  return out.length > 0 ? out : null;
}

/** RU: Квіз 3–5 варіантів; оцінка на сервері. EN: Quiz with server-side scoring. */
export function TrainingQuiz({
  locale,
  slug,
  moduleId,
  questions,
  ui,
  locked = false,
  passThresholdPercent = DEFAULT_PASS_THRESHOLD,
  initialResult = null,
  onResultChange,
}: Props) {
  const t = useTranslations("trainings");
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(() => Boolean(initialResult));
  const [showIncomplete, setShowIncomplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cooldownSec, setCooldownSec] = useState(0);
  const [scoreError, setScoreError] = useState<ScoreErrorKind | null>(null);
  const [retryAfterSec, setRetryAfterSec] = useState<number | null>(null);
  const [results, setResults] = useState<{
    score: number;
    total: number;
    scorePercent: number;
  } | null>(() =>
    initialResult
      ? {
          score: initialResult.score,
          total: initialResult.total,
          scorePercent: initialResult.scorePercent,
        }
      : null,
  );
  const [review, setReview] = useState<TrainingQuizQuestionReview[] | null>(null);
  const optionPrefix = { ...DEFAULT_OPTION_PREFIX, ...ui.optionPrefix };
  const onResultChangeRef = useRef(onResultChange);
  onResultChangeRef.current = onResultChange;
  const hydratedRef = useRef(false);
  /** Sync lock: React state alone can miss a second click before re-render. */
  const inFlightRef = useRef(false);
  const cooldownTimerRef = useRef<number | null>(null);

  void passThresholdPercent;

  useEffect(() => {
    if (hydratedRef.current || !initialResult) return;
    hydratedRef.current = true;
    setResults({
      score: initialResult.score,
      total: initialResult.total,
      scorePercent: initialResult.scorePercent,
    });
    setSubmitted(true);
  }, [initialResult]);

  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current != null) {
        window.clearInterval(cooldownTimerRef.current);
      }
    };
  }, []);

  function emitResult(next: TrainingQuizResult) {
    onResultChangeRef.current?.(next);
  }

  function startCooldown(seconds: number) {
    if (cooldownTimerRef.current != null) {
      window.clearInterval(cooldownTimerRef.current);
      cooldownTimerRef.current = null;
    }
    const safe = Math.max(0, Math.floor(seconds));
    if (safe <= 0) {
      setCooldownSec(0);
      return;
    }
    setCooldownSec(safe);
    cooldownTimerRef.current = window.setInterval(() => {
      setCooldownSec((prev) => {
        if (prev <= 1) {
          if (cooldownTimerRef.current != null) {
            window.clearInterval(cooldownTimerRef.current);
            cooldownTimerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function onSelect(questionId: number, option: QuizOptionId) {
    if (submitted || locked || submitting || inFlightRef.current) return;
    setShowIncomplete(false);
    setScoreError(null);
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  }

  async function onSubmit() {
    if (locked || submitted || submitting || inFlightRef.current || cooldownSec > 0) return;
    if (scoreError === "too_many") return;

    const complete = questions.every((q) => answers[q.id] != null);
    if (!complete) {
      setShowIncomplete(true);
      return;
    }

    inFlightRef.current = true;
    setShowIncomplete(false);
    setScoreError(null);
    setRetryAfterSec(null);
    setSubmitting(true);

    const payloadAnswers: Record<string, QuizOptionId> = {};
    for (const q of questions) {
      const selected = answers[q.id];
      if (selected) payloadAnswers[String(q.id)] = selected;
    }

    try {
      const response = await fetch(`/api/trainings/${encodeURIComponent(slug)}/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          moduleId,
          answers: payloadAnswers,
        }),
      });

      let data: {
        ok?: boolean;
        error?: string;
        score?: number;
        total?: number;
        scorePercent?: number;
        review?: unknown;
        certificateToken?: string | null;
        retryAfterSec?: number;
      } = {};
      try {
        data = (await response.json()) as typeof data;
      } catch {
        data = {};
      }

      if (!response.ok) {
        if (response.status === 429 || data.error === "too_many_attempts" || data.error === "rate_limited") {
          setScoreError("too_many");
          let retry = 0;
          if (typeof data.retryAfterSec === "number" && data.retryAfterSec > 0) {
            retry = data.retryAfterSec;
          } else {
            const header = response.headers.get("Retry-After");
            const parsed = header ? Number(header) : NaN;
            retry = Number.isFinite(parsed) && parsed > 0 ? parsed : 3600;
          }
          setRetryAfterSec(retry);
          // Do not invite spam clicks that would keep hitting the server budget.
          startCooldown(Math.min(retry, 3600));
        } else if (response.status === 503 || data.error === "unavailable") {
          setScoreError("unavailable");
          startCooldown(ERROR_COOLDOWN_SEC);
        } else {
          setScoreError("generic");
          startCooldown(ERROR_COOLDOWN_SEC);
        }
        return;
      }

      if (!data.ok || typeof data.score !== "number" || typeof data.total !== "number") {
        setScoreError("generic");
        startCooldown(ERROR_COOLDOWN_SEC);
        return;
      }
      const nextReview = parseReviewPayload(data.review);
      setResults({
        score: data.score,
        total: data.total,
        scorePercent: typeof data.scorePercent === "number" ? data.scorePercent : 0,
      });
      setReview(nextReview);
      setSubmitted(true);
      emitResult({
        score: data.score,
        total: data.total,
        scorePercent: typeof data.scorePercent === "number" ? data.scorePercent : 0,
        answers: payloadAnswers,
        review: nextReview ?? undefined,
        certificateToken: data.certificateToken,
      });
    } catch {
      setScoreError("network");
      startCooldown(ERROR_COOLDOWN_SEC);
    } finally {
      inFlightRef.current = false;
      setSubmitting(false);
    }
  }

  function onReset() {
    if (locked || submitting || inFlightRef.current) return;
    setAnswers({});
    setSubmitted(false);
    setShowIncomplete(false);
    setScoreError(null);
    setRetryAfterSec(null);
    setCooldownSec(0);
    if (cooldownTimerRef.current != null) {
      window.clearInterval(cooldownTimerRef.current);
      cooldownTimerRef.current = null;
    }
    setResults(null);
    setReview(null);
    emitResult(null);
  }

  const scoreTemplate = pickLocalized(ui.scoreLabel, locale);
  const scoreText =
    results && scoreTemplate
      ? scoreTemplate
          .replace("{score}", String(results.score))
          .replace("{total}", String(results.total))
      : null;

  const title = pickLocalized(ui.title, locale);
  if (!title) {
    return (
      <p className="training-module__video-pending regular-s" role="status">
        {t("contentPending")}
      </p>
    );
  }

  const retryHours =
    retryAfterSec != null ? Math.max(1, Math.ceil(retryAfterSec / 3600)) : null;

  let scoreErrorText: string | null = null;
  if (scoreError === "too_many") {
    scoreErrorText =
      retryHours != null
        ? t("quizScoreErrorTooManyAttemptsHours", { hours: retryHours })
        : t("quizScoreErrorTooManyAttempts");
  } else if (scoreError === "unavailable") {
    scoreErrorText = t("quizScoreErrorUnavailable");
  } else if (scoreError === "network") {
    scoreErrorText = t("quizScoreErrorNetwork");
  } else if (scoreError === "generic") {
    scoreErrorText = t("quizScoreError");
  }

  const submitBlocked =
    locked || submitting || inFlightRef.current || cooldownSec > 0 || scoreError === "too_many";

  let submitLabel = pickLocalized(ui.submit, locale);
  if (submitting) submitLabel = t("quizScoring");
  else if (cooldownSec > 0 && scoreError !== "too_many") {
    submitLabel = t("quizScoreCooldown", { seconds: cooldownSec });
  }

  return (
    <section
      className={`training-quiz${locked ? " is-locked" : ""}`}
      aria-labelledby="training-quiz-title"
      aria-disabled={locked}
      aria-busy={submitting || undefined}
    >
      <h2 id="training-quiz-title" className="h2 is--margin-bottom-24">
        {title}
      </h2>

      <ol className="training-quiz__list">
        {questions.map((q) => {
          const selected = answers[q.id];
          const questionText = pickQuizText(q.question, locale);
          const optionIds = optionIdsForQuestion(q);
          const itemReview = review?.find((row) => row.questionId === q.id) ?? null;
          const itemClass = itemReview
            ? `training-quiz__item${itemReview.isCorrect ? " is-correct" : " is-wrong"}`
            : "training-quiz__item";
          const feedbackLabel = itemReview
            ? pickLocalized(itemReview.isCorrect ? ui.correctLabel : ui.wrongLabel, locale)
            : null;
          return (
            <li key={q.id} className={itemClass}>
              <p className="training-quiz__question regular-m">{questionText}</p>
              <div className="training-quiz__options" role="radiogroup" aria-label={questionText}>
                {optionIds.map((optionId) => {
                  const optionMap = q.options[optionId];
                  if (!optionMap) return null;
                  const optionText = pickQuizText(optionMap, locale);
                  const id = `q${q.id}-${optionId}`;
                  const optionClass = [
                    "training-quiz__option",
                    itemReview && optionId === itemReview.correct ? "is-key" : null,
                    itemReview &&
                    !itemReview.isCorrect &&
                    optionId === itemReview.selected
                      ? "is-picked-wrong"
                      : null,
                  ]
                    .filter(Boolean)
                    .join(" ");
                  return (
                    <label key={optionId} className={optionClass} htmlFor={id}>
                      <input
                        id={id}
                        type="radio"
                        name={`q-${moduleId}-${q.id}`}
                        value={optionId}
                        checked={selected === optionId || itemReview?.selected === optionId}
                        disabled={locked || submitted || submitting}
                        onChange={() => onSelect(q.id, optionId)}
                      />
                      <span>
                        <span className="training-quiz__option-letter">{optionPrefix[optionId]}.</span>{" "}
                        <span className="training-quiz__option-text">{optionText}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
              {feedbackLabel ? (
                <p
                  className={`training-quiz__feedback regular-s${itemReview?.isCorrect ? " is-correct" : " is-wrong"}`}
                  role="status"
                >
                  {feedbackLabel}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>

      {showIncomplete ? (
        <p className="training-quiz__incomplete regular-s" role="alert">
          {pickLocalized(ui.incomplete, locale)}
        </p>
      ) : null}

      {scoreErrorText ? (
        <p className="training-quiz__incomplete regular-s" role="alert">
          {scoreErrorText}
        </p>
      ) : null}

      {submitting ? (
        <p className="training-quiz__score regular-s" role="status" aria-live="polite">
          {t("quizScoreProcessing")}
        </p>
      ) : null}

      {scoreText ? (
        <p className="training-quiz__score regular-m" role="status">
          {scoreText}
        </p>
      ) : null}

      <div className="training-quiz__actions">
        {!submitted ? (
          <button
            type="button"
            className="btn is--primary w-button"
            onClick={() => void onSubmit()}
            disabled={submitBlocked}
            aria-busy={submitting || undefined}
          >
            {submitLabel}
          </button>
        ) : (
          <button
            type="button"
            className="btn is--primary w-button"
            onClick={onReset}
            disabled={locked || submitting}
          >
            {pickLocalized(ui.reset, locale)}
          </button>
        )}
      </div>
    </section>
  );
}
