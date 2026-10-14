/* Public ESOSH content captured 2026-09-07. Edit text and media here. */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CoursesCatalogSection } from "@/components/cms/CoursesCatalogSection";

/** RU: Содержимое страницы. EN: Static page content. */
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
                      {"Розвивайте свої "}
                      <span className={"is--accent"}>
                        {"знання та навички"}
                      </span>
                      {" з безпеки праці"}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className={"w-layout-blockcontainer w-container"}>
        <div className={"wrapper is--grid-text-spacing"}>
          <div className={"wrapper is--max-width-584"}>
            <div className={"wrapper"}>
              <h2 className={"h2 is--margin-bottom-24"}>
                {"Комплексна пропозиція з безпеки праці"}
              </h2>
            </div>
            <div className={"text-spacing-wrapper is--margin-bottom-32"}>
              <p className={"regular-l"}>
                {"Європейське співтовариство з охорони праці (ESOSH) розробило інноваційну комплексну пропозицію, що об’єднує кращі європейські практики, сучасні інструменти управління ризиками та навчальні програми для підприємств різних галузей."}
              </p>
              <div className={"bold-l is--w-100p"}>
                {"Це рішення допомагає компаніям:"}
              </div>
              <div className={"wrapper is--icons-list"}>
                <div className={"check-heading-wrapper is--w-100p"}>
                  <div className={"check-heading-wrapper__check"}>
                    <img src={"/images/join-participation/Check-299ab963.svg"} loading={"lazy"} alt={""} className={"is--icon-size-12"} />
                  </div>
                  <div className={"bold-l is--w-100p"}>
                    {"Зменшувати виробничі ризики та підвищувати рівень безпеки"}
                  </div>
                </div>
                <div className={"check-heading-wrapper is--w-100p"}>
                  <div className={"check-heading-wrapper__check"}>
                    <img src={"/images/join-participation/Check-299ab963.svg"} loading={"lazy"} alt={""} className={"is--icon-size-12"} />
                  </div>
                  <div className={"bold-l is--w-100p"}>
                    {"Формувати культуру нульової шкоди ("}
                    <em>
                      {"Vision Zero"}
                    </em>
                    {");"}
                  </div>
                </div>
                <div className={"check-heading-wrapper is--w-100p"}>
                  <div className={"check-heading-wrapper__check"}>
                    <img src={"/images/join-participation/Check-299ab963.svg"} loading={"lazy"} alt={""} className={"is--icon-size-12"} />
                  </div>
                  <div className={"bold-l is--w-100p"}>
                    {"покращувати здоров’я та добробут працівників"}
                  </div>
                </div>
              </div>
              <img src={"/images/join-participation/Check-299ab963.svg"} loading={"lazy"} alt={""} className={"is--icon-size-12"} />
              <img src={"/images/join-participation/Check-299ab963.svg"} loading={"lazy"} alt={""} className={"is--icon-size-12"} />
              <div className={"wrapper is--w-100p is--advantage is--purple"}>
                {"Комплексна пропозиція включає аудит, консалтинг, навчання, цифрові інструменти та підтримку експертів — усе в одному пакеті, щоб ваш бізнес міг розвиватися безпечно та стійко."}
              </div>
              <p className={"regular-l"}>
                {"Ознайомитись із пропозицією ESOSH можна за "}
                <a href={"https://drive.google.com/file/d/11U22c8DG-EmIGVDDWUP4kZw2DqpbrFiS/view?usp=sharing"}>
                  {"посиланням"}
                </a>
                <a href={"https://drive.google.com/file/d/11U22c8DG-EmIGVDDWUP4kZw2DqpbrFiS/view?usp=sharing"}>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <CoursesCatalogSection locale="uk" />
      <Footer />
    </>
  );
}
