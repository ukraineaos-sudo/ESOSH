"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type {
  LocaleCode,
  PublicQuizQuestion,
  QuizOptionId,
  TrainingQuizUi,
} from "@/content/trainings/types";
import { pickLocalized, pickQuizText, QUIZ_OPTION_IDS } from "@/content/trainings/types";

const DEFAULT_PASS_THRESHOLD = 80;
const DEFAULT_OPTION_PREFIX: Record<QuizOptionId, string> = {
  A: "A",
  B: "B",
  C: "C",
  D: "D",
  E: "E",
};

export type TrainingQuizResult = {
  score: number;
  total: number;
  scorePercent: number;
  answers: Record<string, QuizOptionId>;
  certificateToken?: string | null;
} | null;

type Props = {
  locale: LocaleCode;
  slug: string;
  moduleId: string;
  questions: PublicQuizQuestion[];
  ui: TrainingQuizUi;
  /** When true, answers cannot be changed (video not finished). */
  locked?: boolean;
  passThresholdPercent?: number;
  /** Other modules' answers for overall unlock token. */
  siblingAnswers?: Record<string, Record<string, string>>;
  onResultChange?: (result: TrainingQuizResult) => void;
};

type Answers = Record<number, QuizOptionId | undefined>;

function optionIdsForQuestion(q: PublicQuizQuestion): QuizOptionId[] {
  return QUIZ_OPTION_IDS.filter((id) => q.options[id] != null);
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
  siblingAnswers,
  onResultChange,
}: Props) {
  const t = useTranslations("trainings");
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [showIncomplete, setShowIncomplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [scoreError, setScoreError] = useState(false);
  const [results, setResults] = useState<{
    score: number;
    total: number;
    scorePercent: number;
    byId: Record<number, boolean>;
  } | null>(null);
  const optionPrefix = { ...DEFAULT_OPTION_PREFIX, ...ui.optionPrefix };
  const onResultChangeRef = useRef(onResultChange);
  onResultChangeRef.current = onResultChange;

  void passThresholdPercent;

  function emitResult(next: TrainingQuizResult) {
    onResultChangeRef.current?.(next);
  }

  function onSelect(questionId: number, option: QuizOptionId) {
    if (submitted || locked || submitting) return;
    setShowIncomplete(false);
    setScoreError(false);
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  }

  async function onSubmit() {
    if (locked || submitting) return;
    const complete = questions.every((q) => answers[q.id] != null);
    if (!complete) {
      setShowIncomplete(true);
      return;
    }
    setShowIncomplete(false);
    setScoreError(false);
    setSubmitting(true);

    const payloadAnswers: Record<string, QuizOptionId> = {};
    for (const q of questions) {
      const selected = answers[q.id];
      if (selected) payloadAnswers[String(q.id)] = selected;
    }

    try {
      const allModuleAnswers = {
        ...(siblingAnswers || {}),
        [moduleId]: payloadAnswers,
      };
      const response = await fetch(`/api/trainings/${encodeURIComponent(slug)}/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId,
          answers: payloadAnswers,
          allModuleAnswers,
        }),
      });
      if (!response.ok) {
        setScoreError(true);
        return;
      }
      const data = (await response.json()) as {
        ok?: boolean;
        score?: number;
        total?: number;
        scorePercent?: number;
        byId?: Record<number, boolean>;
        certificateToken?: string | null;
      };
      if (!data.ok || typeof data.score !== "number" || typeof data.total !== "number") {
        setScoreError(true);
        return;
      }
      setResults({
        score: data.score,
        total: data.total,
        scorePercent: typeof data.scorePercent === "number" ? data.scorePercent : 0,
        byId: data.byId || {},
      });
      setSubmitted(true);
      emitResult({
        score: data.score,
        total: data.total,
        scorePercent: typeof data.scorePercent === "number" ? data.scorePercent : 0,
        answers: payloadAnswers,
        certificateToken: data.certificateToken,
      });
    } catch {
      setScoreError(true);
    } finally {
      setSubmitting(false);
    }
  }

  function onReset() {
    if (locked || submitting) return;
    setAnswers({});
    setSubmitted(false);
    setShowIncomplete(false);
    setScoreError(false);
    setResults(null);
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

  return (
    <section
      className={`training-quiz${locked ? " is-locked" : ""}`}
      aria-labelledby="training-quiz-title"
      aria-disabled={locked}
    >
      <h2 id="training-quiz-title" className="h2 is--margin-bottom-24">
        {title}
      </h2>

      <ol className="training-quiz__list">
        {questions.map((q) => {
          const selected = answers[q.id];
          const isCorrect = results?.byId[q.id];
          const statusClass =
            submitted && isCorrect === true
              ? " is-correct"
              : submitted && isCorrect === false
                ? " is-wrong"
                : "";
          const questionText = pickQuizText(q.question, locale);
          const optionIds = optionIdsForQuestion(q);
          return (
            <li key={q.id} className={`training-quiz__item${statusClass}`}>
              <p className="training-quiz__question regular-m">{questionText}</p>
              <div className="training-quiz__options" role="radiogroup" aria-label={questionText}>
                {optionIds.map((optionId) => {
                  const optionMap = q.options[optionId];
                  if (!optionMap) return null;
                  const optionText = pickQuizText(optionMap, locale);
                  const id = `q${q.id}-${optionId}`;
                  const pickedWrong =
                    submitted && selected === optionId && isCorrect === false;
                  const pickedRight =
                    submitted && selected === optionId && isCorrect === true;
                  return (
                    <label
                      key={optionId}
                      className={`training-quiz__option${pickedRight ? " is-key" : ""}${
                        pickedWrong ? " is-picked-wrong" : ""
                      }`}
                      htmlFor={id}
                    >
                      <input
                        id={id}
                        type="radio"
                        name={`q-${q.id}`}
                        value={optionId}
                        checked={selected === optionId}
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
              {submitted && isCorrect != null ? (
                <p className="training-quiz__feedback regular-s" role="status">
                  {isCorrect
                    ? pickLocalized(ui.correctLabel, locale)
                    : pickLocalized(ui.wrongLabel, locale)}
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

      {scoreError ? (
        <p className="training-quiz__incomplete regular-s" role="alert">
          {t("quizScoreError")}
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
            disabled={locked || submitting}
          >
            {submitting ? t("quizScoring") : pickLocalized(ui.submit, locale)}
          </button>
        ) : (
          <button type="button" className="btn is--primary w-button" onClick={onReset} disabled={locked}>
            {pickLocalized(ui.reset, locale)}
          </button>
        )}
      </div>
    </section>
  );
}
