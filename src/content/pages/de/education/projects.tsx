/* Public ESOSH content captured 2026-09-07. Edit text and media here. */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

/** RU: Содержимое страницы. EN: Static page content. */
export default function PageContent() {
  return (
    <>
      <section className={"section is--height-100vh--a-auto is--internal-hero"}>
        <Header />
        <div className={"wrapper is--accent-light-bg is--position-relative is--grow"}>
          <div className={"wrapper is--hero-internal-layout"}>
            <div id={"w-node-f2c76945-72e4-35f8-925e-1d318fb0425f-eb25973e"} className={"wrapper is--hero-internal-text"}>
              <div className={"w-layout-blockcontainer container is--w-100p w-container"}>
                <div className={"wrapper is--hero-internal-text-wrapper"}>
                  <div className={"wrapper is--max-width-600"}>
                    <h1 className={"h1"}>
                      {"Gesellschaftlich wichtig "}
                      <span className={"is--accent"}>
                        {"ESOSH Projekte"}
                      </span>
                      {" für die Gesellschaft"}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <div className={"hero-internal-image is--projects"}>
            </div>
          </div>
        </div>
      </section>
      <section className={"section is--margin-top-144--t-128--m-104 is--margin-bottom-144--t-128--m-104"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <h2 className={"h2 is--margin-bottom-40"}>
            <strong>
              {"ESOSH Projekte"}
            </strong>
          </h2>
          <div className={"w-layout-grid is--grid-block-2-columns--a-1column"}>
            <a href={"https://helpuaworkers.com/"} target={"_blank"} className={"block is--radius-6 is--spacing-32-32--m-24-32 is--border-light-blue is--link w-inline-block"} rel="noopener noreferrer">
              <img src={"/images/home/User-Team-8fa295aa.svg"} loading={"lazy"} alt={""} className={"is--icon-size-40 is--margin-bottom-40"} />
              <h3 className={"h3"}>
                {"Hilfsbündnis für ukrainische Arbeitnehmer "}
              </h3>
            </a>
            <a href={"https://ohoronapraci.kiev.ua/"} target={"_blank"} className={"block is--radius-6 is--spacing-32-32--m-24-32 is--border-light-blue is--link w-inline-block"} rel="noopener noreferrer">
              <img src={"/images/about-esosh/Globe-e0dc32eb.svg"} loading={"lazy"} alt={""} className={"is--icon-size-40 is--margin-bottom-40"} />
              <h3 className={"h3 is--w-100p"}>
                {"Englischsprachiger Club zum Thema Arbeitssicherheit"}
              </h3>
            </a>
            <a href={"https://www.ilo.org/global/lang--en/index.htm"} target={"_blank"} className={"block is--radius-6 is--spacing-32-32--m-24-32 is--border-light-blue is--link w-inline-block"} rel="noopener noreferrer">
              <img src={"/images/home/Presentation-file-d50be3ea.svg"} loading={"lazy"} alt={""} className={"is--icon-size-40 is--margin-bottom-40"} />
              <h3 className={"h3 is--w-100p"}>
                {"Technische Webinare zu Sicherheitsprojekten, die von der ILO unterstützt werden"}
              </h3>
            </a>
            <a href={"https://www.ilo.org/sites/default/files/wcmsp5/groups/public/@europe/@ro-geneva/@sro-budapest/documents/genericdocument/wcms_856143.pdf"} className={"block is--radius-6 is--spacing-32-32--m-24-32 is--border-light-blue is--link w-inline-block"}>
              <img src={"/images/education-projects/Security-fe65e152.svg"} loading={"lazy"} alt={""} className={"is--icon-size-40 is--margin-bottom-40"} />
              <h3 className={"h3 is--w-100p"}>
                {"Arbeitssicherheit im Krieg – ein von der ILO gefördertes Projekt"}
              </h3>
            </a>
          </div>
        </div>
      </section>
      <section className={"section is--big-banners"}>
        <div className={"big-banner-wrapper is--about"}>
          <div className={"wrapper is--max-width-320 is--w-100p is--v-flex-center-center"}>
            <h2 className={"h2 is--white is--center is--margin-bottom-24"}>
              {"Um "}
              <br />
              {"ESOSH"}
            </h2>
            <a href={"#"} className={"btn is--secondary is--white-btn w-button"}>
              {"Erfahren Sie mehr"}
            </a>
          </div>
        </div>
        <div className={"big-banner-wrapper is--codex"}>
          <div className={"wrapper is--max-width-320 is--w-100p is--v-flex-center-center"}>
            <h2 className={"h2 is--white is--center is--margin-bottom-24"}>
              {"ESOSH Vorschriften und Kodex"}
            </h2>
            <a href={"#"} className={"btn is--secondary is--white-btn w-button"}>
              {"Erfahren Sie mehr"}
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
