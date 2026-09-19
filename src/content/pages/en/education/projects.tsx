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
                      {"Socially important "}
                      <span className={"is--accent"}>
                        {"ESOSH projects"}
                      </span>
                      {" for society"}
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
              {"ESOSH projects"}
            </strong>
          </h2>
          <div className={"w-layout-grid is--grid-block-2-columns--a-1column"}>
            <a href={"https://helpuaworkers.com/"} target={"_blank"} className={"block is--radius-6 is--spacing-32-32--m-24-32 is--border-light-blue is--link w-inline-block"} rel="noopener noreferrer">
              <img src={"/images/home/User-Team-8fa295aa.svg"} loading={"lazy"} alt={""} className={"is--icon-size-40 is--margin-bottom-40"} />
              <h3 className={"h3"}>
                {"Help Alliance for Ukrainian workers "}
              </h3>
            </a>
            <a href={"https://ohoronapraci.kiev.ua/"} target={"_blank"} className={"block is--radius-6 is--spacing-32-32--m-24-32 is--border-light-blue is--link w-inline-block"} rel="noopener noreferrer">
              <img src={"/images/about-esosh/Globe-e0dc32eb.svg"} loading={"lazy"} alt={""} className={"is--icon-size-40 is--margin-bottom-40"} />
              <h3 className={"h3 is--w-100p"}>
                {"English speaking club on occupational safety"}
              </h3>
            </a>
            <a href={"https://www.ilo.org/global/lang--en/index.htm"} target={"_blank"} className={"block is--radius-6 is--spacing-32-32--m-24-32 is--border-light-blue is--link w-inline-block"} rel="noopener noreferrer">
              <img src={"/images/home/Presentation-file-d50be3ea.svg"} loading={"lazy"} alt={""} className={"is--icon-size-40 is--margin-bottom-40"} />
              <h3 className={"h3 is--w-100p"}>
                {"Technical webinars on safety project supported by the ILO"}
              </h3>
            </a>
            <a href={"https://www.ilo.org/sites/default/files/wcmsp5/groups/public/@europe/@ro-geneva/@sro-budapest/documents/genericdocument/wcms_856143.pdf"} className={"block is--radius-6 is--spacing-32-32--m-24-32 is--border-light-blue is--link w-inline-block"}>
              <img src={"/images/education-projects/Security-fe65e152.svg"} loading={"lazy"} alt={""} className={"is--icon-size-40 is--margin-bottom-40"} />
              <h3 className={"h3 is--w-100p"}>
                {"Safety at work during the war – a project supported by the ILO"}
              </h3>
            </a>
          </div>
        </div>
      </section>
      <section className={"section is--big-banners"}>
        <div className={"big-banner-wrapper is--about"}>
          <div className={"wrapper is--max-width-320 is--w-100p is--v-flex-center-center"}>
            <h2 className={"h2 is--white is--center is--margin-bottom-24"}>
              {"About "}
              <br />
              {"ESOSH"}
            </h2>
            <a href={"#"} className={"btn is--secondary is--white-btn w-button"}>
              {"Find out more"}
            </a>
          </div>
        </div>
        <div className={"big-banner-wrapper is--codex"}>
          <div className={"wrapper is--max-width-320 is--w-100p is--v-flex-center-center"}>
            <h2 className={"h2 is--white is--center is--margin-bottom-24"}>
              {"ESOSH regulations and code"}
            </h2>
            <a href={"#"} className={"btn is--secondary is--white-btn w-button"}>
              {"Find out more"}
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
