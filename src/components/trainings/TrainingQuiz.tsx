"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  LocaleCode,
  QuizOptionId,
  QuizQuestion,
  TrainingQuizUi,
} from "@/content/trainings/types";

const OPTION_IDS: QuizOptionId[] = ["A", "B", "C"];
const DEFAULT_PASS_THRESHOLD = 80;

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

/** RU: Клієнтський квіз A/B/C; блокується до перегляду відео. EN: Client quiz; locked until video done. */
export function TrainingQuiz({
  locale,
  questions,
  ui,
  locked = false,
  passThresholdPercent = DEFAULT_PASS_THRESHOLD,
  onResultChange,
}: Props) {
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [showIncomplete, setShowIncomplete] = useState(false);

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
    if (!onResultChange) return;
    if (!results) {
      onResultChange(null);
      return;
    }
    onResultChange({
      score: results.score,
      total: results.total,
      scorePercent: results.scorePercent,
    });
  }, [results, onResultChange]);

  // Keep threshold referenced for future UI hints without unused lint
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

  const scoreText = results
    ? ui.scoreLabel[locale]
        .replace("{score}", String(results.score))
        .replace("{total}", String(results.total))
    : null;

  return (
    <section
      className={`training-quiz${locked ? " is-locked" : ""}`}
      aria-labelledby="training-quiz-title"
      aria-disabled={locked}
    >
      <h2 id="training-quiz-title" className="h2 is--margin-bottom-24">
        {ui.title[locale]}
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

          return (
            <li key={q.id} className={`training-quiz__item${statusClass}`}>
              <fieldset className="training-quiz__fieldset" disabled={locked || submitted}>
                <legend className="training-quiz__question">
                  <span className="training-quiz__number">{q.id}.</span>{" "}
                  {q.question[locale]}
                </legend>
                <div className="training-quiz__options" role="presentation">
                  {OPTION_IDS.map((optionId) => {
                    const inputId = `quiz-q${q.id}-${optionId}`;
                    const optionIsCorrect = q.correct === optionId;
                    const optionIsSelected = selected === optionId;
                    let optionClass = "training-quiz__option";
                    if (submitted) {
                      if (optionIsCorrect) optionClass += " is-key";
                      if (optionIsSelected && !optionIsCorrect) optionClass += " is-picked-wrong";
                    }
                    return (
                      <label key={optionId} className={optionClass} htmlFor={inputId}>
                        <input
                          id={inputId}
                          type="radio"
                          name={`quiz-q${q.id}`}
                          value={optionId}
                          checked={optionIsSelected}
                          disabled={locked || submitted}
                          onChange={() => onSelect(q.id, optionId)}
                        />
                        <span className="training-quiz__option-letter">
                          {ui.optionPrefix[optionId]})
                        </span>
                        <span className="training-quiz__option-text">
                          {q.options[optionId][locale]}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {submitted ? (
                  <p
                    className={`training-quiz__feedback${isCorrect ? " is-correct" : " is-wrong"}`}
                    role="status"
                  >
                    {isCorrect ? ui.correctLabel[locale] : ui.wrongLabel[locale]}
                  </p>
                ) : null}
              </fieldset>
            </li>
          );
        })}
      </ol>

      {showIncomplete ? (
        <p className="training-quiz__incomplete" role="alert">
          {ui.incomplete[locale]}
        </p>
      ) : null}

      {scoreText ? (
        <p className="training-quiz__score" role="status">
          {scoreText}
        </p>
      ) : null}

      <div className="training-quiz__actions">
        {!submitted ? (
          <button
            type="button"
            className="btn is--primary w-button"
            onClick={onSubmit}
            disabled={locked}
          >
            {ui.submit[locale]}
          </button>
        ) : (
          <button
            type="button"
            className="btn is--tertiary w-button"
            onClick={onReset}
            disabled={locked}
          >
            {ui.reset[locale]}
          </button>
        )}
      </div>
    </section>
  );
}
