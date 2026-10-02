/* Public ESOSH content — clean enrollment application page (no hero photo). */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EnrollmentCaptchaGate } from "@/components/EnrollmentCaptchaGate";

/** RU: Чиста FR-сторінка форми вступу. EN: Clean French enrollment apply page. */
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
                  {"Candidature"}
                </span>
                {" pour rejoindre ESOSH"}
              </h1>
            </div>
          </div>
        </div>
      </section>
      <section className="section is--section-spacing enrollment-apply-body">
        <div className="w-layout-blockcontainer container w-container">
          <div className="wrapper is--max-width-720 is--margin-bottom-40">
            <p className="regular-l is--margin-bottom-16">
              Remplissez la candidature en plusieurs étapes depuis un ordinateur ou un téléphone. Le système
              affiche un niveau professionnel provisoire ; le niveau définitif est confirmé par un
              administrateur ESOSH après examen des documents.
            </p>
            <p className="regular-s is--margin-bottom-16">
              Les données sont traitées pour l’examen de la candidature et le registre des membres. Les
              messages de service obligatoires (statut de la candidature, demandes de documents) sont
              distincts du marketing facultatif — vous les confirmerez à la dernière étape.
            </p>
            <div className="enrollment-prep">
              <p className="enrollment-prep__title">Les documents sont facultatifs</p>
              <ul className="enrollment-prep__list">
                <li>photo, diplôme, certificats, preuve d’expérience (PDF/JPG/PNG) ;</li>
                <li>à la dernière étape, vous pouvez glisser-déposer les fichiers en une fois — ou passer.</li>
              </ul>
              <p className="enrollment-prep__note">
                Vous pouvez soumettre sans fichiers. Les documents accélèrent l’examen. Les fichiers ne sont
                pas restaurés après un rafraîchissement de la page.
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
