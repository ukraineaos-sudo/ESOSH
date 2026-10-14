/* Public ESOSH content captured 2026-09-07. Edit text and media here. */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CoursesCatalogSection } from "@/components/cms/CoursesCatalogSection";

/** RU: Содержимое страницы. EN: Static page content. */
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
                      {"Desarrolle sus "}
                      <span className={"is--accent"}>
                        {"conocimientos"}
                      </span>
                      {" y competencias en seguridad laboral"}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className={"w-layout-blockcontainer w-container"}>
        <div className={"wrapper is--grid-text-spacing"}>
          <div className={"wrapper is--max-width-584"}>
            <div className={"wrapper"}>
              <h2 className={"h2 is--margin-bottom-24"}>
                {"Propuesta Integral de Seguridad Ocupacional"}
              </h2>
            </div>
            <div className={"text-spacing-wrapper is--margin-bottom-32"}>
              <p className={"regular-l"}>
                {"La Sociedad Europea de Seguridad y Salud Ocupacional (ESOSH) ha desarrollado una solución integral innovadora que combina las mejores prácticas europeas, herramientas de gestión de riesgos de última generación y programas de formación personalizados para empresas de diversos sectores."}
              </p>
              <div className={"bold-l is--w-100p"}>
                {"Regístrate llenando "}
              </div>
              <div className={"wrapper is--icons-list"}>
                <div className={"check-heading-wrapper is--w-100p"}>
                  <div className={"check-heading-wrapper__check"}>
                    <img src={"/images/join-participation/Check-299ab963.svg"} loading={"lazy"} alt={""} className={"is--icon-size-12"} />
                  </div>
                  <div className={"bold-l is--w-100p"}>
                    {"Minimizar los riesgos laborales y aumentar los niveles de seguridad."}
                  </div>
                </div>
                <div className={"check-heading-wrapper is--w-100p"}>
                  <div className={"check-heading-wrapper__check"}>
                    <img src={"/images/join-participation/Check-299ab963.svg"} loading={"lazy"} alt={""} className={"is--icon-size-12"} />
                  </div>
                  <div className={"bold-l is--w-100p"}>
                    {"Promover la salud y el bienestar de los empleados;"}
                  </div>
                </div>
                <div className={"check-heading-wrapper is--w-100p"}>
                  <div className={"check-heading-wrapper__check"}>
                    <img src={"/images/join-participation/Check-299ab963.svg"} loading={"lazy"} alt={""} className={"is--icon-size-12"} />
                  </div>
                  <div className={"bold-l is--w-100p"}>
                    {"Cultivar una cultura de Visión Cero orientada al daño cero"}
                  </div>
                </div>
              </div>
              <img src={"/images/join-participation/Check-299ab963.svg"} loading={"lazy"} alt={""} className={"is--icon-size-12"} />
              <img src={"/images/join-participation/Check-299ab963.svg"} loading={"lazy"} alt={""} className={"is--icon-size-12"} />
              <div className={"wrapper is--w-100p is--advantage is--purple"}>
                {"Esta solución todo en uno combina auditorías, consultoría, capacitación, herramientas digitales y soporte de expertos, lo que ayuda a que su negocio crezca de manera segura y sostenible."}
              </div>
              <p className={"regular-l"}>
                {"Puedes revisar la propuesta ESOSH en el siguiente enlace"}
                <a href={"https://drive.google.com/file/d/11U22c8DG-EmIGVDDWUP4kZw2DqpbrFiS/view?usp=sharing"}>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <CoursesCatalogSection locale="es" />
      <Footer />
    </>
  );
}
