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
              {"Construir un nivel europeo de"}
              <span className={"is--accent"}>
                {" seguridad y salud en el trabajo"}
              </span>
              {" en Ucrania"}
            </h1>
            <div className={"wrapper is--max-width-456"}>
              <p className={"regular-l is--margin-bottom-24"}>
                {"La Sociedad Europea de Seguridad y Salud en el Trabajo ESOSH forma valores, eleva el nivel de conocimiento, influye en los cambios legislativos y mantiene vínculos con organizaciones internacionales líderes para hacer que el trabajo en Ucrania sea seguro. La participación es gratuita: únase y mejore."}
              </p>
              <a href={"/es/businesses"} className={"btn is--primary w-button"}>
                {"Me interesa"}
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
              {"Noticias y eventos"}
            </h2>
            <a href={"/es/news"} className={"btn is--tertiary w-inline-block"}>
              <div className={"wrapper is--h-flex-center-left is--gap-4-columns"}>
                <div className={"bold-m"}>
                  {"Más noticias"}
                </div>
                <img src={"/images/home/Chevron-Right-1f56be04.svg"} loading={"lazy"} alt={""} className={"is--icon-size-16"} />
              </div>
            </a>
          </div>
          <div className={"collection-list-wrapper w-dyn-list"}>
            <div role={"list"} className={"collection-list is--grid-3-columns--a-1-column w-dyn-items"}>
              <CmsNewsListItems locale="es" limit={3} />
            </div>
          </div>
        </div>
      </section>
      <section className={"section is--margin-top-144--t-128--m-104"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <div className={"wrapper is--h-flex-bottom-space-between is--margin-bottom-40"}>
            <h2 className={"h2"}>
              {"Para empresas"}
            </h2>
            <a href={"/es/businesses"} className={"btn is--tertiary w-inline-block"}>
              <div className={"wrapper is--h-flex-center-left is--gap-4-columns"}>
                <div className={"bold-m"}>
                  {"Descubra más"}
                </div>
                <img src={"/images/home/Chevron-Right-1f56be04.svg"} loading={"lazy"} alt={""} className={"is--icon-size-16"} />
              </div>
            </a>
          </div>
          <div className={"wrapper is--grid-block-2-columns--a-1column"}>
            <a href={"/es/education/projects"} className={"block is--spacing-32-32--m-24-32 is--border-grey-7 is--v-flex-start-start w-inline-block"}>
              <img src={"/images/home/Presentation-file-d50be3ea.svg"} loading={"lazy"} alt={""} className={"is--icon-size-40 is--margin-bottom-32"} />
              <div className={"wrapper is--v-flex-start-space-between is--grow"}>
                <div className={"wrapper is--max-width-480 is--margin-bottom-32"}>
                  <h3 className={"h3 is--margin-bottom-12"}>
                    {"Evaluación de riesgos"}
                  </h3>
                  <p className={"regular-l"}>
                    {"Evaluación de riesgos, auditorías, apoyo a proyectos y programas de seguridad específicos. Nuestros especialistas mejoran constantemente sus habilidades en el extranjero, implementan prácticas de prevención de lesiones en Ucrania y pueden ser útiles en su negocio."}
                  </p>
                </div>
                <div className={"btn is--tertiary is--no-link"}>
                  <div className={"wrapper is--h-flex-center-left is--gap-4-columns"}>
                    <div className={"bold-m"}>
                      {"Nuestros proyectos"}
                    </div>
                    <img src={"/images/home/Chevron-Right-1f56be04.svg"} loading={"lazy"} alt={""} className={"is--icon-size-16"} />
                  </div>
                </div>
              </div>
            </a>
            <a href={"/es/education/courses"} className={"block is--spacing-32-32--m-24-32 is--border-grey-7 is--v-flex-start-start w-inline-block"}>
              <img src={"/images/home/Persons-348db007.svg"} loading={"lazy"} alt={""} className={"is--icon-size-40 is--margin-bottom-32"} />
              <div className={"wrapper is--v-flex-start-space-between is--grow"}>
                <div className={"wrapper is--max-width-480 is--margin-bottom-32"}>
                  <h3 className={"h3 is--margin-bottom-12"}>
                    {"Programas de formación"}
                  </h3>
                  <p className={"regular-l"}>
                    {"Cursos internacionales de seguridad para especialistas en seguridad y salud en el trabajo, ingenieros y técnicos, mandos altos y medios."}
                  </p>
                </div>
                <div className={"btn is--tertiary is--no-link"}>
                  <div className={"wrapper is--h-flex-center-left is--gap-4-columns"}>
                    <div className={"bold-m"}>
                      {"Elige un curso"}
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
                  {"Somos una asociación profesional de profesionales de la seguridad y salud en el trabajo."}
                </h2>
                <p className={"regular-l is--margin-bottom-32"}>
                  {"La Sociedad Europea de Seguridad y Salud Ocupacional (ESOSH) es una asociación profesional de especialistas en seguridad ocupacional que promueve buenas prácticas internacionales y desarrolla competencias en seguridad y salud en el trabajo. "}
                  {"Los expertos de la asociación son profesionales con experiencia práctica en empresas internacionales y cualificaciones europeas."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <HomeMembersStat locale="es" />
      <section className={"section is--margin-top-144--t-128--m-104"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <div className={"wrapper is--h-flex-center-center is--margin-bottom-64"}>
            <h2 className={"h2 is--center is--max-width-648"}>
              {"Únete a la comunidad y desarróllate en el campo de la seguridad y salud en el trabajo"}
            </h2>
          </div>
          <div className={"w-layout-grid is--grid-links-image"}>
            <div id={"w-node-e9e4dc40-f9df-be5c-f780-cd2efd0543a3-3a95260b"} className={"wrapper is--v-flex-start-start is--rows-gap-32 is--max-width-560"}>
              <a href={"/es/join/participation"} className={"wrapper is--no-link is--h-flex-top-left is--gap-24 w-inline-block"}>
                <img src={"/images/home/Diamond-1f302500.svg"} loading={"lazy"} alt={""} className={"is--icon-size-32"} />
                <div className={"wrapper"}>
                  <div className={"wrapper is--h-flex-center-left--m-top is--gap-16 is--margin-bottom-12"}>
                    <h3 className={"h3"}>
                      {"Participación en ESOSH para empresas"}
                    </h3>
                    <img src={"/images/home/Arrow-Right-dfaefc46.svg"} loading={"lazy"} alt={""} className={"is--icon-size-20"} />
                  </div>
                  <p className={"regular-l"}>
                    {"Únase a nosotros para desarrollar juntos e implementar buenas prácticas y promover la salud y seguridad ocupacional en Ucrania."}
                  </p>
                </div>
              </a>
              <a href={"/es/join/enrollment"} className={"wrapper is--no-link is--h-flex-top-left is--gap-24 w-inline-block"}>
                <img src={"/images/home/Inventory-75285e5a.svg"} loading={"lazy"} alt={""} className={"is--icon-size-32"} />
                <div className={"wrapper"}>
                  <div className={"wrapper is--h-flex-center-left--m-top is--gap-16 is--margin-bottom-12"}>
                    <h3 className={"h3"}>
                      {"Únase a ESOSH para profesionales"}
                    </h3>
                    <img src={"/images/home/Arrow-Right-dfaefc46.svg"} loading={"lazy"} alt={""} className={"is--icon-size-20"} />
                  </div>
                  <p className={"regular-l"}>
                    {"Únase a ESOSH y obtenga acceso a conocimientos y recursos avanzados sobre seguridad y salud en el trabajo."}
                  </p>
                </div>
              </a>
              <a href={"/es/join/codex"} className={"wrapper is--no-link is--h-flex-top-left is--gap-24 w-inline-block"}>
                <img src={"/images/home/Documents-e8daedbf.svg"} loading={"lazy"} alt={""} className={"is--icon-size-32"} />
                <div className={"wrapper"}>
                  <div className={"wrapper is--h-flex-center-left--m-top is--gap-16 is--margin-bottom-12"}>
                    <h3 className={"h3"}>
                      {"Código de conducta"}
                    </h3>
                    <img src={"/images/home/Arrow-Right-dfaefc46.svg"} loading={"lazy"} alt={""} className={"is--icon-size-20"} />
                  </div>
                  <p className={"regular-l"}>
                    {"Nuestro Código de conducta define nuestros valores y estándares fundamentales, que nos esforzamos por implementar en nuestro trabajo e interacciones."}
                  </p>
                </div>
              </a>
              <a href={"/es/join/terms"} className={"wrapper is--no-link is--h-flex-top-left is--gap-24 w-inline-block"}>
                <img src={"/images/home/Document-Info-b858472d.svg"} loading={"lazy"} alt={""} className={"is--icon-size-32"} />
                <div className={"wrapper"}>
                  <div className={"wrapper is--h-flex-center-left--m-top is--gap-16 is--margin-bottom-12"}>
                    <h3 className={"h3"}>
                      {"Declaración de actividad"}
                    </h3>
                    <img src={"/images/home/Arrow-Right-dfaefc46.svg"} loading={"lazy"} alt={""} className={"is--icon-size-20"} />
                  </div>
                  <p className={"regular-l"}>
                    {"Nuestra Declaración define los principios y normas clave que rigen nuestras actividades y el funcionamiento de nuestra comunidad."}
                  </p>
                </div>
              </a>
              <a href={"/es/join/safety-league-best-practices"} className={"wrapper is--no-link is--h-flex-top-left is--gap-24 w-inline-block"}>
                <img src={"/images/home/User-Team-8fa295aa.svg"} loading={"lazy"} alt={""} className={"is--icon-size-32"} />
                <div className={"wrapper"}>
                  <div className={"wrapper is--h-flex-center-left--m-top is--gap-16 is--margin-bottom-12"}>
                    <h3 className={"h3"}>
                      {"ESOSH Grupos"}
                    </h3>
                    <img src={"/images/home/Arrow-Right-dfaefc46.svg"} loading={"lazy"} alt={""} className={"is--icon-size-20"} />
                  </div>
                  <p className={"regular-l"}>
                    {"Trabajamos juntos para crear nuevos estándares y buenas prácticas para la seguridad en el lugar de trabajo."}
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
              {"Nuestros cursos"}
            </h2>
            <a href={"/es/education/courses"} className={"btn is--tertiary w-inline-block"}>
              <div className={"wrapper is--h-flex-center-left is--gap-4-columns"}>
                <div className={"bold-m"}>
                  {"Ver más"}
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
                    {"Básico"}
                  </div>
                </div>
                <h3 className={"h3 is--max-width-440"}>
                  {"Sin barreras + seguridad. Seguridad de empleados y visitantes con discapacidad"}
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
                    {"Básico"}
                  </div>
                </div>
                <h3 className={"h3 is--max-width-440"}>
                  {"Seguridad y salud en el trabajo (SSA) en tiempos de guerra. Riesgos durante la guerra"}
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
                    {"Básico"}
                  </div>
                </div>
                <h3 className={"h3 is--max-width-440"}>
                  {"Gestión de la salud mental en el trabajo. Enfoque sistémico e individual."}
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
                {"Mejores prácticas y estándares creados por ESOSH grupos profesionales"}
              </h2>
              <p className={"regular-l is--white is--center is--margin-bottom-24"}>
                {"Acceda a la lista completa de documentos disponibles en nuestra Base de Conocimiento ESOSH."}
              </p>
              <a href={"#"} className={"btn is--secondary is--white-btn w-button"}>
                {"Prácticas"}
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className={"section is--margin-top-144--t-128--m-104 is--margin-bottom-144--t-128--m-104"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <h2 className={"h2 is--margin-bottom-40"}>
            {"Te garantizamos"}
          </h2>
          <div className={"w-layout-grid is--grid-4-columns--t-2--m-1"}>
            <div id={"w-node-e34f6418-fd89-5a0f-0d63-008e1540b400-3a95260b"} className={"block is--radius-6 is--accent-light-bg is--spacing-32-32--m-24-32"}>
              <img src={"/images/home/Brain-aaa97dc7.svg"} loading={"lazy"} alt={""} className={"is--icon-size-40 is--margin-bottom-40"} />
              <h3 className={"h3 is--margin-bottom-12"}>
                <strong>
                  {"Conocimientos importantes"}
                </strong>
              </h3>
              <p className={"regular-l"}>
                {"Alguien más ya ha solucionado tus problemas de seguridad laboral, infórmate con nosotros."}
              </p>
            </div>
            <div id={"w-node-_8450b4ce-6ee2-a921-8c2c-b1107e1990d2-3a95260b"} className={"block is--radius-6 is--accent-light-bg is--spacing-32-32--m-24-32"}>
              <img src={"/images/home/Idea-adcf02ed.svg"} loading={"lazy"} alt={""} className={"is--icon-size-40 is--margin-bottom-40"} />
              <h3 className={"h3 is--margin-bottom-12"}>
                <strong>
                  {"Proyectos abiertos"}
                </strong>
              </h3>
              <p className={"regular-l"}>
                {"Aquí podrás encontrar información actualizada sobre cómo puedes mejorar."}
              </p>
            </div>
            <div id={"w-node-_2be49470-7540-86ac-5975-dc6c527364a6-3a95260b"} className={"block is--radius-6 is--accent-light-bg is--spacing-32-32--m-24-32"}>
              <img src={"/images/home/Checkmark-Shield-914e3ddb.svg"} loading={"lazy"} alt={""} className={"is--icon-size-40 is--margin-bottom-40"} />
              <h3 className={"h3 is--margin-bottom-12"}>
                <strong>
                  {"Formación de calidad"}
                </strong>
              </h3>
              <p className={"regular-l"}>
                {"Acceso a los mejores formadores, los cursos más reconocidos y programas educativos efectivos en seguridad laboral."}
              </p>
            </div>
            <div id={"w-node-_937e1218-5f73-bb69-a6b0-40558164f1b4-3a95260b"} className={"block is--radius-6 is--accent-light-bg is--spacing-32-32--m-24-32"}>
              <img src={"/images/home/Purchase-74439efd.svg"} loading={"lazy"} alt={""} className={"is--icon-size-40 is--margin-bottom-40"} />
              <h3 className={"h3 is--margin-bottom-12"}>
                <strong>
                  {"Participación gratuita "}
                </strong>
              </h3>
              <p className={"regular-l"}>
                {"Nos esforzamos por hacer que el conocimiento y la experiencia en seguridad sean lo más accesibles posible."}
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
