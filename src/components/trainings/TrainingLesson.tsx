"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { TrainingQuiz } from "@/components/trainings/TrainingQuiz";
import {
  TrainingStatusMark,
  YoutubeConsentEmbed,
} from "@/components/trainings/YoutubeConsentEmbed";
import type {
  LocaleCode,
  PublicTrainingDetail,
  PublicTrainingModule,
  QuizOptionId,
} from "@/content/trainings/types";
import { pickLocalized } from "@/content/trainings/types";
import { resolveLocaleDoc } from "@/lib/docs";

type Props = {
  locale: LocaleCode;
  training: PublicTrainingDetail;
};

type QuizOutcome = {
  score: number;
  total: number;
  scorePercent: number;
  answers: Record<string, QuizOptionId>;
};

function moduleVideoKey(slug: string, moduleId: string) {
  return `esosh-training-video-done-v1:${slug}:${moduleId}`;
}

/** Legacy single-module key used before modular trainings. */
function legacyVideoKey(slug: string) {
  return `esosh-training-video-done-v1:${slug}`;
}

function certNameStorageKey(slug: string) {
  return `esosh-training-cert-name-v1:${slug}`;
}

function normalizeNamePart(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function isNameReady(firstName: string, lastName: string) {
  return normalizeNamePart(firstName).length >= 2 && normalizeNamePart(lastName).length >= 2;
}

function emptyOutcomes(modules: PublicTrainingModule[]): Record<string, QuizOutcome | null> {
  const map: Record<string, QuizOutcome | null> = {};
  for (const mod of modules) map[mod.id] = null;
  return map;
}

/** RU: Модулі відео→тест → ПІБ → сертифікат. EN: Modules video→quiz → name → certificate. */
export function TrainingLesson({ locale, training }: Props) {
  const t = useTranslations("trainings");
  const firstNameId = useId();
  const lastNameId = useId();
  const modules = training.modules;
  const [videoDoneByModule, setVideoDoneByModule] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    for (const mod of modules) map[mod.id] = false;
    return map;
  });
  const [quizByModule, setQuizByModule] = useState<Record<string, QuizOutcome | null>>(() =>
    emptyOutcomes(modules),
  );
  const [certificateToken, setCertificateToken] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    try {
      const nextVideo: Record<string, boolean> = {};
      for (const mod of modules) {
        const key = moduleVideoKey(training.slug, mod.id);
        let done = sessionStorage.getItem(key) === "1";
        if (!done && modules.length === 1 && mod.id === modules[0]?.id) {
          done = sessionStorage.getItem(legacyVideoKey(training.slug)) === "1";
        }
        nextVideo[mod.id] = done;
      }
      setVideoDoneByModule(nextVideo);

      const raw = sessionStorage.getItem(certNameStorageKey(training.slug));
      if (raw) {
        const parsed = JSON.parse(raw) as { firstName?: string; lastName?: string };
        if (typeof parsed.firstName === "string") setFirstName(parsed.firstName);
        if (typeof parsed.lastName === "string") setLastName(parsed.lastName);
      }
    } catch {
      /* ignore */
    }
  }, [modules, training.slug]);

  const persistCertName = useCallback(
    (nextFirst: string, nextLast: string) => {
      try {
        sessionStorage.setItem(
          certNameStorageKey(training.slug),
          JSON.stringify({ firstName: nextFirst, lastName: nextLast }),
        );
      } catch {
        /* ignore */
      }
    },
    [training.slug],
  );

  const markVideoDone = useCallback(
    (moduleId: string) => {
      setVideoDoneByModule((prev) => ({ ...prev, [moduleId]: true }));
      try {
        sessionStorage.setItem(moduleVideoKey(training.slug, moduleId), "1");
        if (modules.length === 1) {
          sessionStorage.setItem(legacyVideoKey(training.slug), "1");
        }
      } catch {
        /* ignore */
      }
    },
    [modules.length, training.slug],
  );

  const threshold = training.passThresholdPercent ?? 80;
  const certificateResolution = training.certificateDocId
    ? resolveLocaleDoc(training.certificateDocId, locale)
    : null;
  const hasCertificateAsset =
    certificateResolution?.status === "available" ||
    Boolean(pickLocalized(training.certificatePdf, locale));

  const totals = useMemo(() => {
    let score = 0;
    let total = 0;
    let allSubmitted = true;
    for (const mod of modules) {
      if (mod.quiz.length === 0) continue;
      const outcome = quizByModule[mod.id];
      if (!outcome) {
        allSubmitted = false;
        continue;
      }
      score += outcome.score;
      total += outcome.total;
    }
    const scorePercent = total > 0 ? (score / total) * 100 : 0;
    return { score, total, scorePercent, allSubmitted };
  }, [modules, quizByModule]);

  const siblingAnswers = useMemo(() => {
    const map: Record<string, Record<string, string>> = {};
    for (const [moduleId, outcome] of Object.entries(quizByModule)) {
      if (outcome?.answers) map[moduleId] = outcome.answers;
    }
    return map;
  }, [quizByModule]);

  const allVideosDone = modules.every((mod) => {
    if (!mod.youtubeId.trim()) return true;
    return Boolean(videoDoneByModule[mod.id]);
  });
  const quizPassed = totals.allSubmitted && totals.scorePercent >= threshold;
  const courseComplete = allVideosDone && quizPassed;
  const canDownload = courseComplete && hasCertificateAsset && Boolean(certificateToken);
  const nameReady = isNameReady(firstName, lastName);
  const canDownloadNamed = canDownload && nameReady;
  const certificateHref = certificateToken
    ? `/api/trainings/${encodeURIComponent(training.slug)}/certificate?token=${encodeURIComponent(certificateToken)}&locale=${encodeURIComponent(locale)}`
    : null;

  const overallStatusLabel = !totals.allSubmitted
    ? t("quizNotPassed")
    : t("quizPassedScore", {
        score: totals.score,
        total: totals.total,
        percent: Math.round(totals.scorePercent),
      });

  function isModuleUnlocked(index: number): boolean {
    if (index === 0) return true;
    const prev = modules[index - 1];
    if (!prev) return false;
    // Empty shell: show all module slots until video/quiz are filled in.
    if (!prev.youtubeId.trim() && prev.quiz.length === 0) return true;
    const prevVideoOk = !prev.youtubeId.trim() || Boolean(videoDoneByModule[prev.id]);
    const prevQuizOk = prev.quiz.length === 0 || Boolean(quizByModule[prev.id]);
    return prevVideoOk && prevQuizOk;
  }

  function certHint(): string {
    if (!allVideosDone) return t("certNeedVideo");
    if (!totals.allSubmitted) return t("certNeedQuiz");
    if (totals.allSubmitted && totals.scorePercent < threshold) {
      return t("certificateThresholdHint", { threshold });
    }
    if (!hasCertificateAsset || certificateResolution?.status === "unavailable") {
      return t("certPending");
    }
    if (!certificateToken) return t("certNeedQuiz");
    return t("certificateThresholdHint", { threshold });
  }

  function renderNameFields() {
    return (
      <div className="training-lesson__cert-name">
        <p className="training-lesson__cert-name-label regular-s">{t("certificateNameLabel")}</p>
        <div className="training-lesson__cert-name-row">
          <label className="training-lesson__cert-field" htmlFor={lastNameId}>
            <input
              id={lastNameId}
              className="form-input text-field w-input"
              type="text"
              name="certificateLastName"
              autoComplete="family-name"
              aria-label={t("certificateLastNameLabel")}
              value={lastName}
              placeholder={t("certificateLastNamePlaceholder")}
              onChange={(event) => {
                const value = event.target.value;
                setLastName(value);
                persistCertName(firstName, value);
              }}
            />
          </label>
          <label className="training-lesson__cert-field" htmlFor={firstNameId}>
            <input
              id={firstNameId}
              className="form-input text-field w-input"
              type="text"
              name="certificateFirstName"
              autoComplete="given-name"
              aria-label={t("certificateFirstNameLabel")}
              value={firstName}
              placeholder={t("certificateFirstNamePlaceholder")}
              onChange={(event) => {
                const value = event.target.value;
                setFirstName(value);
                persistCertName(value, lastName);
              }}
            />
          </label>
        </div>
        <p className="training-lesson__cert-name-example" aria-hidden="true">
          {t("certificateNameExample")}
        </p>
        <p className="training-quiz__cert-hint regular-s" role="note">
          {t("certificateParticipationNote")}
        </p>
      </div>
    );
  }

  return (
    <div className="training-lesson">
      {modules.map((mod, index) => {
        const unlocked = isModuleUnlocked(index);
        const videoDone = Boolean(videoDoneByModule[mod.id]);
        const hasVideo = mod.youtubeId.trim().length > 0;
        const showModuleChrome = modules.length > 1;

        return (
          <section
            key={mod.id}
            className={`training-module${unlocked ? "" : " is-locked"}`}
            aria-labelledby={showModuleChrome ? `training-module-${mod.id}` : undefined}
          >
            {showModuleChrome ? (
              <header className="training-module__header">
                <p className="training-module__eyebrow regular-s">
                  {t("moduleLabel", { index: index + 1, total: modules.length })}
                </p>
                <h2 id={`training-module-${mod.id}`} className="h3 training-module__title">
                  {pickLocalized(mod.title, locale) ?? t("contentPending")}
                </h2>
              </header>
            ) : null}

            {!unlocked ? (
              <p className="training-lesson__lock-hint regular-s" role="status">
                {t("moduleLockedHint")}
              </p>
            ) : null}

            {unlocked && !hasVideo ? (
              <p className="training-module__video-pending regular-s" role="status">
                {t("videoPending")}
              </p>
            ) : null}

            {unlocked && hasVideo ? (
              <YoutubeConsentEmbed
                locale={locale}
                videoId={mod.youtubeId}
                title={pickLocalized(mod.videoTitle, locale) ?? t("contentPending")}
                completed={videoDone}
                onCompleted={() => markVideoDone(mod.id)}
              />
            ) : null}

            {unlocked && hasVideo && !videoDone ? (
              <p className="training-lesson__lock-hint regular-s" role="status">
                {t("quizLockedHint")}
              </p>
            ) : null}

            {unlocked && hasVideo && videoDone && mod.quiz.length === 0 ? (
              <p className="training-module__video-pending regular-s" role="status">
                {t("quizPending")}
              </p>
            ) : null}

            {unlocked && !hasVideo && mod.quiz.length === 0 ? (
              <p className="training-module__video-pending regular-s" role="status">
                {t("quizPending")}
              </p>
            ) : null}

            {unlocked && mod.quiz.length > 0 ? (
              <TrainingQuiz
                locale={locale}
                slug={training.slug}
                moduleId={mod.id}
                questions={mod.quiz}
                ui={training.quizUi}
                locked={hasVideo && !videoDone}
                siblingAnswers={siblingAnswers}
                onResultChange={(result) => {
                  setQuizByModule((prev) => {
                    const previous = prev[mod.id];
                    if (result == null && previous == null) return prev;
                    if (
                      result &&
                      previous &&
                      result.score === previous.score &&
                      result.total === previous.total &&
                      result.scorePercent === previous.scorePercent
                    ) {
                      return prev;
                    }
                    if (!result) return { ...prev, [mod.id]: null };
                    return {
                      ...prev,
                      [mod.id]: {
                        score: result.score,
                        total: result.total,
                        scorePercent: result.scorePercent,
                        answers: result.answers,
                      },
                    };
                  });
                  if (result?.certificateToken) {
                    setCertificateToken(result.certificateToken);
                  } else if (!result) {
                    setCertificateToken(null);
                  }
                }}
                passThresholdPercent={threshold}
              />
            ) : null}
          </section>
        );
      })}

      <div className="training-lesson__footer-status">
        <TrainingStatusMark done={totals.allSubmitted} label={overallStatusLabel} />
      </div>

      <div className="training-lesson__cert">
        {courseComplete ? (
          <>
            {renderNameFields()}
            {canDownloadNamed && certificateHref ? (
              <a className="btn is--primary w-button" href={certificateHref}>
                {t("downloadCertificate")}
              </a>
            ) : (
              <button type="button" className="btn is--primary w-button" disabled>
                {t("downloadCertificate")}
              </button>
            )}
            {!nameReady ? (
              <p className="training-quiz__cert-hint" role="status">
                {t("certNeedName")}
              </p>
            ) : !hasCertificateAsset ? (
              <p className="training-quiz__cert-hint" role="status">
                {t("certPending")}
              </p>
            ) : !certificateToken ? (
              <p className="training-quiz__cert-hint" role="status">
                {t("certNeedQuiz")}
              </p>
            ) : null}
          </>
        ) : (
          <>
            <button type="button" className="btn is--primary w-button" disabled>
              {t("downloadCertificate")}
            </button>
            <p className="training-quiz__cert-hint" role="status">
              {certHint()}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
