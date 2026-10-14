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
                      {"İnkişaf etdirin: "}
                      <span className={"is--accent"}>
                        {"təhlükəsizlik bilikləri"}
                      </span>
                      {" və bacarıqlar"}
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
                {"Kompleks Əməyin Təhlükəsizliyi Təklifi"}
              </h2>
            </div>
            <div className={"text-spacing-wrapper is--margin-bottom-32"}>
              <p className={"regular-l"}>
                {"Avropa Əməyin Təhlükəsizliyi və Sağlamlığı Cəmiyyəti (ESOSH) qabaqcıl Avropa təcrübələrini, ən müasir risklərin idarə edilməsi alətlərini və müxtəlif sənaye sahələri üzrə şirkətlər üçün uyğunlaşdırılmış təlim proqramlarını birləşdirən innovativ hərtərəfli həll hazırlamışdır."}
              </p>
              <div className={"bold-l is--w-100p"}>
                {"Dolduraraq qeydiyyatdan keçin "}
              </div>
              <div className={"wrapper is--icons-list"}>
                <div className={"check-heading-wrapper is--w-100p"}>
                  <div className={"check-heading-wrapper__check"}>
                    <img src={"/images/join-participation/Check-299ab963.svg"} loading={"lazy"} alt={""} className={"is--icon-size-12"} />
                  </div>
                  <div className={"bold-l is--w-100p"}>
                    {"Peşə risklərini minimuma endirmək və təhlükəsizlik səviyyələrini artırmaq"}
                  </div>
                </div>
                <div className={"check-heading-wrapper is--w-100p"}>
                  <div className={"check-heading-wrapper__check"}>
                    <img src={"/images/join-participation/Check-299ab963.svg"} loading={"lazy"} alt={""} className={"is--icon-size-12"} />
                  </div>
                  <div className={"bold-l is--w-100p"}>
                    {"İşçilərin sağlamlığını və rifahını təşviq etmək;"}
                  </div>
                </div>
                <div className={"check-heading-wrapper is--w-100p"}>
                  <div className={"check-heading-wrapper__check"}>
                    <img src={"/images/join-participation/Check-299ab963.svg"} loading={"lazy"} alt={""} className={"is--icon-size-12"} />
                  </div>
                  <div className={"bold-l is--w-100p"}>
                    {"Sıfır zərərə yönəlmiş Vision Zero mədəniyyətini inkişaf etdirmək"}
                  </div>
                </div>
              </div>
              <img src={"/images/join-participation/Check-299ab963.svg"} loading={"lazy"} alt={""} className={"is--icon-size-12"} />
              <img src={"/images/join-participation/Check-299ab963.svg"} loading={"lazy"} alt={""} className={"is--icon-size-12"} />
              <div className={"wrapper is--w-100p is--advantage is--purple"}>
                {"Bu hamısı bir yerdə həll auditləri, konsaltinqləri, təlimləri, rəqəmsal alətləri və ekspert dəstəyini birləşdirərək biznesinizin təhlükəsiz və davamlı şəkildə böyüməsinə kömək edir."}
              </div>
              <p className={"regular-l"}>
                {"ESOSH təklifi ilə aşağıdakı linkdə tanış ola bilərsiniz"}
                <a href={"https://drive.google.com/file/d/11U22c8DG-EmIGVDDWUP4kZw2DqpbrFiS/view?usp=sharing"}>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <CoursesCatalogSection locale="az" />
      <Footer />
    </>
  );
}
