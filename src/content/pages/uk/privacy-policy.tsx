/* Draft privacy policy — pending legal review. */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PRIVACY_NOTICE_VERSION } from "@/lib/consent";

/** RU: Політика конфіденційності (типовий draft). EN: Privacy policy draft content. */
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
                      {" конфіденційності"}
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
                {`Версія ${PRIVACY_NOTICE_VERSION} · Draft — pending legal review. Цей текст є типовим шаблоном і не є юридичною консультацією; підлягає затвердженню юристом асоціації ESOSH.`}
              </p>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"1. Контролер даних"}</h2>
                <p className={"regular-l"}>
                  {
                    "Контролером персональних даних є громадська спілка / асоціація ESOSH (European Society of Occupational Safety & Health), далі — «ESOSH», «ми». Контакт для запитів щодо персональних даних: office@esosh.net."
                  }
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"2. Які дані ми обробляємо"}</h2>
                <p className={"regular-l is--margin-bottom-12"}>
                  {"Залежно від вашої взаємодії з сайтом ми можемо обробляти:"}
                </p>
                <ul className={"regular-l"}>
                  <li>{"ідентифікаційні та контактні дані (ім’я, email, телефон, організація, посада);"}</li>
                  <li>{"зміст звернень через контактну форму;"}</li>
                  <li>{"дані анкети вступу / членства, файли сертифікатів та підтверджуючі документи;"}</li>
                  <li>{"технічні дані (IP, тип браузера, cookies згідно з Політикою cookies);"}</li>
                  <li>{"дані комунікацій через сторонні віджети (наприклад, Binotel), якщо ви надали згоду."}</li>
                </ul>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"3. Цілі та правові підстави"}</h2>
                <p className={"regular-l"}>
                  {
                    "Ми обробляємо дані для: роботи сайту; відповіді на звернення; розгляду заявок на участь / членство; ведення реєстру; виконання статутних завдань асоціації; безпеки та запобігання зловживанням. Правові підстави можуть включати згоду, виконання договору / статутних відносин, законні інтереси та обов’язки за законодавством України (і, де застосовно, GDPR для осіб у ЄЕЗ)."
                  }
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"4. Передача та міжнародна обробка"}</h2>
                <p className={"regular-l"}>
                  {
                    "Для хостингу та інфраструктури ми використовуємо провайдерів (зокрема Vercel, Neon, Vercel Blob). Для email-сповіщень може використовуватися сервіс на кшталт Brevo. Звернення з форми можуть передаватися через налаштований webhook. Віджети Binotel завантажуються лише після згоди на категорію «Комунікації». Договори з обробниками (DPA) укладаються окремо. Передача за межі України / ЄЕЗ здійснюється засобами відповідних провайдерів із застосуванням доступних гарантій."
                  }
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"5. Строки зберігання"}</h2>
                <p className={"regular-l"}>
                  {
                    "Контактні звернення — протягом строку, необхідного для відповіді та обліку (орієнтовно до 24 місяців, якщо інше не вимагає закон). Заявки та дані членства — протягом розгляду та членських відносин, після чого — згідно з політикою архівування асоціації. Точні строки підлягають затвердженню юристом."
                  }
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"6. Права суб’єкта даних"}</h2>
                <p className={"regular-l"}>
                  {
                    "Ви можете звернутися на office@esosh.net щодо доступу, виправлення, видалення, обмеження обробки, заперечення, відкликання згоди та перенесення даних (де застосовно). Також ви можете звернутися до уповноваженого органу із захисту даних у своїй юрисдикції."
                  }
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"7. Діти"}</h2>
                <p className={"regular-l"}>
                  {
                    "Сайт не призначений для дітей віком до 16 років. Ми свідомо не збираємо їхні дані. Якщо ви вважаєте, що дитина надіслала нам дані, напишіть на office@esosh.net."
                  }
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"8. Cookies"}</h2>
                <p className={"regular-l"}>
                  {"Докладніше про cookies і згоду — у "}
                  <a href={"/cookie-policy"}>{"Політиці cookies"}</a>
                  {"."}
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"9. Зміни політики"}</h2>
                <p className={"regular-l"}>
                  {
                    "Ми можемо оновлювати цю політику. Актуальна версія публікується на цій сторінці з оновленим номером версії. Істотні зміни можуть супроводжуватися повторним запитом згоди, де це потрібно."
                  }
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
