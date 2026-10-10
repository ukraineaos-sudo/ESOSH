import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TrainingsCatalog } from "@/components/trainings/TrainingsCatalog";

/** RU: Лістинг тренінгів. EN: Trainings listing page. */
export default function PageContent() {
  return (
    <>
      <section className={"section is--height-100vh--a-auto is--internal-hero"}>
        <Header />
        <div className={"wrapper is--accent-light-bg is--position-relative is--grow"}>
          <div className={"wrapper is--hero-internal-layout"}>
            <div className={"wrapper is--hero-internal-text"}>
              <div className={"w-layout-blockcontainer container is--w-100p w-container"}>
                <div className={"wrapper is--hero-internal-text-wrapper"}>
                  <div className={"wrapper is--max-width-600"}>
                    <h1 className={"h1"}>
                      {"Онлайн-тренінги "}
                      <span className={"is--accent"}>{"ESOSH"}</span>
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
          <TrainingsCatalog locale={"uk"} />
        </div>
      </section>
      <Footer />
    </>
  );
}
