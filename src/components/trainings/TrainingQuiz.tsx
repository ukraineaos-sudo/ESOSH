"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type {
  LocaleCode,
  QuizOptionId,
  QuizQuestion,
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
} | null;

type Props = {
  locale: LocaleCode;
  questions: QuizQuestion[];
  ui: TrainingQuizUi;
  /** When true, answers cannot be changed (video not finished). */
  locked?: boolean;
  passThresholdPercent?: number;
  onResultChange?: (result: TrainingQuizResult) => void;
};

type Answers = Record<number, QuizOptionId | undefined>;

function optionIdsForQuestion(q: QuizQuestion): QuizOptionId[] {
  return QUIZ_OPTION_IDS.filter((id) => q.options[id] != null);
}

/** RU: Квіз 3–5 варіантів; блокується до перегляду відео. EN: Quiz with 3–5 options; locked until video done. */
export function TrainingQuiz({
  locale,
  questions,
  ui,
  locked = false,
  passThresholdPercent = DEFAULT_PASS_THRESHOLD,
  onResultChange,
}: Props) {
  const t = useTranslations("trainings");
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [showIncomplete, setShowIncomplete] = useState(false);
  const optionPrefix = { ...DEFAULT_OPTION_PREFIX, ...ui.optionPrefix };
  const onResultChangeRef = useRef(onResultChange);
  onResultChangeRef.current = onResultChange;

  const results = useMemo(() => {
    if (!submitted) return null;
    let score = 0;
    const byId: Record<number, boolean> = {};
    for (const q of questions) {
      const ok = answers[q.id] === q.correct;
      byId[q.id] = ok;
      if (ok) score += 1;
    }
    const total = questions.length;
    const scorePercent = total > 0 ? (score / total) * 100 : 0;
    return { score, total, scorePercent, byId };
  }, [answers, questions, submitted]);

  useEffect(() => {
    const cb = onResultChangeRef.current;
    if (!cb) return;
    if (!results) {
      cb(null);
      return;
    }
    cb({
      score: results.score,
      total: results.total,
      scorePercent: results.scorePercent,
    });
  }, [results]);

  void passThresholdPercent;

  function onSelect(questionId: number, option: QuizOptionId) {
    if (submitted || locked) return;
    setShowIncomplete(false);
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  }

  function onSubmit() {
    if (locked) return;
    const complete = questions.every((q) => answers[q.id] != null);
    if (!complete) {
      setShowIncomplete(true);
      return;
    }
    setShowIncomplete(false);
    setSubmitted(true);
  }

  function onReset() {
    if (locked) return;
    setAnswers({});
    setSubmitted(false);
    setShowIncomplete(false);
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
                    submitted && selected === optionId && optionId !== q.correct;
                  const isKey = submitted && optionId === q.correct;
                  return (
                    <label
                      key={optionId}
                      className={`training-quiz__option${isKey ? " is-key" : ""}${
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
                        disabled={locked || submitted}
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

      {scoreText ? (
        <p className="training-quiz__score regular-m" role="status">
          {scoreText}
        </p>
      ) : null}

      <div className="training-quiz__actions">
        {!submitted ? (
          <button type="button" className="btn is--primary w-button" onClick={onSubmit} disabled={locked}>
            {pickLocalized(ui.submit, locale)}
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
