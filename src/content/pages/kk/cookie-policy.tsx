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
                      {" саясаты"}
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
                {`Нұсқа ${CONSENT_POLICY_VERSION}`}
              </p>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"1. Cookie дегеніміз не"}</h2>
                <p className={"regular-l"}>
                  {"Cookie-тер сіздің браузеріңізде сақталған шағын файлдар. Біз сіздің келісіміңізді есте сақтау үшін ұқсас технологияларды (localStorage) пайдаланамыз."}
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"2. Категориялар"}</h2>
                <div className={"wrapper is--rows-gap-12"}>
                  <p className={"regular-l"}>
                    <strong>{"Қажетті. "}</strong>
                    {"Сайттың жұмыс істеуі, қауіпсіздік және интерфейс тілі үшін қажет (оның ішінде next-intl / фреймворк сессия cookie-лері). Әрқашан қосулы."}
                  </p>
                  <p className={"regular-l"}>
                    <strong>{"Коммуникациялар. "}</strong>
                    {"Үшінші тараптың Binotel кері қоңырау және чат виджеттері. Сіздің келісіміңізден кейін ғана жүктеледі."}
                  </p>
                  <p className={"regular-l"}>
                    <strong>{"Аналитика. "}</strong>
                    {"Әлі қолданылмаған, болашаққа арналған."}
                  </p>
                  <p className={"regular-l"}>
                    <strong>{"Маркетинг. "}</strong>
                    {"Оқу беттеріндегі үшінші тарап YouTube ойнатқышы (youtube-nocookie.com). Сіздің келісіміңізбен ғана жүктеледі."}
                  </p>
                </div>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"3. Cookie кестесі (анықтама)"}</h2>
                <div className={"regular-l"}>
                  <p className={"is--margin-bottom-12"}>
                    <strong>{CONSENT_COOKIE_NAME}</strong>
                    {" сіздің келісіміңіздің жазбасы (категориялар, саясат нұсқасы, уақыт мөрі)."}
                  </p>
                  <p className={"is--margin-bottom-12"}>
                    <strong>{"NEXT_LOCALE / Next.js техникалық файлдары"}</strong>
                    {" тіл және қосымшаларды қолдану."}
                  </p>
                  <p className={"is--margin-bottom-12"}>
                    <strong>{"Binotel cookie-лері"}</strong>
                    {" — тек Коммуникациялар келісімінен кейін; widgets.binotel.com белгілейді."}
                  </p>
                  <p className={"is--margin-bottom-12"}>
                    <strong>{"YouTube cookie-лері"}</strong>
                    {" — тек оқу беттерінде Маркетинг келісімінен кейін; youtube-nocookie.com / Google белгілейді."}
                  </p>
                  <p>
                    <strong>{"esosh_admin_session"}</strong>
                    {" — тек қызметкер /admin; қоғамдық келісім баннеріне кірмейді."}
                  </p>
                </div>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"4. Келісімді қалай өзгерту керек"}</h2>
                <p className={"regular-l is--margin-bottom-12"}>
                  {"Сіз кез келген уақытта cookie баптауларын аша аласыз немесе саясат нұсқасы жаңарғаннан кейін баннерді қайта көре аласыз."}
                </p>
                <OpenConsentSettingsButton className={"btn is--secondary w-button"}>
                  {"Cookie баптаулары"}
                </OpenConsentSettingsButton>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"5. Құпиялылық саясаты"}</h2>
                <p className={"regular-l"}>
                  {"Жеке деректерді өңдеу үшін "}
                  <a href={"/kk/privacy-policy"}>{"Құпиялылық саясаты"}</a>
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
