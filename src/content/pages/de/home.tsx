/* Public ESOSH content captured 2026-09-07. Edit text and media here. */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CmsNewsListItems } from "@/components/cms/CmsNewsListItems";
import { HomeMembersStat } from "@/components/cms/HomeMembersStat";

/** RU: Содержимое страницы. EN: Static page content. */
export default function PageContent() {
  return (
    <>
      <section className={"section is--accent-light-bg"}>
        <Header />
        <div className={"w-layout-blockcontainer container w-container"}>
          <div className={"wrapper is--offer is--margin-top-128--t-112--m-88 is--margin-bottom-88--m-72"}>
            <h1 className={"h1 is--max-width-648"}>
              {"Aufbau eines europäischen Niveaus von"}
              <span className={"is--accent"}>
                {" Sicherheit und Gesundheitsschutz am Arbeitsplatz"}
              </span>
              {" in der Ukraine"}
            </h1>
            <div className={"wrapper is--max-width-456"}>
              <p className={"regular-l is--margin-bottom-24"}>
                {"Die Europäische Gesellschaft für Sicherheit und Gesundheitsschutz am Arbeitsplatz ESOSH prägt Werte, hebt das Wissensniveau, beeinflusst Gesetzesänderungen und pflegt Verbindungen zu international führenden Organisationen, damit Arbeit in der Ukraine sicher wird. Die Teilnahme ist kostenlos — machen Sie mit und entwickeln Sie sich weiter."}
              </p>
              <a href={"/de/businesses"} className={"btn is--primary w-button"}>
                {"Ich interessiere mich"}
              </a>
            </div>
          </div>
          <div className={"hero-image is--margin-bottom-64--t-48--m-24"}>
          </div>
        </div>
      </section>
      <section className={"section is--margin-top-144--t-128--m-104"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <div className={"wrapper is--h-flex-bottom-space-between is--margin-bottom-40"}>
            <h2 className={"h2"}>
              {"Neuigkeiten und Veranstaltungen"}
            </h2>
            <a href={"/de/news"} className={"btn is--tertiary w-inline-block"}>
              <div className={"wrapper is--h-flex-center-left is--gap-4-columns"}>
                <div className={"bold-m"}>
                  {"Weitere Neuigkeiten"}
                </div>
                <img src={"/images/home/Chevron-Right-1f56be04.svg"} loading={"lazy"} alt={""} className={"is--icon-size-16"} />
              </div>
            </a>
          </div>
          <div className={"collection-list-wrapper w-dyn-list"}>
            <div role={"list"} className={"collection-list is--grid-3-columns--a-1-column w-dyn-items"}>
              <CmsNewsListItems locale="de" limit={3} />
            </div>
          </div>
        </div>
      </section>
      <section className={"section is--margin-top-144--t-128--m-104"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <div className={"wrapper is--h-flex-bottom-space-between is--margin-bottom-40"}>
            <h2 className={"h2"}>
              {"Für Unternehmen"}
            </h2>
            <a href={"/de/businesses"} className={"btn is--tertiary w-inline-block"}>
              <div className={"wrapper is--h-flex-center-left is--gap-4-columns"}>
                <div className={"bold-m"}>
                  {"Erfahren Sie mehr"}
                </div>
                <img src={"/images/home/Chevron-Right-1f56be04.svg"} loading={"lazy"} alt={""} className={"is--icon-size-16"} />
              </div>
            </a>
          </div>
          <div className={"wrapper is--grid-block-2-columns--a-1column"}>
            <a href={"/de/education/projects"} className={"block is--spacing-32-32--m-24-32 is--border-grey-7 is--v-flex-start-start w-inline-block"}>
              <img src={"/images/home/Presentation-file-d50be3ea.svg"} loading={"lazy"} alt={""} className={"is--icon-size-40 is--margin-bottom-32"} />
              <div className={"wrapper is--v-flex-start-space-between is--grow"}>
                <div className={"wrapper is--max-width-480 is--margin-bottom-32"}>
                  <h3 className={"h3 is--margin-bottom-12"}>
                    {"Risikobewertung"}
                  </h3>
                  <p className={"regular-l"}>
                    {"Risikobewertung, Audits, Projektbegleitung und gezielte Sicherheitsprogramme. Unsere Fachkräfte entwickeln ihre Kompetenzen kontinuierlich im Ausland weiter, setzen Präventionspraktiken in der Ukraine um und können Ihr Unternehmen dabei unterstützen."}
                  </p>
                </div>
                <div className={"btn is--tertiary is--no-link"}>
                  <div className={"wrapper is--h-flex-center-left is--gap-4-columns"}>
                    <div className={"bold-m"}>
                      {"Unsere Projekte"}
                    </div>
                    <img src={"/images/home/Chevron-Right-1f56be04.svg"} loading={"lazy"} alt={""} className={"is--icon-size-16"} />
                  </div>
                </div>
              </div>
            </a>
            <a href={"/de/education/courses"} className={"block is--spacing-32-32--m-24-32 is--border-grey-7 is--v-flex-start-start w-inline-block"}>
              <img src={"/images/home/Persons-348db007.svg"} loading={"lazy"} alt={""} className={"is--icon-size-40 is--margin-bottom-32"} />
              <div className={"wrapper is--v-flex-start-space-between is--grow"}>
                <div className={"wrapper is--max-width-480 is--margin-bottom-32"}>
                  <h3 className={"h3 is--margin-bottom-12"}>
                    {"Schulungsprogramme"}
                  </h3>
                  <p className={"regular-l"}>
                    {"Internationale Sicherheitskurse für Fachkräfte für Arbeitssicherheit, Ingenieure und Techniker, leitende und mittlere Führungskräfte."}
                  </p>
                </div>
                <div className={"btn is--tertiary is--no-link"}>
                  <div className={"wrapper is--h-flex-center-left is--gap-4-columns"}>
                    <div className={"bold-m"}>
                      {"Wählen Sie einen Kurs"}
                    </div>
                    <img src={"/images/home/Chevron-Right-1f56be04.svg"} loading={"lazy"} alt={""} className={"is--icon-size-16"} />
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>
      <section className={"section is--margin-top-144--t-128--m-104 is--section-spacing is--accent-light-bg"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <div className={"w-layout-grid is--grid-image-text"}>
            <div id={"w-node-d8ee5e26-040b-16c3-6788-48a568aed696-3a95260b"} className={"grid-image is--position-relative"}>
              <div className={"is--position-absolute is--w-100p is--h-100p"}>
                <img src={"/images/home/OHS-Directors-Board-in-ESOSH-v2-36cae184.webp"} loading={"lazy"} alt={""} className={"image-inside"} width={1920} height={1440} decoding="async" />
              </div>
            </div>
            <div id={"w-node-_23df81b9-94cc-8778-bf62-3ed355cf6153-3a95260b"} className={"wrapper is--grid-text-spacing"}>
              <div className={"wrapper is--max-width-584"}>
                <h2 className={"h2 is--margin-bottom-24"}>
                  {"Wir sind ein Berufsverband der Fachkräfte für Arbeitssicherheit und Gesundheitsschutz"}
                </h2>
                <p className={"regular-l is--margin-bottom-32"}>
                  {"Die Europäische Gesellschaft für Sicherheit und Gesundheitsschutz am Arbeitsplatz (ESOSH) ist ein Berufsverband von Spezialisten für Arbeitssicherheit, der gute internationale Praktiken fördert und Kompetenzen im Bereich Sicherheit und Gesundheitsschutz am Arbeitsplatz entwickelt. "}
                  {"Die Experten des Verbandes sind Fachleute mit praktischer Erfahrung in internationalen Unternehmen und europäischen Qualifikationen."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <HomeMembersStat locale="de" />
      <section className={"section is--margin-top-144--t-128--m-104"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <div className={"wrapper is--h-flex-center-center is--margin-bottom-64"}>
            <h2 className={"h2 is--center is--max-width-648"}>
              {"Treten Sie der Gemeinschaft bei und entwickeln Sie sich im Bereich Sicherheit und Gesundheit am Arbeitsplatz weiter"}
            </h2>
          </div>
          <div className={"w-layout-grid is--grid-links-image"}>
            <div id={"w-node-e9e4dc40-f9df-be5c-f780-cd2efd0543a3-3a95260b"} className={"wrapper is--v-flex-start-start is--rows-gap-32 is--max-width-560"}>
              <a href={"/de/join/participation"} className={"wrapper is--no-link is--h-flex-top-left is--gap-24 w-inline-block"}>
                <img src={"/images/home/Diamond-1f302500.svg"} loading={"lazy"} alt={""} className={"is--icon-size-32"} />
                <div className={"wrapper"}>
                  <div className={"wrapper is--h-flex-center-left--m-top is--gap-16 is--margin-bottom-12"}>
                    <h3 className={"h3"}>
                      {"Teilnahme an ESOSH für Unternehmen"}
                    </h3>
                    <img src={"/images/home/Arrow-Right-dfaefc46.svg"} loading={"lazy"} alt={""} className={"is--icon-size-20"} />
                  </div>
                  <p className={"regular-l"}>
                    {"Schließen Sie sich uns an, um gemeinsam bewährte Praktiken zu entwickeln und umzusetzen und den Arbeitsschutz in der Ukraine zu stärken."}
                  </p>
                </div>
              </a>
              <a href={"/de/join/enrollment"} className={"wrapper is--no-link is--h-flex-top-left is--gap-24 w-inline-block"}>
                <img src={"/images/home/Inventory-75285e5a.svg"} loading={"lazy"} alt={""} className={"is--icon-size-32"} />
                <div className={"wrapper"}>
                  <div className={"wrapper is--h-flex-center-left--m-top is--gap-16 is--margin-bottom-12"}>
                    <h3 className={"h3"}>
                      {"Beitritt zu ESOSH für Fachkräfte"}
                    </h3>
                    <img src={"/images/home/Arrow-Right-dfaefc46.svg"} loading={"lazy"} alt={""} className={"is--icon-size-20"} />
                  </div>
                  <p className={"regular-l"}>
                    {"Werden Sie Mitglied der ESOSH und erhalten Sie Zugang zu vertieftem Wissen und Ressourcen zu Sicherheit und Gesundheitsschutz am Arbeitsplatz."}
                  </p>
                </div>
              </a>
              <a href={"/de/join/codex"} className={"wrapper is--no-link is--h-flex-top-left is--gap-24 w-inline-block"}>
                <img src={"/images/home/Documents-e8daedbf.svg"} loading={"lazy"} alt={""} className={"is--icon-size-32"} />
                <div className={"wrapper"}>
                  <div className={"wrapper is--h-flex-center-left--m-top is--gap-16 is--margin-bottom-12"}>
                    <h3 className={"h3"}>
                      {"Verhaltenskodex"}
                    </h3>
                    <img src={"/images/home/Arrow-Right-dfaefc46.svg"} loading={"lazy"} alt={""} className={"is--icon-size-20"} />
                  </div>
                  <p className={"regular-l"}>
                    {"Unser Verhaltenskodex definiert unsere Grundwerte und Standards, die wir in unserer Arbeit und Interaktion umsetzen wollen."}
                  </p>
                </div>
              </a>
              <a href={"/de/join/terms"} className={"wrapper is--no-link is--h-flex-top-left is--gap-24 w-inline-block"}>
                <img src={"/images/home/Document-Info-b858472d.svg"} loading={"lazy"} alt={""} className={"is--icon-size-32"} />
                <div className={"wrapper"}>
                  <div className={"wrapper is--h-flex-center-left--m-top is--gap-16 is--margin-bottom-12"}>
                    <h3 className={"h3"}>
                      {"Satzung der ESOSH"}
                    </h3>
                    <img src={"/images/home/Arrow-Right-dfaefc46.svg"} loading={"lazy"} alt={""} className={"is--icon-size-20"} />
                  </div>
                  <p className={"regular-l"}>
                    {"Unsere Erklärung definiert die wichtigsten Prinzipien und Normen, die unsere Aktivitäten und das Funktionieren unserer Gemeinschaft regeln."}
                  </p>
                </div>
              </a>
              <a href={"/de/join/safety-league-best-practices"} className={"wrapper is--no-link is--h-flex-top-left is--gap-24 w-inline-block"}>
                <img src={"/images/home/User-Team-8fa295aa.svg"} loading={"lazy"} alt={""} className={"is--icon-size-32"} />
                <div className={"wrapper"}>
                  <div className={"wrapper is--h-flex-center-left--m-top is--gap-16 is--margin-bottom-12"}>
                    <h3 className={"h3"}>
                      {"Fachgruppen und bewährte Praktiken"}
                    </h3>
                    <img src={"/images/home/Arrow-Right-dfaefc46.svg"} loading={"lazy"} alt={""} className={"is--icon-size-20"} />
                  </div>
                  <p className={"regular-l"}>
                    {"Wir arbeiten gemeinsam an der Schaffung neuer Standards und bewährter Praktiken für die Sicherheit am Arbeitsplatz."}
                  </p>
                </div>
              </a>
            </div>
            <div id={"w-node-d2f0656b-9dfd-e281-31ce-7619b8ad73d4-3a95260b"} className={"grid-image is--position-relative"}>
              <div className={"is--position-absolute is--w-100p is--h-100p"}>
                <img src={"/images/home/IMG-6693-052d0f21.webp"} loading={"lazy"} alt={""} className={"image-inside"} width={1953} height={1365} decoding="async" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className={"section is--margin-top-144--t-128--m-104"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <div className={"wrapper is--h-flex-bottom-space-between is--margin-bottom-40"}>
            <h2 className={"h2"}>
              {"Unsere Kurse"}
            </h2>
            <a href={"/de/education/courses"} className={"btn is--tertiary w-inline-block"}>
              <div className={"wrapper is--h-flex-center-left is--gap-4-columns"}>
                <div className={"bold-m"}>
                  {"Mehr anzeigen"}
                </div>
                <img src={"/images/home/Chevron-Right-1f56be04.svg"} loading={"lazy"} alt={""} className={"is--icon-size-16"} />
              </div>
            </a>
          </div>
          <div className={"w-layout-grid is--courses-grid is--home"}>
            <a id={"w-node-_6ee2f36e-8ff0-0717-7fa1-c2e14037c784-3a95260b"} href={"#"} className={"wrapper is--course w-inline-block"}>
              <div className={"course-image-wrapper"}>
                <img src={"/images/home/christina-hawkins-VDpYOvZm2Ok-unsplash-e7a1d6db.webp"} loading={"lazy"} alt={""} className={"course-image"} width={1920} height={1280} decoding="async" />
              </div>
              <div className={"course-content"}>
                <div className={"chips is--green"}>
                  <div className={"medium-xs"}>
                    {"Basic"}
                  </div>
                </div>
                <h3 className={"h3 is--max-width-440"}>
                  {"Barrierefreiheit und Sicherheit. Schutz von Beschäftigten und Besuchern mit Behinderungen"}
                </h3>
              </div>
            </a>
            <a id={"w-node-_6ee2f36e-8ff0-0717-7fa1-c2e14037c78d-3a95260b"} href={"#"} className={"wrapper is--course w-inline-block"}>
              <div className={"course-image-wrapper"}>
                <img src={"/images/home/linkedin-sales-solutions-YDVdprpgHv4-unsplash-00d296f0.webp"} loading={"lazy"} alt={""} className={"course-image"} width={2000} height={1364} decoding="async" />
              </div>
              <div className={"course-content"}>
                <div className={"chips is--green"}>
                  <div className={"medium-xs"}>
                    {"Basic"}
                  </div>
                </div>
                <h3 className={"h3 is--max-width-440"}>
                  {"Sicherheit und Gesundheitsschutz am Arbeitsplatz in Kriegszeiten. Risiken während des Krieges"}
                </h3>
              </div>
            </a>
            <a id={"w-node-_6ee2f36e-8ff0-0717-7fa1-c2e14037c796-3a95260b"} href={"#"} className={"wrapper is--course w-inline-block"}>
              <div className={"course-image-wrapper"}>
                <img src={"/images/home/sams-solutions-qsk-ifUucWE-unsplash-ddff0b33.webp"} loading={"lazy"} alt={""} className={"course-image"} width={1920} height={1277} decoding="async" />
              </div>
              <div className={"course-content"}>
                <div className={"chips is--green"}>
                  <div className={"medium-xs"}>
                    {"Basic"}
                  </div>
                </div>
                <h3 className={"h3 is--max-width-440"}>
                  {"Management der psychischen Gesundheit am Arbeitsplatz. Systemischer und individueller Ansatz"}
                </h3>
              </div>
            </a>
          </div>
        </div>
      </section>
      <section className={"section is--margin-top-144--t-128--m-104"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <div className={"banner is--spacing-32-32--m-24-32 is--radius-6 is--height-600--m-520 is--v-flex-center-center is--practice"}>
            <div className={"wrapper is--v-flex-center-top is--max-width-408"}>
              <h2 className={"h2 is--white is--center is--margin-bottom-16"}>
                {"Bewährte Praktiken und Standards der ESOSH-Fachgruppen"}
              </h2>
              <p className={"regular-l is--white is--center is--margin-bottom-24"}>
                {"Die vollständige Liste verfügbarer Dokumente finden Sie in der ESOSH-Wissensdatenbank."}
              </p>
              <a href={"#"} className={"btn is--secondary is--white-btn w-button"}>
                {"Praktiken ansehen"}
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className={"section is--margin-top-144--t-128--m-104 is--margin-bottom-144--t-128--m-104"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <h2 className={"h2 is--margin-bottom-40"}>
            {"Das bieten wir Ihnen"}
          </h2>
          <div className={"w-layout-grid is--grid-4-columns--t-2--m-1"}>
            <div id={"w-node-e34f6418-fd89-5a0f-0d63-008e1540b400-3a95260b"} className={"block is--radius-6 is--accent-light-bg is--spacing-32-32--m-24-32"}>
              <img src={"/images/home/Brain-aaa97dc7.svg"} loading={"lazy"} alt={""} className={"is--icon-size-40 is--margin-bottom-40"} />
              <h3 className={"h3 is--margin-bottom-12"}>
                <strong>
                  {"Wissen, das zählt"}
                </strong>
              </h3>
              <p className={"regular-l"}>
                {"Andere haben Ihre Fragen zum Arbeitsschutz bereits gelöst — erfahren Sie bei uns, wie."}
              </p>
            </div>
            <div id={"w-node-_8450b4ce-6ee2-a921-8c2c-b1107e1990d2-3a95260b"} className={"block is--radius-6 is--accent-light-bg is--spacing-32-32--m-24-32"}>
              <img src={"/images/home/Idea-adcf02ed.svg"} loading={"lazy"} alt={""} className={"is--icon-size-40 is--margin-bottom-40"} />
              <h3 className={"h3 is--margin-bottom-12"}>
                <strong>
                  {"Offene Projekte"}
                </strong>
              </h3>
              <p className={"regular-l"}>
                {"Hier finden Sie aktuelle Hinweise, wie Sie sich weiterentwickeln können."}
              </p>
            </div>
            <div id={"w-node-_2be49470-7540-86ac-5975-dc6c527364a6-3a95260b"} className={"block is--radius-6 is--accent-light-bg is--spacing-32-32--m-24-32"}>
              <img src={"/images/home/Checkmark-Shield-914e3ddb.svg"} loading={"lazy"} alt={""} className={"is--icon-size-40 is--margin-bottom-40"} />
              <h3 className={"h3 is--margin-bottom-12"}>
                <strong>
                  {"Hochwertige Weiterbildung"}
                </strong>
              </h3>
              <p className={"regular-l"}>
                {"Zugang zu erfahrenen Trainerinnen und Trainern, anerkannten Kursen und wirksamen Bildungsprogrammen zum Arbeitsschutz."}
              </p>
            </div>
            <div id={"w-node-_937e1218-5f73-bb69-a6b0-40558164f1b4-3a95260b"} className={"block is--radius-6 is--accent-light-bg is--spacing-32-32--m-24-32"}>
              <img src={"/images/home/Purchase-74439efd.svg"} loading={"lazy"} alt={""} className={"is--icon-size-40 is--margin-bottom-40"} />
              <h3 className={"h3 is--margin-bottom-12"}>
                <strong>
                  {"Kostenfreie Teilnahme"}
                </strong>
              </h3>
              <p className={"regular-l"}>
                {"Wir möchten Wissen und Erfahrung rund um Sicherheit so zugänglich wie möglich machen."}
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
