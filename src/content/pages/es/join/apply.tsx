/* Public ESOSH content — clean enrollment application page (no hero photo). */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EnrollmentCaptchaGate } from "@/components/EnrollmentCaptchaGate";

/** RU: Чиста ES-сторінка форми вступу. EN: Clean Spanish enrollment apply page. */
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
                  {"Solicitud"}
                </span>
                {" de ingreso a ESOSH"}
              </h1>
            </div>
          </div>
        </div>
      </section>
      <section className="section is--section-spacing enrollment-apply-body">
        <div className="w-layout-blockcontainer container w-container">
          <div className="wrapper is--max-width-720 is--margin-bottom-40">
            <p className="regular-l is--margin-bottom-16">
              Complete la solicitud en varios pasos desde un ordenador o un teléfono. El sistema muestra un
              nivel profesional preliminar; el nivel definitivo lo confirma un administrador de ESOSH tras
              revisar los documentos.
            </p>
            <p className="regular-s is--margin-bottom-16">
              Los datos se tratan para la revisión de la solicitud y el registro de miembros. Los mensajes
              de servicio obligatorios (estado de la solicitud, peticiones de documentos) son distintos del
              marketing opcional: los confirmará en el último paso.
            </p>
            <div className="enrollment-prep">
              <p className="enrollment-prep__title">Los documentos son opcionales</p>
              <ul className="enrollment-prep__list">
                <li>foto, diploma, certificados, prueba de experiencia (PDF/JPG/PNG);</li>
                <li>en el último paso puede arrastrar y soltar archivos de una vez — o omitirlo.</li>
              </ul>
              <p className="enrollment-prep__note">
                Puede enviar la solicitud sin archivos. Los documentos agilizan la revisión. Los archivos no
                se restauran tras actualizar la página.
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
