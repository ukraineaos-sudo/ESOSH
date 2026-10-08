"use client";

import { useCallback, useId, useMemo, useState } from "react";
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

type IssuedCertSession = {
  id: number;
  number: string;
  downloadToken: string;
  participantName: string;
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

function certIssuedStorageKey(slug: string) {
  return `esosh-training-cert-issued-v1:${slug}`;
}

function normalizeNamePart(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function isNameReady(firstName: string, lastName: string) {
  return normalizeNamePart(firstName).length >= 2 && normalizeNamePart(lastName).length >= 2;
}

function composeParticipantName(firstName: string, lastName: string) {
  return `${normalizeNamePart(lastName)} ${normalizeNamePart(firstName)}`.trim();
}

function emptyOutcomes(modules: PublicTrainingModule[]): Record<string, QuizOutcome | null> {
  const map: Record<string, QuizOutcome | null> = {};
  for (const mod of modules) map[mod.id] = null;
  return map;
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function readVideoDoneMap(slug: string, modules: PublicTrainingModule[]): Record<string, boolean> {
  const map: Record<string, boolean> = {};
  for (const mod of modules) map[mod.id] = false;
  if (typeof window === "undefined") return map;
  try {
    for (const mod of modules) {
      const key = moduleVideoKey(slug, mod.id);
      let done = sessionStorage.getItem(key) === "1";
      if (!done && modules.length === 1 && mod.id === modules[0]?.id) {
        done = sessionStorage.getItem(legacyVideoKey(slug)) === "1";
      }
      map[mod.id] = done;
    }
  } catch {
    /* ignore */
  }
  return map;
}

function readStoredCertName(slug: string): { firstName: string; lastName: string } {
  if (typeof window === "undefined") return { firstName: "", lastName: "" };
  try {
    const raw = sessionStorage.getItem(certNameStorageKey(slug));
    if (!raw) return { firstName: "", lastName: "" };
    const parsed = JSON.parse(raw) as { firstName?: string; lastName?: string };
    return {
      firstName: typeof parsed.firstName === "string" ? parsed.firstName : "",
      lastName: typeof parsed.lastName === "string" ? parsed.lastName : "",
    };
  } catch {
    return { firstName: "", lastName: "" };
  }
}

function readStoredIssuedCert(slug: string): IssuedCertSession | null {
  if (typeof window === "undefined") return null;
  try {
    const issuedRaw = sessionStorage.getItem(certIssuedStorageKey(slug));
    if (!issuedRaw) return null;
    const parsed = JSON.parse(issuedRaw) as Partial<IssuedCertSession>;
    if (
      typeof parsed.id === "number" &&
      typeof parsed.number === "string" &&
      typeof parsed.downloadToken === "string" &&
      typeof parsed.participantName === "string"
    ) {
      return {
        id: parsed.id,
        number: parsed.number,
        downloadToken: parsed.downloadToken,
        participantName: parsed.participantName,
      };
    }
  } catch {
    /* ignore */
  }
  return null;
}

/** RU: Модулі відео→тест → ПІБ → сертифікат. EN: Modules video→quiz → name → certificate. */
export function TrainingLesson({ locale, training }: Props) {
  const t = useTranslations("trainings");
  const firstNameId = useId();
  const lastNameId = useId();
  const modules = training.modules;
  const namedCertificate = Boolean(training.courseCode?.trim());
  const [videoDoneByModule, setVideoDoneByModule] = useState<Record<string, boolean>>(() =>
    readVideoDoneMap(training.slug, modules),
  );
  const [quizByModule, setQuizByModule] = useState<Record<string, QuizOutcome | null>>(() =>
    emptyOutcomes(modules),
  );
  const [certificateToken, setCertificateToken] = useState<string | null>(null);
  const [firstName, setFirstName] = useState(() => {
    return readStoredCertName(training.slug).firstName;
  });
  const [lastName, setLastName] = useState(() => {
    return readStoredCertName(training.slug).lastName;
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [issuedCert, setIssuedCert] = useState<IssuedCertSession | null>(() =>
    readStoredIssuedCert(training.slug),
  );
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState(false);

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

  const persistIssuedCert = useCallback(
    (next: IssuedCertSession) => {
      setIssuedCert(next);
      try {
        sessionStorage.setItem(certIssuedStorageKey(training.slug), JSON.stringify(next));
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
  const hasStaticCertificate =
    certificateResolution?.status === "available" ||
    Boolean(pickLocalized(training.certificatePdf, locale));
  const hasCertificateAsset = namedCertificate || hasStaticCertificate;

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

  const allVideosDone = modules.every((mod) => {
    if (!mod.youtubeId.trim()) return true;
    return Boolean(videoDoneByModule[mod.id]);
  });
  const quizPassed = totals.allSubmitted && totals.scorePercent >= threshold;
  const courseComplete = allVideosDone && quizPassed;
  const canDownload = courseComplete && hasCertificateAsset && Boolean(certificateToken);
  const nameReady = isNameReady(firstName, lastName);
  const participantName = composeParticipantName(firstName, lastName);
  const canDownloadNamed = canDownload && (Boolean(issuedCert) || nameReady);
  const staticCertificateHref = certificateToken
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
    if (!hasCertificateAsset || (!namedCertificate && certificateResolution?.status === "unavailable")) {
      return t("certPending");
    }
    if (!certificateToken) return t("certNeedQuiz");
    return t("certificateThresholdHint", { threshold });
  }

  async function downloadNamedPdf(downloadToken: string, certificateNumber: string) {
    const response = await fetch(
      `/api/trainings/${encodeURIComponent(training.slug)}/certificate?downloadToken=${encodeURIComponent(downloadToken)}`,
    );
    if (!response.ok) throw new Error("download_failed");
    const blob = await response.blob();
    triggerBlobDownload(blob, `${certificateNumber}.pdf`);
  }

  async function issueAndDownload() {
    if (!certificateToken || generating) return;
    setGenerating(true);
    setGenerateError(false);
    try {
      if (issuedCert) {
        await downloadNamedPdf(issuedCert.downloadToken, issuedCert.number);
        return;
      }
      const response = await fetch(`/api/trainings/${encodeURIComponent(training.slug)}/certificate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          token: certificateToken,
          firstName: normalizeNamePart(firstName),
          lastName: normalizeNamePart(lastName),
          participantName,
        }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        certificateId?: number;
        certificateNumber?: string;
        downloadToken?: string;
        participantName?: string;
      };
      if (
        !response.ok ||
        !data.ok ||
        typeof data.certificateId !== "number" ||
        typeof data.certificateNumber !== "string" ||
        typeof data.downloadToken !== "string"
      ) {
        throw new Error(data.error === "name_mismatch" ? "name_mismatch" : "issue_failed");
      }
      const next: IssuedCertSession = {
        id: data.certificateId,
        number: data.certificateNumber,
        downloadToken: data.downloadToken,
        participantName: data.participantName ?? participantName,
      };
      persistIssuedCert(next);
      setConfirmOpen(false);
      await downloadNamedPdf(next.downloadToken, next.number);
    } catch {
      setGenerateError(true);
    } finally {
      setGenerating(false);
    }
  }

  function onDownloadClick() {
    if (!canDownloadNamed || generating) return;
    if (namedCertificate) {
      if (issuedCert) {
        void issueAndDownload();
        return;
      }
      if (!confirmOpen) {
        setConfirmOpen(true);
        return;
      }
      void issueAndDownload();
      return;
    }
  }

  function renderNameFields() {
    if (issuedCert) {
      return (
        <div className="training-lesson__cert-name">
          <p className="training-lesson__cert-name-label regular-s">{t("certificateNameLabel")}</p>
          <p className="training-lesson__cert-issued-name regular-m">{issuedCert.participantName}</p>
          <p className="training-quiz__cert-hint regular-s" role="note">
            {t("certificateParticipationNote")}
          </p>
        </div>
      );
    }

    if (confirmOpen) {
      return (
        <div className="training-lesson__cert-name" role="group" aria-label={t("certificateConfirmTitle")}>
          <p className="training-lesson__cert-name-label regular-s">{t("certificateConfirmTitle")}</p>
          <p className="training-lesson__cert-issued-name regular-m">{participantName}</p>
          <div className="training-lesson__cert-confirm-actions">
            <button
              type="button"
              className="btn w-button"
              disabled={generating}
              onClick={() => setConfirmOpen(false)}
            >
              {t("certificateConfirmBack")}
            </button>
            <button
              type="button"
              className="btn is--primary w-button"
              disabled={generating}
              onClick={() => void issueAndDownload()}
            >
              {t("certificateConfirmSubmit")}
            </button>
          </div>
        </div>
      );
    }

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

  function renderGeneratingBanner() {
    if (!generating) return null;
    return (
      <div className="training-lesson__cert-generating" role="status" aria-live="polite">
        <span className="training-lesson__cert-spinner" aria-hidden="true" />
        <span>{t("certificateGenerating")}</span>
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
                showSeekHint={training.showSeekHint !== false}
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
            {renderGeneratingBanner()}
            {namedCertificate ? (
              !confirmOpen || issuedCert ? (
                <button
                  type="button"
                  className="btn is--primary w-button"
                  disabled={!canDownloadNamed || generating || (confirmOpen && !issuedCert)}
                  onClick={onDownloadClick}
                >
                  {t("downloadCertificate")}
                </button>
              ) : null
            ) : canDownloadNamed && staticCertificateHref ? (
              <a className="btn is--primary w-button" href={staticCertificateHref}>
                {t("downloadCertificate")}
              </a>
            ) : (
              <button type="button" className="btn is--primary w-button" disabled>
                {t("downloadCertificate")}
              </button>
            )}
            {generateError ? (
              <p className="training-quiz__cert-hint" role="alert">
                {t("certificateGenerateError")}
              </p>
            ) : null}
            {!issuedCert && !nameReady ? (
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
