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
                      <span className={"is--accent"}>{"Política"}</span>
                      {" de privacidad"}
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
                {`Versión ${PRIVACY_NOTICE_VERSION}`}
              </p>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"1. Controladora de datos"}</h2>
                <p className={"regular-l"}>
                  {
                    "El responsable del tratamiento de los datos personales es la asociación ESOSH (European Society of Occupational Safety & Health), «ESOSH», «nosotros». Contacto para solicitudes de privacidad: office@esosh.net."
                  }
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"2. Datos que procesamos"}</h2>
                <p className={"regular-l is--margin-bottom-12"}>
                  {"Dependiendo de cómo utilice el sitio, podemos procesar:"}
                </p>
                <ul className={"regular-l"}>
                  <li>{"datos de identidad y contacto (nombre, correo electrónico, teléfono, organización, función);"}</li>
                  <li>{"mensajes enviados a través del formulario de contacto;"}</li>
                  <li>{"datos de solicitud de membresía/inscripción y archivos de respaldo;"}</li>
                  <li>{"datos técnicos (IP, tipo de navegador, cookies según se describe en la Política de Cookies);"}</li>
                  <li>{"datos de comunicaciones a través de widgets de terceros (por ejemplo, Binotel) si usted da su consentimiento;"}</li>
                  <li>
                    {"datos del jugador externo YouTube en las páginas de entrenamiento si usted acepta la categoría Marketing."}
                  </li>
                </ul>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"3. Finalidades y bases jurídicas"}</h2>
                <p className={"regular-l"}>
                  {"Procesamos datos para operar el sitio web; responder a consultas; revisar las solicitudes de membresía; mantener el registro de miembros; perseguir los objetivos estatutarios de la asociación; y proteger la seguridad. Las bases legales pueden incluir el consentimiento, la ejecución de un contrato/relación de membresía, intereses legítimos y obligaciones legales según la ley ucraniana (y, cuando corresponda, el RGPD para personas en el EEE)."}
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"4. Destinatarias y transferencias internacionales"}</h2>
                <p className={"regular-l"}>
                  {"Los proveedores de infraestructura pueden incluir Vercel, Neon y Vercel Blob. Las notificaciones por correo electrónico pueden utilizar un proveedor como Brevo. Los envíos de formularios de contacto se pueden reenviar a través de un webhook configurado. Los widgets Binotel se cargan solo después del consentimiento a la categoría Comunicaciones. El reproductor YouTube en las páginas de capacitación se carga solo después del consentimiento de Marketing. Los acuerdos de procesador (DPA) se celebran por separado. Las transferencias fuera de Ucrania/el EEE dependen de las garantías que ofrecen esos proveedores."}
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"5. Retención"}</h2>
                <p className={"regular-l"}>
                  {"Los mensajes de contacto se conservan durante el tiempo necesario para responder y mantener registros (indicativamente hasta 24 meses, a menos que la ley exija más tiempo). Las solicitudes y los datos de membresía se conservan durante el período de revisión y la relación de membresía, luego según la política de archivo de la asociación."}
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"6. Tus derechos"}</h2>
                <p className={"regular-l"}>
                  {
                    "Puede contactar con office@esosh.net para solicitar acceso, rectificación, supresión, limitación, oposición, retirada del consentimiento y portabilidad de los datos cuando proceda. También puede presentar una reclamación ante la autoridad de control de su jurisdicción."
                  }
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"7. Menores"}</h2>
                <p className={"regular-l"}>
                  {
                    "El sitio no está dirigido a menores de 16 años. No recopilamos conscientemente sus datos. Si cree que un menor ha enviado datos, escriba a office@esosh.net."
                  }
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"8. Cookies"}</h2>
                <p className={"regular-l"}>
                  {"Ver la "}
                  <a href={"/es/cookie-policy"}>{"Política de cookies"}</a>
                  {" para más detalles."}
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"9. Cambios"}</h2>
                <p className={"regular-l"}>
                  {"Es posible que actualicemos esta política. La versión actual se publica en esta página con un número de versión actualizado. Los cambios materiales pueden requerir un consentimiento renovado cuando sea necesario."}
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
