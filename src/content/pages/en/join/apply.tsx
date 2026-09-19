/* Public ESOSH content — individual membership application (TZ form). */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EnrollmentForm } from "@/components/EnrollmentForm";

/** RU: EN-сторінка форми вступу (UI поки українською — ТЗ: UK first). EN: Apply page (UK UI first). */
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
                        {"Application"}
                      </span>
                      {" to join ESOSH"}
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
