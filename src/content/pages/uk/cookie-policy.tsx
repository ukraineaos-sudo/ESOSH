/* Draft cookie policy — pending legal review. */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OpenConsentSettingsButton } from "@/components/consent/OpenConsentSettingsButton";
import { CONSENT_COOKIE_NAME, CONSENT_POLICY_VERSION } from "@/lib/consent";

/** RU: Політика cookies (типовий draft). EN: Cookie policy draft content. */
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
                      <span className={"is--accent"}>{"Політика"}</span>
                      {" cookies"}
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
                {`Версія ${CONSENT_POLICY_VERSION} · Draft — pending legal review. Не є юридичною консультацією; підлягає затвердженню юристом ESOSH.`}
              </p>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"1. Що таке cookies"}</h2>
                <p className={"regular-l"}>
                  {
                    "Cookies — невеликі файли, які зберігаються у вашому браузері. Ми також можемо використовувати аналогічні технології (localStorage) для збереження вашого вибору згоди."
                  }
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"2. Категорії"}</h2>
                <div className={"wrapper is--rows-gap-12"}>
                  <p className={"regular-l"}>
                    <strong>{"Необхідні. "}</strong>
                    {
                      "Потрібні для роботи сайту, безпеки та мови інтерфейсу (зокрема cookies локалі next-intl / сесії фреймворку). Завжди увімкнені."
                    }
                  </p>
                  <p className={"regular-l"}>
                    <strong>{"Комунікації. "}</strong>
                    {
                      "Сторонні віджети зворотного зв’язку та дзвінків Binotel. Завантажуються лише після вашої згоди."
                    }
                  </p>
                  <p className={"regular-l"}>
                    <strong>{"Аналітика / маркетинг. "}</strong>
                    {"Наразі не використовуються; зарезервовано на майбутнє."}
                  </p>
                </div>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"3. Таблиця (орієнтовно)"}</h2>
                <div className={"regular-l"}>
                  <p className={"is--margin-bottom-12"}>
                    <strong>{CONSENT_COOKIE_NAME}</strong>
                    {" — запис вашої згоди (категорії, версія політики, час). Перша сторона, до ~12 місяців."}
                  </p>
                  <p className={"is--margin-bottom-12"}>
                    <strong>{"NEXT_LOCALE / технічні cookies Next.js"}</strong>
                    {" — мова та робота додатку. Необхідні."}
                  </p>
                  <p className={"is--margin-bottom-12"}>
                    <strong>{"Cookies Binotel"}</strong>
                    {" — лише після згоди «Комунікації»; встановлюються доменом widgets.binotel.com."}
                  </p>
                  <p>
                    <strong>{"esosh_admin_session"}</strong>
                    {" — лише для staff-кабінету /admin; не є частиною публічного банера згоди."}
                  </p>
                </div>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"4. Як змінити згоду"}</h2>
                <p className={"regular-l is--margin-bottom-12"}>
                  {"Ви можете будь-коли відкрити налаштування cookies або змінити вибір у банері після оновлення версії політики."}
                </p>
                <OpenConsentSettingsButton className={"btn is--secondary w-button"}>
                  {"Налаштування cookies"}
                </OpenConsentSettingsButton>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"5. Політика конфіденційності"}</h2>
                <p className={"regular-l"}>
                  {"Докладніше про обробку персональних даних — у "}
                  <a href={"/privacy-policy"}>{"Політиці конфіденційності"}</a>
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
