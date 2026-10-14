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
                      {"Développez vos "}
                      <span className={"is--accent"}>
                        {"connaissances"}
                      </span>
                      {" et compétences en sécurité au travail"}
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
                {"Proposition globale de sécurité au travail"}
              </h2>
            </div>
            <div className={"text-spacing-wrapper is--margin-bottom-32"}>
              <p className={"regular-l"}>
                {"La Société européenne de sécurité et de santé au travail (ESOSH) a développé une solution complète innovante combinant les meilleures pratiques européennes, des outils de gestion des risques de pointe et des programmes de formation sur mesure pour les entreprises de divers secteurs."}
              </p>
              <div className={"bold-l is--w-100p"}>
                {"Inscrivez-vous en remplissant"}
              </div>
              <div className={"wrapper is--icons-list"}>
                <div className={"check-heading-wrapper is--w-100p"}>
                  <div className={"check-heading-wrapper__check"}>
                    <img src={"/images/join-participation/Check-299ab963.svg"} loading={"lazy"} alt={""} className={"is--icon-size-12"} />
                  </div>
                  <div className={"bold-l is--w-100p"}>
                    {"Pour minimiser les risques professionnels et augmenter les niveaux de sécurité"}
                  </div>
                </div>
                <div className={"check-heading-wrapper is--w-100p"}>
                  <div className={"check-heading-wrapper__check"}>
                    <img src={"/images/join-participation/Check-299ab963.svg"} loading={"lazy"} alt={""} className={"is--icon-size-12"} />
                  </div>
                  <div className={"bold-l is--w-100p"}>
                    {"Promouvoir la santé et le bien-être des employés ;"}
                  </div>
                </div>
                <div className={"check-heading-wrapper is--w-100p"}>
                  <div className={"check-heading-wrapper__check"}>
                    <img src={"/images/join-participation/Check-299ab963.svg"} loading={"lazy"} alt={""} className={"is--icon-size-12"} />
                  </div>
                  <div className={"bold-l is--w-100p"}>
                    {"Cultiver une culture Vision Zéro visant le zéro dommage"}
                  </div>
                </div>
              </div>
              <img src={"/images/join-participation/Check-299ab963.svg"} loading={"lazy"} alt={""} className={"is--icon-size-12"} />
              <img src={"/images/join-participation/Check-299ab963.svg"} loading={"lazy"} alt={""} className={"is--icon-size-12"} />
              <div className={"wrapper is--w-100p is--advantage is--purple"}>
                {"Cette solution tout-en-un combine audits, conseil, formation, outils numériques et assistance d'experts, aidant votre entreprise à se développer en toute sécurité et durablement."}
              </div>
              <p className={"regular-l"}>
                {"Vous pouvez consulter la proposition ESOSH sur le lien suivant"}
                <a href={"https://drive.google.com/file/d/11U22c8DG-EmIGVDDWUP4kZw2DqpbrFiS/view?usp=sharing"}>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <CoursesCatalogSection locale="fr" />
      <Footer />
    </>
  );
}
