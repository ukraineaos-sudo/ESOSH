import type { LocaleCode, TrainingPractice3d } from "@/content/trainings/types";
import { pickLocalized } from "@/content/trainings/types";

type Props = {
  locale: LocaleCode;
  practice: TrainingPractice3d;
  /** When false, show locked state (modules not finished). */
  unlocked?: boolean;
};

/**
 * RU: Блок 3D-закріплення під модулями (iframe або pending/locked).
 * EN: 3D reinforcement under modules (iframe or pending/locked).
 */
export function TrainingPractice3d({ locale, practice, unlocked = true }: Props) {
  const title = pickLocalized(practice.title, locale) ?? practice.title.en;
  const summary = pickLocalized(practice.summary, locale) ?? practice.summary.en;
  const pendingLabel =
    pickLocalized(practice.pendingLabel, locale) ?? practice.pendingLabel.en;
  const lockedLabel =
    pickLocalized(practice.lockedLabel, locale) ??
    practice.lockedLabel?.en ??
    pendingLabel;
  const ready = practice.ready === true;
  const src = typeof practice.src === "string" ? practice.src.trim() : "";
  const showEmbed = ready && unlocked && src.length > 0;

  return (
    <section className="training-practice-3d" aria-labelledby="training-practice-3d-title">
      <header className="training-practice-3d__header">
        <p className="training-practice-3d__eyebrow regular-s">3D</p>
        <h2 id="training-practice-3d-title" className="h3 training-practice-3d__title">
          {title}
        </h2>
      </header>
      <p className="regular-l training-practice-3d__summary">{summary}</p>
      {showEmbed ? (
        <div className="training-practice-3d__frame-wrap">
          <iframe
            className="training-practice-3d__frame"
            title={title}
            src={src}
            loading="lazy"
            referrerPolicy="no-referrer"
            allow="fullscreen"
          />
          <p className="training-practice-3d__open regular-s">
            <a href={src} target="_blank" rel="noopener noreferrer">
              {locale === "uk" ? "Відкрити на повний екран" : "Open fullscreen"}
            </a>
          </p>
        </div>
      ) : (
        <div className="training-practice-3d__stage" role="status">
          <p className="regular-s training-practice-3d__pending">
            {!unlocked ? lockedLabel : pendingLabel}
          </p>
        </div>
      )}
    </section>
  );
}
