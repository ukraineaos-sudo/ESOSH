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
                      {"Дамытыңыз: "}
                      <span className={"is--accent"}>
                        {"қауіпсіздік білімін"}
                      </span>
                      {" және дағдыларды"}
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
                {"Жұмыс қауіпсіздігіне арналған кешенді ұсыныс"}
              </h2>
            </div>
            <div className={"text-spacing-wrapper is--margin-bottom-32"}>
              <p className={"regular-l"}>
                {"Еуропалық еңбек қауіпсіздігі мен денсаулығы қоғамы (ESOSH) үздік Еуропалық тәжірибелерді, ең соңғы тәуекелдерді басқару құралдарын және әртүрлі саладағы компаниялар үшін арнайы оқыту бағдарламаларын біріктіретін инновациялық кешенді шешімді әзірледі."}
              </p>
              <div className={"bold-l is--w-100p"}>
                {"Тіркелуді толтыру арқылы орындаңыз "}
              </div>
              <div className={"wrapper is--icons-list"}>
                <div className={"check-heading-wrapper is--w-100p"}>
                  <div className={"check-heading-wrapper__check"}>
                    <img src={"/images/join-participation/Check-299ab963.svg"} loading={"lazy"} alt={""} className={"is--icon-size-12"} />
                  </div>
                  <div className={"bold-l is--w-100p"}>
                    {"Жұмыспен қамтудың дамуы"}
                  </div>
                </div>
                <div className={"check-heading-wrapper is--w-100p"}>
                  <div className={"check-heading-wrapper__check"}>
                    <img src={"/images/join-participation/Check-299ab963.svg"} loading={"lazy"} alt={""} className={"is--icon-size-12"} />
                  </div>
                  <div className={"bold-l is--w-100p"}>
                    {"Қызметкерлердің денсаулығы мен әл-ауқатын қамтамасыз ету;"}
                  </div>
                </div>
                <div className={"check-heading-wrapper is--w-100p"}>
                  <div className={"check-heading-wrapper__check"}>
                    <img src={"/images/join-participation/Check-299ab963.svg"} loading={"lazy"} alt={""} className={"is--icon-size-12"} />
                  </div>
                  <div className={"bold-l is--w-100p"}>
                    {"Жоқ зиянды көз жеткізуге бағытталған Vision Zero мәдениетін дамыту"}
                  </div>
                </div>
              </div>
              <img src={"/images/join-participation/Check-299ab963.svg"} loading={"lazy"} alt={""} className={"is--icon-size-12"} />
              <img src={"/images/join-participation/Check-299ab963.svg"} loading={"lazy"} alt={""} className={"is--icon-size-12"} />
              <div className={"wrapper is--w-100p is--advantage is--purple"}>
                {"Бұл барлық-бірлік шешім аудит, консультация, оқыту, цифрлық құралдар және сарапшыларды қолдауды біріктіреді. Бұл сіздің бизнесіңіздің қауіпсіз және тұрақты өсуіне көмектеседі."}
              </div>
              <p className={"regular-l"}>
                {"Сіз ESOSH ұсынысын келесі сілтемеде қарастыра аласыз"}
                <a href={"https://drive.google.com/file/d/11U22c8DG-EmIGVDDWUP4kZw2DqpbrFiS/view?usp=sharing"}>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <CoursesCatalogSection locale="kk" />
      <Footer />
    </>
  );
}
