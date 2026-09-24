/* Draft cookie policy — pending legal review. */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OpenConsentSettingsButton } from "@/components/consent/OpenConsentSettingsButton";
import { CONSENT_COOKIE_NAME, CONSENT_POLICY_VERSION } from "@/lib/consent";

/** RU: Політика cookies EN. EN: Cookie policy draft (English). */
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
                {`Version ${CONSENT_POLICY_VERSION} · Draft — pending legal review. Not legal advice; subject to ESOSH counsel approval.`}
              </p>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"1. What cookies are"}</h2>
                <p className={"regular-l"}>
                  {
                    "Cookies are small files stored in your browser. We may also use similar technologies (localStorage) to remember your consent choice."
                  }
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"2. Categories"}</h2>
                <div className={"wrapper is--rows-gap-12"}>
                  <p className={"regular-l"}>
                    <strong>{"Necessary. "}</strong>
                    {
                      "Required for site operation, security and interface language (including next-intl / framework session cookies). Always on."
                    }
                  </p>
                  <p className={"regular-l"}>
                    <strong>{"Communications. "}</strong>
                    {
                      "Third-party Binotel callback and chat widgets. Loaded only after your consent."
                    }
                  </p>
                  <p className={"regular-l"}>
                    <strong>{"Analytics / marketing. "}</strong>
                    {"Not used yet; reserved for the future."}
                  </p>
                </div>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"3. Cookie table (indicative)"}</h2>
                <div className={"regular-l"}>
                  <p className={"is--margin-bottom-12"}>
                    <strong>{CONSENT_COOKIE_NAME}</strong>
                    {" — your consent record (categories, policy version, timestamp). First-party, up to ~12 months."}
                  </p>
                  <p className={"is--margin-bottom-12"}>
                    <strong>{"NEXT_LOCALE / Next.js technical cookies"}</strong>
                    {" — language and app operation. Necessary."}
                  </p>
                  <p className={"is--margin-bottom-12"}>
                    <strong>{"Binotel cookies"}</strong>
                    {" — only after Communications consent; set by widgets.binotel.com."}
                  </p>
                  <p>
                    <strong>{"esosh_admin_session"}</strong>
                    {" — staff /admin only; not part of the public consent banner."}
                  </p>
                </div>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"4. How to change consent"}</h2>
                <p className={"regular-l is--margin-bottom-12"}>
                  {"You can open cookie settings at any time, or see the banner again after a policy version bump."}
                </p>
                <OpenConsentSettingsButton className={"btn is--secondary w-button"}>
                  {"Cookie settings"}
                </OpenConsentSettingsButton>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"5. Privacy Policy"}</h2>
                <p className={"regular-l"}>
                  {"For personal data processing see the "}
                  <a href={"/en/privacy-policy"}>{"Privacy Policy"}</a>
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
