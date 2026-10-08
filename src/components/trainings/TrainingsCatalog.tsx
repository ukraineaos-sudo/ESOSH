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

/** RU: Секції каталогу тренінгів (basic / professional). EN: Trainings catalog sections. */
export function TrainingsCatalog({ locale }: TrainingsCatalogProps) {
  const basic = trainingsByTier("basic");
  const professional = trainingsByTier("professional");
  const basicHeading = sectionTitle(trainingsListingCopy.basicTitle, locale);
  const professionalHeading = sectionTitle(trainingsListingCopy.professionalTitle, locale);
  const comingSoon = sectionTitle(trainingsListingCopy.comingSoon, locale);

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
            {basic.map((item) => {
              const { title, summary } = cardCopy(item, locale);
              return (
                <Link
                  key={item.slug}
                  href={item.href}
                  className={
                    "block is--radius-6 is--spacing-32-32--m-24-32 is--border-light-blue is--link w-inline-block"
                  }
                >
                  <img
                    src={"/images/education-projects/Security-fe65e152.svg"}
                    loading={"lazy"}
                    alt={""}
                    className={"is--icon-size-40 is--margin-bottom-24"}
                  />
                  <h3 className={"h3 is--margin-bottom-12"}>{title}</h3>
                  <p className={"regular-l"}>{summary}</p>
                </Link>
              );
            })}
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
            {professional.map((item) => {
              const { title, summary } = cardCopy(item, locale);
              return (
                <Link
                  key={item.slug}
                  href={item.href}
                  className={
                    "block is--radius-6 is--spacing-32-32--m-24-32 is--border-light-blue is--link w-inline-block"
                  }
                >
                  <img
                    src={"/images/education-projects/Security-fe65e152.svg"}
                    loading={"lazy"}
                    alt={""}
                    className={"is--icon-size-40 is--margin-bottom-24"}
                  />
                  <h3 className={"h3 is--margin-bottom-12"}>{title}</h3>
                  <p className={"regular-l"}>{summary}</p>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className={"trainings-section__empty regular-l"}>{comingSoon}</p>
        )}
      </section>
    </div>
  );
}
