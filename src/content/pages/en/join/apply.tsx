/* Public ESOSH content — clean enrollment application page (no hero photo). */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EnrollmentForm } from "@/components/EnrollmentForm";

/** RU: Чиста EN-сторінка форми вступу. EN: Clean English enrollment apply page. */
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
              Complete the multi-step application on a computer or phone. The system shows a preliminary
              professional level; the final level is confirmed by an ESOSH administrator after document review.
            </p>
            <p className="regular-s is--margin-bottom-16">
              Data are processed for application review and the membership registry. Mandatory service
              messages (application status, document requests) are separate from optional marketing — you
              will confirm them on the last step.
            </p>
            <div className="enrollment-prep">
              <p className="enrollment-prep__title">Please prepare in advance (if available)</p>
              <ul className="enrollment-prep__list">
                <li>photo (JPG/PNG, up to 5 MB);</li>
                <li>proof of experience (PDF/JPG/PNG);</li>
                <li>diploma;</li>
                <li>course certificates (PDF/JPG/PNG).</li>
              </ul>
              <p className="enrollment-prep__note">
                Files are not restored after a page refresh or closing the tab — upload them again if needed.
              </p>
            </div>
          </div>
          <EnrollmentForm />
        </div>
      </section>
      <Footer />
    </>
  );
}
