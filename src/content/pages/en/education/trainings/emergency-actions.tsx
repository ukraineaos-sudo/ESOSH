import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EmergencyActionsIntro } from "@/components/trainings/EmergencyActionsIntro";
import { TrainingLesson } from "@/components/trainings/TrainingLesson";
import { emergencyActionsTraining } from "@/content/trainings";
import { toPublicTraining } from "@/lib/trainings/public";

/** RU: Деталь тренінгу «Порядок дій громадян…» (EN). EN: Emergency-actions training detail. */
export default function PageContent() {
  const training = toPublicTraining(emergencyActionsTraining);

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
                      <a href={"/en/education/trainings"} className={"is--accent"}>
                        {"Online trainings"}
                      </a>
                    </p>
                    <h1 className={"h1"}>
                      <span className={"is--accent"}>{training.title.en}</span>
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
          <EmergencyActionsIntro locale="en" />
          <div className={"training-detail-lead"}>
            <p className={"regular-l"}>{training.summary.en}</p>
          </div>
          <TrainingLesson locale="en" training={training} />
        </div>
      </section>
      <Footer />
    </>
  );
}
