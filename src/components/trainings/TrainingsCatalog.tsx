import { Link } from "@/i18n/navigation";
import {
  pickLocalized,
  trainingsByTier,
  trainingsListingCopy,
  type LocaleCode,
  type TrainingListItem,
} from "@/content/trainings";

type TrainingsCatalogProps = {
  locale: LocaleCode;
};

function sectionTitle(map: (typeof trainingsListingCopy)["basicTitle"], locale: LocaleCode): string {
  return pickLocalized(map, locale) ?? map.en;
}

function cardCopy(item: TrainingListItem, locale: LocaleCode): { title: string; summary: string } {
  return {
    title: pickLocalized(item.title, locale) ?? item.title.en,
    summary: pickLocalized(item.summary, locale) ?? item.summary.en,
  };
}

const TRAINING_CARD_ICONS: Record<string, string> = {
  "risk-assessment": "/images/education/trainings/risk-assessment.png",
  "emergency-actions": "/images/education/trainings/emergency-actions.png",
};

function cardIconSrc(slug: string): string {
  return TRAINING_CARD_ICONS[slug] ?? "/images/education-projects/Security-fe65e152.svg";
}

function TrainingCard({ item, locale }: { item: TrainingListItem; locale: LocaleCode }) {
  const { title, summary } = cardCopy(item, locale);
  return (
    <Link
      href={item.href}
      className={
        "block is--radius-6 is--spacing-32-32--m-24-32 is--border-light-blue is--link w-inline-block trainings-card"
      }
    >
      <div className="trainings-card__head">
        <img
          src={cardIconSrc(item.slug)}
          loading={"lazy"}
          alt={""}
          className={"trainings-card__icon is--icon-size-40"}
          width={40}
          height={40}
        />
        <h3 className={"h3 trainings-card__title"}>{title}</h3>
      </div>
      <p className={"regular-l trainings-card__summary"}>{summary}</p>
    </Link>
  );
}

/** RU: Секції каталогу тренінгів (basic / professional). EN: Trainings catalog sections. */
export function TrainingsCatalog({ locale }: TrainingsCatalogProps) {
  const basic = trainingsByTier("basic");
  const professional = trainingsByTier("professional");
  const basicHeading = sectionTitle(trainingsListingCopy.basicTitle, locale);
  const professionalHeading = sectionTitle(trainingsListingCopy.professionalTitle, locale);
  const comingSoon = sectionTitle(trainingsListingCopy.comingSoon, locale);
  const professionalContactTemplate =
    pickLocalized(trainingsListingCopy.professionalContact, locale) ??
    trainingsListingCopy.professionalContact.en;
  const professionalEmail = trainingsListingCopy.professionalContactEmail;
  const [professionalContactBefore, professionalContactAfter = ""] =
    professionalContactTemplate.split("{email}");

  return (
    <div className={"trainings-catalog"}>
      <section className={"trainings-section"} aria-labelledby={"trainings-basic-heading"}>
        <div className={"trainings-section__heading"}>
          <h2 id={"trainings-basic-heading"} className={"trainings-section__title h3"}>
            {basicHeading}
          </h2>
        </div>
        {basic.length > 0 ? (
          <div className={"w-layout-grid is--grid-block-2-columns--a-1column"}>
            {basic.map((item) => (
              <TrainingCard key={item.slug} item={item} locale={locale} />
            ))}
          </div>
        ) : (
          <p className={"trainings-section__empty regular-l"}>{comingSoon}</p>
        )}
      </section>

      <section className={"trainings-section"} aria-labelledby={"trainings-professional-heading"}>
        <div className={"trainings-section__heading"}>
          <h2 id={"trainings-professional-heading"} className={"trainings-section__title h3"}>
            {professionalHeading}
          </h2>
        </div>
        {professional.length > 0 ? (
          <div className={"w-layout-grid is--grid-block-2-columns--a-1column"}>
            {professional.map((item) => (
              <TrainingCard key={item.slug} item={item} locale={locale} />
            ))}
          </div>
        ) : (
          <p className={"trainings-section__empty regular-l"}>
            {professionalContactBefore}
            <a href={`mailto:${professionalEmail}`} className={"is--accent"}>
              {professionalEmail}
            </a>
            {professionalContactAfter}
          </p>
        )}
      </section>
    </div>
  );
}
