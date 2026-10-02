/* Public privacy policy (typical UK / international template). */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PRIVACY_NOTICE_VERSION } from "@/lib/consent";

/** RU: Політика конфіденційності EN. EN: Privacy policy content. */
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
                      <span className={"is--accent"}>{"Datenschutz"}</span>
                      {"richtlinie"}
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
                {`Version ${PRIVACY_NOTICE_VERSION}`}
              </p>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"1. Datenverantwortlicher"}</h2>
                <p className={"regular-l"}>
                  {
                    "Verantwortlicher für personenbezogene Daten ist die Vereinigung ESOSH (European Society of Occupational Safety & Health), „ESOSH“, „wir“. Kontakt für Datenschutzanfragen: office@esosh.net."
                  }
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"2. Von uns verarbeitete Daten"}</h2>
                <p className={"regular-l is--margin-bottom-12"}>
                  {"Abhängig davon, wie Sie die Website nutzen, können wir Folgendes verarbeiten:"}
                </p>
                <ul className={"regular-l"}>
                  <li>{"Identitäts- und Kontaktdaten (Name, E-Mail, Telefon, Organisation, Rolle);"}</li>
                  <li>{"über das Kontaktformular übermittelte Nachrichten;"}</li>
                  <li>{"Daten des Mitgliedschafts-/Registrierungsantrags und unterstützende Dateien;"}</li>
                  <li>{"technische Daten (IP, Browsertyp, Cookies wie in der Cookie-Richtlinie beschrieben);"}</li>
                  <li>{"Kommunikationsdaten über Widgets von Drittanbietern (z. B. Binotel), sofern Sie damit einverstanden sind;"}</li>
                  <li>
                    {"Daten vom Drittanbieter-Player YouTube auf Schulungsseiten, wenn Sie der Kategorie „Marketing“ zustimmen."}
                  </li>
                </ul>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"3. Zwecke und Rechtsgrundlagen"}</h2>
                <p className={"regular-l"}>
                  {"Wir verarbeiten Daten zum Betrieb der Website; auf Anfragen antworten; Mitgliedschaftsanträge prüfen; das Mitgliederverzeichnis führen; die satzungsmäßigen Ziele des Vereins verfolgen; und die Sicherheit schützen. Zu den rechtlichen Grundlagen können die Einwilligung, die Erfüllung eines Vertrags/Mitgliedschaftsverhältnisses, berechtigte Interessen und rechtliche Verpflichtungen nach ukrainischem Recht (und gegebenenfalls der DSGVO für Personen im EWR) gehören."}
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"4. Empfänger und internationale Übermittlungen"}</h2>
                <p className={"regular-l"}>
                  {"Zu den Infrastrukturanbietern können Vercel, Neon und Vercel Blob gehören. Für E-Mail-Benachrichtigungen kann ein Anbieter wie Brevo verwendet werden. Einsendungen von Kontaktformularen können über einen konfigurierten Webhook weitergeleitet werden. Binotel-Widgets werden nur nach Zustimmung zur Kategorie „Kommunikation“ geladen. Der YouTube-Player auf Schulungsseiten wird nur nach Zustimmung des Marketings geladen. Auftragsverarbeitervereinbarungen (DPAs) werden gesondert abgeschlossen. Überweisungen außerhalb der Ukraine/des EWR basieren auf den von diesen Anbietern angebotenen Schutzmaßnahmen."}
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"5. Aufbewahrung"}</h2>
                <p className={"regular-l"}>
                  {"Kontaktnachrichten werden so lange aufbewahrt, wie es für die Beantwortung und Aufbewahrung von Aufzeichnungen erforderlich ist (ungefähr bis zu 24 Monate, es sei denn, das Gesetz schreibt eine längere Frist vor). Bewerbungen und Mitgliedschaftsdaten werden für den Prüfungszeitraum und die Mitgliedschaftsbeziehung und anschließend gemäß den Archivierungsrichtlinien des Vereins aufbewahrt."}
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"6. Ihre Rechte"}</h2>
                <p className={"regular-l"}>
                  {
                    "Sie können office@esosh.net kontaktieren, um Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch, Widerruf der Einwilligung und — soweit anwendbar — Datenübertragbarkeit zu verlangen. Sie können auch bei einer Aufsichtsbehörde in Ihrer Rechtsordnung Beschwerde einlegen."
                  }
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"7. Kinder"}</h2>
                <p className={"regular-l"}>
                  {
                    "Die Website richtet sich nicht an Kinder unter 16 Jahren. Wir erheben wissentlich keine Daten von Kindern. Wenn Sie glauben, dass ein Kind Daten übermittelt hat, schreiben Sie an office@esosh.net."
                  }
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"8. Cookies"}</h2>
                <p className={"regular-l"}>
                  {"Siehe die "}
                  <a href={"/de/cookie-policy"}>{"Cookie-Richtlinie"}</a>
                  {" für Einzelheiten."}
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"9. Änderungen"}</h2>
                <p className={"regular-l"}>
                  {"Wir können diese Richtlinie aktualisieren. Die aktuelle Version wird auf dieser Seite mit einer aktualisierten Versionsnummer veröffentlicht. Wesentliche Änderungen erfordern gegebenenfalls eine erneute Zustimmung."}
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
