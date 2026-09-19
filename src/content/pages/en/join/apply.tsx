/* Public ESOSH content — clean enrollment application page (no hero photo). */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EnrollmentForm } from "@/components/EnrollmentForm";

/** RU: Чиста EN-сторінка форми (UI поки українською). EN: Clean apply page. */
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
                  {"Application"}
                </span>
                {" to join ESOSH"}
              </h1>
            </div>
          </div>
        </div>
      </section>
      <section className="section is--section-spacing enrollment-apply-body">
        <div className="w-layout-blockcontainer container w-container">
          <div className="wrapper is--max-width-720 is--margin-bottom-40">
            <p className="regular-l is--margin-bottom-16">
              Complete the multi-step application. The system shows a preliminary professional level;
              the final level is confirmed by an ESOSH administrator after document review.
            </p>
            <p className="regular-s">
              The form UI is currently in Ukrainian (first release). English copy will follow.
            </p>
          </div>
          <EnrollmentForm />
        </div>
      </section>
      <Footer />
    </>
  );
}
