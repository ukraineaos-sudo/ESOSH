/* Public ESOSH content — individual membership application (TZ form). */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EnrollmentForm } from "@/components/EnrollmentForm";

/** RU: Сторінка форми вступу фахівців. EN: Individual enrollment application page. */
export default function PageContent() {
  return (
    <>
      <section className="section is--height-100vh--a-auto is--internal-hero">
        <Header />
        <div className="wrapper is--accent-light-bg is--position-relative is--grow">
          <div className="wrapper is--hero-internal-layout">
            <div className="wrapper is--hero-internal-text">
              <div className="w-layout-blockcontainer container is--w-100p w-container">
                <div className="wrapper is--hero-internal-text-wrapper">
                  <div className="wrapper is--max-width-600">
                    <h1 className={"h1"}>
                      <span className={"is--accent"}>
                        {"Заявка"}
                      </span>
                      {" на вступ до ESOSH"}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-internal-image is--participation" />
          </div>
        </div>
      </section>
      <section className="section is--margin-top-144--t-128--m-104 is--section-spacing">
        <div className="w-layout-blockcontainer container w-container">
          <div className="wrapper is--max-width-720 is--margin-bottom-40">
            <p className="regular-l is--margin-bottom-16">
              Заповніть анкету з комп’ютера або смартфона. Система покаже попередній професійний рівень;
              остаточне рішення ухвалює адміністратор ESOSH після перевірки документів.
            </p>
            <p className="regular-s">
              Дані обробляються для розгляду заявки та ведення реєстру учасників. Обов’язкові службові
              повідомлення не змішуються з маркетинговою розсилкою.
            </p>
          </div>
          <EnrollmentForm />
        </div>
      </section>
      <Footer />
    </>
  );
}
