import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "@/i18n/navigation";
import { pickLocalized, trainingsCatalog } from "@/content/trainings";

/** RU: Лістинг тренінгів (AZ). EN: Trainings listing page (az). */
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
                      {"ESOSH "}
                      <span className={"is--accent"}>{"Təlimlər"}</span>
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
          <div className={"wrapper is--max-width-720 is--margin-bottom-40"}>
            <p className={"regular-l"}>
              {"Təhlükəsizlik və fövqəladə hallarda hərəkətlər üzrə qısa video təlimlər. Mövzu seçin, materiala baxın və biliklərinizi yoxlayın."}
            </p>
          </div>
          <div className={"w-layout-grid is--grid-block-2-columns--a-1column"}>
            {trainingsCatalog.map((item) => {
              const title = pickLocalized(item.title, "az") ?? item.title.en;
              const summary = pickLocalized(item.summary, "az") ?? item.summary.en;
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
                  <h2 className={"h3 is--margin-bottom-12"}>{title}</h2>
                  <p className={"regular-l"}>{summary}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
