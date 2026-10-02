/* Public ESOSH content — clean enrollment application page (no hero photo). */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EnrollmentCaptchaGate } from "@/components/EnrollmentCaptchaGate";

/** RU: Чиста DE-сторінка форми вступу. EN: Clean German enrollment apply page. */
export default function PageContent() {
  return (
    <>
      <section className="section enrollment-apply-top">
        <Header />
        <div className="wrapper is--accent-light-bg">
          <div className="w-layout-blockcontainer container w-container">
            <div className="enrollment-apply-heading">
              <h1 className={"h1"}>
                <span className={"is--accent"}>
                  {"Antrag"}
                </span>
                {" auf Beitritt zu ESOSH"}
              </h1>
            </div>
          </div>
        </div>
      </section>
      <section className="section is--section-spacing enrollment-apply-body">
        <div className="w-layout-blockcontainer container w-container">
          <div className="wrapper is--max-width-720 is--margin-bottom-40">
            <p className="regular-l is--margin-bottom-16">
              Füllen Sie den mehrstufigen Antrag am Computer oder Smartphone aus. Das System zeigt eine
              vorläufige Qualifikationsstufe; die endgültige Stufe bestätigt ein ESOSH-Administrator nach
              Prüfung der Unterlagen.
            </p>
            <p className="regular-s is--margin-bottom-16">
              Die Daten werden zur Prüfung des Antrags und für das Mitgliederverzeichnis verarbeitet.
              Obligatorische Service-Nachrichten (Antragsstatus, Dokumentenanforderungen) sind von optionalem
              Marketing getrennt — Sie bestätigen dies im letzten Schritt.
            </p>
            <div className="enrollment-prep">
              <p className="enrollment-prep__title">Unterlagen sind optional</p>
              <ul className="enrollment-prep__list">
                <li>Foto, Diplom, Zertifikate, Erfahrungsnachweise (PDF/JPG/PNG);</li>
                <li>im letzten Schritt können Sie Dateien per Drag-and-Drop hochladen — oder überspringen.</li>
              </ul>
              <p className="enrollment-prep__note">
                Sie können den Antrag auch ohne Dateien absenden. Unterlagen beschleunigen die Prüfung.
                Dateien werden nach einem Neuladen der Seite nicht wiederhergestellt.
              </p>
            </div>
          </div>
          <EnrollmentCaptchaGate />
        </div>
      </section>
      <Footer />
    </>
  );
}
