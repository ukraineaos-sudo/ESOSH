/* Draft privacy policy — pending legal review. */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PRIVACY_NOTICE_VERSION } from "@/lib/consent";

/** RU: Політика конфіденційності EN. EN: Privacy policy draft (English). */
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
                      <span className={"is--accent"}>{"Privacy"}</span>
                      {" Policy"}
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
                {`Version ${PRIVACY_NOTICE_VERSION} · Draft — pending legal review. This is a typical template and not legal advice; it must be approved by ESOSH association counsel.`}
              </p>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"1. Data controller"}</h2>
                <p className={"regular-l"}>
                  {
                    "The controller of personal data is the ESOSH association (European Society of Occupational Safety & Health), “ESOSH”, “we”. Contact for privacy requests: office@esosh.net."
                  }
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"2. Data we process"}</h2>
                <p className={"regular-l is--margin-bottom-12"}>
                  {"Depending on how you use the site, we may process:"}
                </p>
                <ul className={"regular-l"}>
                  <li>{"identity and contact details (name, email, phone, organisation, role);"}</li>
                  <li>{"messages submitted via the contact form;"}</li>
                  <li>{"membership / enrolment application data and supporting files;"}</li>
                  <li>{"technical data (IP, browser type, cookies as described in the Cookie Policy);"}</li>
                  <li>{"communications data via third-party widgets (e.g. Binotel) if you consent."}</li>
                </ul>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"3. Purposes and legal bases"}</h2>
                <p className={"regular-l"}>
                  {
                    "We process data to operate the website; respond to enquiries; review membership applications; maintain the member register; pursue the association’s statutory aims; and protect security. Legal bases may include consent, performance of a contract / membership relationship, legitimate interests, and legal obligations under Ukrainian law (and, where applicable, the GDPR for individuals in the EEA)."
                  }
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"4. Recipients and international transfers"}</h2>
                <p className={"regular-l"}>
                  {
                    "Infrastructure providers may include Vercel, Neon and Vercel Blob. Email notifications may use a provider such as Brevo. Contact form submissions may be forwarded via a configured webhook. Binotel widgets load only after consent to the Communications category. Processor agreements (DPAs) are concluded separately. Transfers outside Ukraine / the EEA rely on the safeguards offered by those providers."
                  }
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"5. Retention"}</h2>
                <p className={"regular-l"}>
                  {
                    "Contact messages are kept for as long as needed to reply and keep records (indicatively up to 24 months unless law requires longer). Applications and membership data are kept for the review period and membership relationship, then per the association’s archiving policy. Exact periods are subject to legal approval."
                  }
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"6. Your rights"}</h2>
                <p className={"regular-l"}>
                  {
                    "You may contact office@esosh.net to request access, rectification, erasure, restriction, objection, withdrawal of consent, and data portability where applicable. You may also lodge a complaint with a supervisory authority in your jurisdiction."
                  }
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"7. Children"}</h2>
                <p className={"regular-l"}>
                  {
                    "The site is not directed at children under 16. We do not knowingly collect their data. If you believe a child has submitted data, email office@esosh.net."
                  }
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"8. Cookies"}</h2>
                <p className={"regular-l"}>
                  {"See the "}
                  <a href={"/en/cookie-policy"}>{"Cookie Policy"}</a>
                  {" for details."}
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"9. Changes"}</h2>
                <p className={"regular-l"}>
                  {
                    "We may update this policy. The current version is published on this page with an updated version number. Material changes may require renewed consent where needed."
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
