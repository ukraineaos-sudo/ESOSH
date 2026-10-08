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
                      <span className={"is--accent"}>{"Құпиялылық"}</span>
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
                {`Нұсқа ${PRIVACY_NOTICE_VERSION}`}
              </p>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"1. Деректер контроллері"}</h2>
                <p className={"regular-l"}>
                  {
                    "Жеке деректердің контроллері — ESOSH қауымдастығы (European Society of Occupational Safety & Health), «ESOSH», «біз». Құпиялылық сұраулары үшін байланыс: office@esosh.net."
                  }
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"2. Біз өңдейтін деректер"}</h2>
                <p className={"regular-l is--margin-bottom-12"}>
                  {"Сайтты қалай пайдаланып жатқаныңызға байланысты біз:"}
                </p>
                <ul className={"regular-l"}>
                  <li>{"жеке басын және байланыс мәліметтерін (тегі, электрондық пошта, телефон, ұйым, рөл);"}</li>
                  <li>{"байланыс нысанын пайдалану арқылы жіберілген хабарламалар;"}</li>
                  <li>{"мүшелік / тіркеу өтініші және қосымша құжаттар;"}</li>
                  <li>{"техникалық деректер (IP, браузер түрі, Cookie саясатында сипатталған cookie файлдары);"}</li>
                  <li>{"Егер сіз келісесіз, үшінші тараптар виджеттері арқылы байланыс деректері (мысалы Binotel)"}</li>
                  <li>
                    {"Маркетинг санатына келіссеңіз, оқу беттеріндегі үшінші тарап YouTube ойнатқышынан алынған деректер."}
                  </li>
                </ul>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"3. Мақсат және құқықтық негіздер"}</h2>
                <p className={"regular-l"}>
                  {"Біз веб-сайтты пайдалану үшін деректерді өңдейміз; сұрау салуларға жауап береміз; мүшелік өтініштерін қараймыз; мүшелік тізілімін сақтаймыз; қауымдастықтың заңды мақсаттарын жүзеге асырамыз; және қауіпсіздікті қорғаймыз. Құқықтық негіздер келісімді, келісімшарт / мүшелік қатынасын орындауды, заңды мүдделерді және Украина заңына сәйкес заңды міндеттемелерді (немесе, қажет болған жағдайда, ЕАЭО-дағы жеке тұлғалар үшін GDPR) қамти алады."}
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"4. Алушылар және халықаралық аударымдар"}</h2>
                <p className={"regular-l"}>
                  {"Инфрақұрылымдық провайдерлер Vercel, Neon және Vercel Blob-ты қамти алады. Электрондық пошта хабарламалары Brevo сияқты провайдерді пайдалана алады. Байланыс нысанының ұсыныстары конфигурацияланған веб-хаук арқылы жіберілуі мүмкін. Binotel виджеттер Коммуникациялар санатына келісім бергеннен кейін ғана жүктеледі. YouTube оқу беттеріндегі ойнатқыш Маркетинг келісімінен кейін ғана жүктеледі. Процессорлық келісімдер (DPA) жеке жасалады. Украина / ЕЭА-дан тыс жерлердегі трансфертер осы провайдерлер ұсынатын кепілдіктерге негізделеді."}
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"5. Сақтау мерзімі"}</h2>
                <p className={"regular-l"}>
                  {"Байланыс хаттары жауап беру және жазбаларды сақтау үшін қажетті уақыт бойы сақталады (шамамен 24 айға дейін, егер заң ұзағырақ талап етпесе). Өтінімдер мен мүшелік деректері қарау мерзімі мен мүшелік қатынасы үшін сақталады, содан кейін қауымдастықтың мұрағат саясатына сәйкес."}
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"6. Құқықтарыңыз"}</h2>
                <p className={"regular-l"}>
                  {
                    "Қол жеткізу, түзету, жою, шектеу, қарсылық білдіру, келісімді кері алу және қолданылатын жағдайда деректерді тасымалдау үшін office@esosh.net мекенжайына жаза аласыз. Сондай-ақ өз юрисдикцияңыздағы қадағалау органына шағым бере аласыз."
                  }
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"7. Балалар"}</h2>
                <p className={"regular-l"}>
                  {
                    "Сайт 16 жасқа толмаған балаларға арналмаған. Біз олардың деректерін біле тұра жинамаймыз. Бала дерек жіберді деп есептесеңіз, office@esosh.net мекенжайына жазыңыз."
                  }
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"8. Cookie"}</h2>
                <p className={"regular-l"}>
                  {"Толығырақ үшін қараңыз: "}
                  <a href={"/kk/cookie-policy"}>{"Cookie саясаты"}</a>
                  {"."}
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"9. Өзгерістер"}</h2>
                <p className={"regular-l"}>
                  {"Осы саясатты жаңартамыз. Қазіргі нұсқа осы бетте жаңартылған нұсқа нөмірімен жарияланады. Материалдық өзгерістер қажет болған жағдайда жаңа келісімді талап етуі мүмкін."}
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
