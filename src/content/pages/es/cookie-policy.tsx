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
                      <span className={"is--accent"}>{"Política"}</span>
                      {" de cookies"}
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
                {`Versión ${CONSENT_POLICY_VERSION}`}
              </p>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"1. ¿Qué son las cookies?"}</h2>
                <p className={"regular-l"}>
                  {"Las cookies son pequeños archivos almacenados en su navegador. También podemos utilizar tecnologías similares (almacenamiento local) para recordar su elección de consentimiento."}
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"2. Categorías"}</h2>
                <div className={"wrapper is--rows-gap-12"}>
                  <p className={"regular-l"}>
                    <strong>{"Necesario. "}</strong>
                    {"Requerido para el funcionamiento del sitio, la seguridad y el idioma de la interfaz (incluidas las cookies de sesión next-intl/framework). Siempre encendido."}
                  </p>
                  <p className={"regular-l"}>
                    <strong>{"Comunicaciones. "}</strong>
                    {"Widgets de chat y devolución de llamada Binotel de terceros. Cargado sólo después de su consentimiento."}
                  </p>
                  <p className={"regular-l"}>
                    <strong>{"Analítica. "}</strong>
                    {"Aún no usado; reservado para el futuro."}
                  </p>
                  <p className={"regular-l"}>
                    <strong>{"Marketing. "}</strong>
                    {"Reproductor YouTube de terceros en páginas de entrenamiento (youtube-nocookie.com). Cargado sólo después de su consentimiento."}
                  </p>
                </div>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"3. Tabla de cookies (indicativa)"}</h2>
                <div className={"regular-l"}>
                  <p className={"is--margin-bottom-12"}>
                    <strong>{CONSENT_COOKIE_NAME}</strong>
                    {" — su registro de consentimiento (categorías, versión de la política, marca de tiempo). Propio, hasta ~12 meses."}
                  </p>
                  <p className={"is--margin-bottom-12"}>
                    <strong>{"NEXT_LOCALE / Cookies técnicas de Next.js"}</strong>
                    {" — idioma y funcionamiento de la aplicación. Necesario."}
                  </p>
                  <p className={"is--margin-bottom-12"}>
                    <strong>{"Binotel galletas"}</strong>
                    {" — sólo después del consentimiento de las Comunicaciones; establecido por widgets.binotel.com."}
                  </p>
                  <p className={"is--margin-bottom-12"}>
                    <strong>{"YouTube galletas"}</strong>
                    {" — solo después del consentimiento de marketing en las páginas de capacitación; establecido por youtube-nocookie.com/Google."}
                  </p>
                  <p>
                    <strong>{"esosh_admin_session"}</strong>
                    {" — solo personal/administrador; no forma parte del cartel de consentimiento público."}
                  </p>
                </div>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"4. Cómo cambiar el consentimiento"}</h2>
                <p className={"regular-l is--margin-bottom-12"}>
                  {"Puede abrir la configuración de cookies en cualquier momento o ver el banner nuevamente después de un cambio en la versión de la política."}
                </p>
                <OpenConsentSettingsButton className={"btn is--secondary w-button"}>
                  {"Configuración de cookies"}
                </OpenConsentSettingsButton>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"5. Política de privacidad"}</h2>
                <p className={"regular-l"}>
                  {"Para el tratamiento de datos personales consulte la "}
                  <a href={"/es/privacy-policy"}>{"política de privacidad"}</a>
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
