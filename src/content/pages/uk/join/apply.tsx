/* Public ESOSH content — clean enrollment application page (no hero photo). */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EnrollmentCaptchaGate } from "@/components/EnrollmentCaptchaGate";

/** RU: Чиста сторінка форми вступу. EN: Clean enrollment form page. */
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
                  {"Заявка"}
                </span>
                {" на вступ до ESOSH"}
              </h1>
            </div>
          </div>
        </div>
      </section>
      <section className="section is--section-spacing enrollment-apply-body">
        <div className="w-layout-blockcontainer container w-container">
          <div className="wrapper is--max-width-720 is--margin-bottom-40">
            <p className="regular-l is--margin-bottom-16">
              Заповніть анкету з комп’ютера або смартфона. Система покаже попередній професійний рівень;
              остаточне рішення ухвалює адміністратор ESOSH після перевірки документів.
            </p>
            <p className="regular-s is--margin-bottom-16">
              Дані обробляються для розгляду заявки та ведення реєстру учасників. Обов’язкові службові
              повідомлення (статус заявки, запити документів) не змішуються з необов’язковою маркетинговою
              розсилкою — згоду на них ви підтвердите на останньому кроці.
            </p>
            <div className="enrollment-prep">
              <p className="enrollment-prep__title">Документи — за бажанням</p>
              <ul className="enrollment-prep__list">
                <li>фото, диплом, сертифікати, підтвердження стажу (PDF/JPG/PNG);</li>
                <li>на останньому кроці можна перетягнути файли пакетом або пропустити.</li>
              </ul>
              <p className="enrollment-prep__note">
                Без файлів заявку теж можна надіслати. Документи прискорюють розгляд. Файли не
                відновлюються після оновлення сторінки.
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
