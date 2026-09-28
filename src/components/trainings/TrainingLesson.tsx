"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { TrainingQuiz } from "@/components/trainings/TrainingQuiz";
import {
  TrainingStatusMark,
  YoutubeConsentEmbed,
} from "@/components/trainings/YoutubeConsentEmbed";
import type { LocaleCode, TrainingDetail } from "@/content/trainings/types";

type Props = {
  locale: LocaleCode;
  training: TrainingDetail;
};

type QuizOutcome = {
  score: number;
  total: number;
  scorePercent: number;
};

function doneStorageKey(slug: string) {
  return `esosh-training-video-done-v1:${slug}`;
}

/** RU: Відео → тест → сертифікат з перевіркою прогресу. EN: Video → quiz → certificate progress gate. */
export function TrainingLesson({ locale, training }: Props) {
  const t = useTranslations("trainings");
  const [videoDone, setVideoDone] = useState(false);
  const [quizOutcome, setQuizOutcome] = useState<QuizOutcome | null>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(doneStorageKey(training.slug)) === "1") {
        setVideoDone(true);
      }
    } catch {
      /* ignore */
    }
  }, [training.slug]);

  const onVideoCompleted = useCallback(() => {
    setVideoDone(true);
    try {
      sessionStorage.setItem(doneStorageKey(training.slug), "1");
    } catch {
      /* ignore */
    }
  }, [training.slug]);

  const threshold = training.passThresholdPercent ?? 80;
  const certificateUrl =
    locale === "en" ? training.certificatePdf?.en : training.certificatePdf?.uk;
  const quizPassed = quizOutcome != null && quizOutcome.scorePercent >= threshold;
  const canDownload = videoDone && quizPassed && Boolean(certificateUrl);

  const quizStatusLabel =
    quizOutcome == null
      ? t("quizNotPassed")
      : t("quizPassedScore", {
          score: quizOutcome.score,
          total: quizOutcome.total,
          percent: Math.round(quizOutcome.scorePercent),
        });

  return (
    <div className="training-lesson">
      <YoutubeConsentEmbed
        locale={locale}
        videoId={training.youtubeId}
        title={training.videoTitle[locale]}
        completed={videoDone}
        onCompleted={onVideoCompleted}
      />

      {!videoDone ? (
        <p className="training-lesson__lock-hint regular-s" role="status">
          {t("quizLockedHint")}
        </p>
      ) : null}

      <TrainingQuiz
        locale={locale}
        questions={training.quiz}
        ui={training.quizUi}
        locked={!videoDone}
        onResultChange={setQuizOutcome}
        passThresholdPercent={threshold}
      />

      <div className="training-lesson__footer-status">
        <TrainingStatusMark done={quizOutcome != null} label={quizStatusLabel} />
      </div>

      <div className="training-lesson__cert">
        {canDownload && certificateUrl ? (
          <a className="btn is--primary w-button" href={certificateUrl} download>
            {t("downloadCertificate")}
          </a>
        ) : (
          <>
            <button type="button" className="btn is--primary w-button" disabled>
              {t("downloadCertificate")}
            </button>
            <p className="training-quiz__cert-hint" role="status">
              {!videoDone
                ? t("certNeedVideo")
                : quizOutcome == null
                  ? t("certNeedQuiz")
                  : t("certificateThresholdHint", { threshold })}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
