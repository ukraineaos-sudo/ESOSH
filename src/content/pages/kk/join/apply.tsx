/* Public ESOSH content — clean enrollment application page (no hero photo). */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EnrollmentCaptchaGate } from "@/components/EnrollmentCaptchaGate";

/** RU: Чиста KK-сторінка форми вступу. EN: Clean Kazakh enrollment apply page. */
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
                  {"Өтінім"}
                </span>
                {" — ESOSH-қа қосылу"}
              </h1>
            </div>
          </div>
        </div>
      </section>
      <section className="section is--section-spacing enrollment-apply-body">
        <div className="w-layout-blockcontainer container w-container">
          <div className="wrapper is--max-width-720 is--margin-bottom-40">
            <p className="regular-l is--margin-bottom-16">
              Компьютер немесе телефоннан көпқадамды өтінімді толтырыңыз. Жүйе алдын ала кәсіби
              деңгейді көрсетеді; соңғы деңгейді құжаттарды қарағаннан кейін ESOSH әкімшісі растайды.
            </p>
            <p className="regular-s is--margin-bottom-16">
              Деректер өтінімді қарау және мүшелер тізілімі үшін өңделеді. Міндетті қызметтік
              хабарламалар (өтінім мәртебесі, құжат сұраулары) міндетті емес маркетингтен бөлек —
              оларды соңғы қадамда растайсыз.
            </p>
            <div className="enrollment-prep">
              <p className="enrollment-prep__title">Құжаттар міндетті емес</p>
              <ul className="enrollment-prep__list">
                <li>фото, диплом, сертификаттар, өтіл куәлігі (PDF/JPG/PNG);</li>
                <li>соңғы қадамда файлдарды бірден сүйреп қоюға немесе өткізіп жіберуге болады.</li>
              </ul>
              <p className="enrollment-prep__note">
                Файлсыз да жібере аласыз. Құжаттар қарауды жылдамдатады. Бет жаңартылғаннан кейін
                файлдар қалпына келтірілмейді.
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
