/* Public cookie policy (typical UK / international template). */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OpenConsentSettingsButton } from "@/components/consent/OpenConsentSettingsButton";
import { CONSENT_COOKIE_NAME, CONSENT_POLICY_VERSION } from "@/lib/consent";

/** RU: Політика cookies EN. EN: Cookie policy content. */
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
                      <span className={"is--accent"}>{"Cookie"}</span>
                      {"-Richtlinie"}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <div className={"hero-internal-image is--terms"} />
          </div>
        </div>
      </section>
      <section className={"section is--margin-top-144--t-128--m-104 is--margin-bottom-144--t-128--m-104"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <div className={"wrapper is--v-flex-center-top"}>
            <div className={"wrapper is--max-width-870 is--w-100p"}>
              <p className={"regular-s is--grey-60 is--margin-bottom-24"}>
                {`Version ${CONSENT_POLICY_VERSION}`}
              </p>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"1. Was Cookies sind"}</h2>
                <p className={"regular-l"}>
                  {"Cookies sind kleine Dateien, die in Ihrem Browser gespeichert werden. Wir können auch ähnliche Technologien (localStorage) verwenden, um Ihre Einwilligungsentscheidung zu speichern."}
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"2. Kategorien"}</h2>
                <div className={"wrapper is--rows-gap-12"}>
                  <p className={"regular-l"}>
                    <strong>{"Notwendig. "}</strong>
                    {"Erforderlich für den Betrieb der Website, die Sicherheit und die Sprache der Benutzeroberfläche (einschließlich Next-Intl-/Framework-Sitzungscookies). Immer an."}
                  </p>
                  <p className={"regular-l"}>
                    <strong>{"Kommunikation. "}</strong>
                    {"Rückruf- und Chat-Widgets von Drittanbietern Binotel. Laden nur nach Ihrer Einwilligung."}
                  </p>
                  <p className={"regular-l"}>
                    <strong>{"Analytik. "}</strong>
                    {"Noch nicht verwendet; für die Zukunft reserviert."}
                  </p>
                  <p className={"regular-l"}>
                    <strong>{"Marketing. "}</strong>
                    {"YouTube-Player eines Drittanbieters auf Trainingsseiten (youtube-nocookie.com). Laden nur nach Ihrer Einwilligung."}
                  </p>
                </div>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"3. Cookie-Tabelle (indikativ)"}</h2>
                <div className={"regular-l"}>
                  <p className={"is--margin-bottom-12"}>
                    <strong>{CONSENT_COOKIE_NAME}</strong>
                    {" – Ihr Einwilligungsdatensatz (Kategorien, Richtlinienversion, Zeitstempel). Erstanbieter, bis zu ~12 Monate."}
                  </p>
                  <p className={"is--margin-bottom-12"}>
                    <strong>{"NEXT_LOCALE / Technische Cookies von Next.js"}</strong>
                    {" — Sprach- und App-Bedienung. Notwendig."}
                  </p>
                  <p className={"is--margin-bottom-12"}>
                    <strong>{"Binotel Cookies"}</strong>
                    {" — nur nach Zustimmung der Kommunikationspartner; eingestellt von widgets.binotel.com."}
                  </p>
                  <p className={"is--margin-bottom-12"}>
                    <strong>{"YouTube Cookies"}</strong>
                    {" — nur nach Marketing-Einwilligung auf Schulungsseiten; gesetzt von youtube-nocookie.com / Google."}
                  </p>
                  <p>
                    <strong>{"esosh_admin_session"}</strong>
                    {" — nur Personal/Administrator; nicht Teil des öffentlichen Zustimmungsbanners."}
                  </p>
                </div>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"4. So ändern Sie die Einwilligung"}</h2>
                <p className={"regular-l is--margin-bottom-12"}>
                  {"Sie können die Cookie-Einstellungen jederzeit öffnen oder das Banner nach einer Änderung der Richtlinienversion wieder sehen."}
                </p>
                <OpenConsentSettingsButton className={"btn is--secondary w-button"}>
                  {"Cookie-Einstellungen"}
                </OpenConsentSettingsButton>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"5. Datenschutzrichtlinie"}</h2>
                <p className={"regular-l"}>
                  {"Zur Verarbeitung personenbezogener Daten siehe die "}
                  <a href={"/de/privacy-policy"}>{"Datenschutzrichtlinie"}</a>
                  {"."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
