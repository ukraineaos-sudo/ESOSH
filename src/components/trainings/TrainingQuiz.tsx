"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type {
  LocaleCode,
  QuizOptionId,
  QuizQuestion,
  TrainingQuizUi,
} from "@/content/trainings/types";

const OPTION_IDS: QuizOptionId[] = ["A", "B", "C"];
const DEFAULT_PASS_THRESHOLD = 80;

type Props = {
  locale: LocaleCode;
  questions: QuizQuestion[];
  ui: TrainingQuizUi;
  /** Locale-matched static certificate PDF under /public. */
  certificateUrl?: string;
  /** Minimum score percent required to show the download button. */
  passThresholdPercent?: number;
};

type Answers = Record<number, QuizOptionId | undefined>;

/** RU: Клієнтський квіз A/B/C без збереження на сервері. EN: Client-side A/B/C quiz, no server persistence. */
export function TrainingQuiz({
  locale,
  questions,
  ui,
  certificateUrl,
  passThresholdPercent = DEFAULT_PASS_THRESHOLD,
}: Props) {
  const t = useTranslations("trainings");
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

  function onSelect(questionId: number, option: QuizOptionId) {
    if (submitted) return;
    setShowIncomplete(false);
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  }

  function onSubmit() {
    const complete = questions.every((q) => answers[q.id] != null);
    if (!complete) {
      setShowIncomplete(true);
      return;
    }
    setShowIncomplete(false);
    setSubmitted(true);
  }

  function onReset() {
    setAnswers({});
    setSubmitted(false);
    setShowIncomplete(false);
  }

  const scoreText = results
    ? ui.scoreLabel[locale]
        .replace("{score}", String(results.score))
        .replace("{total}", String(results.total))
    : null;

  const canDownloadCertificate =
    results != null &&
    Boolean(certificateUrl) &&
    results.scorePercent >= passThresholdPercent;

  return (
    <section className="training-quiz" aria-labelledby="training-quiz-title">
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
              <fieldset className="training-quiz__fieldset">
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
                          disabled={submitted}
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

      {submitted && results && !canDownloadCertificate && certificateUrl ? (
        <p className="training-quiz__cert-hint" role="status">
          {t("certificateThresholdHint", { threshold: passThresholdPercent })}
        </p>
      ) : null}

      <div className="training-quiz__actions">
        {!submitted ? (
          <button type="button" className="btn is--primary w-button" onClick={onSubmit}>
            {ui.submit[locale]}
          </button>
        ) : (
          <>
            {canDownloadCertificate && certificateUrl ? (
              <a className="btn is--primary w-button" href={certificateUrl} download>
                {t("downloadCertificate")}
              </a>
            ) : null}
            <button type="button" className="btn is--tertiary w-button" onClick={onReset}>
              {ui.reset[locale]}
            </button>
          </>
        )}
      </div>
    </section>
  );
}
