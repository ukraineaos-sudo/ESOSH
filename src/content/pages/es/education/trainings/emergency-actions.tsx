import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "@/i18n/navigation";
import { EmergencyActionsIntro } from "@/components/trainings/EmergencyActionsIntro";
import { TrainingLesson } from "@/components/trainings/TrainingLesson";
import { emergencyActionsTraining, pickLocalized } from "@/content/trainings";
import { toPublicTraining } from "@/lib/trainings/public";

const LOCALE = "es" as const;
const BREADCRUMB = "Entrenamientos";

/** RU: Деталь тренінгу Emergency-actions (es). EN: Emergency-actions training detail (es). */
export default function PageContent() {
  const training = toPublicTraining(emergencyActionsTraining);
  const title = pickLocalized(training.title, LOCALE) ?? training.title.en;
  const summary = pickLocalized(training.summary, LOCALE) ?? training.summary.en;

  return (
    <>
      <section className={"section is--height-100vh--a-auto is--internal-hero"}>
        <Header />
        <div className={"wrapper is--accent-light-bg is--position-relative is--grow"}>
          <div className={"wrapper is--hero-internal-layout"}>
            <div className={"wrapper is--hero-internal-text"}>
              <div className={"w-layout-blockcontainer container is--w-100p w-container"}>
                <div className={"wrapper is--hero-internal-text-wrapper"}>
                  <div className={"wrapper is--max-width-720"}>
                    <p className={"medium-xs is--margin-bottom-16"}>
                      <Link href={"/education/trainings"} className={"is--accent"}>
                        {BREADCRUMB}
                      </Link>
                    </p>
                    <h1 className={"h1"}>
                      <span className={"is--accent"}>{title}</span>
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className={"section is--margin-top-144--t-128--m-104 is--margin-bottom-144--t-128--m-104"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <EmergencyActionsIntro locale={LOCALE} />
          <div className={"training-detail-lead"}>
            <p className={"regular-l"}>{summary}</p>
          </div>
          <TrainingLesson locale={LOCALE} training={training} />
        </div>
      </section>
      <Footer />
    </>
  );
}
