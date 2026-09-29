import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TrainingLesson } from "@/components/trainings/TrainingLesson";
import { riskAssessmentTraining } from "@/content/trainings";

/** RU: Деталь тренінгу «Оцінка ризиків». EN: Risk-assessment training detail (uk). */
export default function PageContent() {
  const training = riskAssessmentTraining;

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
                      <a href={"/education/trainings"} className={"is--accent"}>
                        {"Тренінги"}
                      </a>
                    </p>
                    <h1 className={"h1"}>
                      <span className={"is--accent"}>{training.title.uk}</span>
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
          <div className={"training-detail-lead"}>
            <p className={"regular-l"}>{training.summary.uk}</p>
          </div>
          <TrainingLesson locale="uk" training={training} />
        </div>
      </section>
      <Footer />
    </>
  );
}
