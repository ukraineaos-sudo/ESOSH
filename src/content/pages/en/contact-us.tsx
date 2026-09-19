/* Public ESOSH content captured 2026-09-07. Edit text and media here. */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { ContactPhonesGrid } from "@/components/ContactPhonesGrid";

/** RU: Содержимое страницы. EN: Static page content. */
export default function PageContent() {
  return (
    <>
      <section className={"section is--height-100vh--a-auto is--internal-hero"}>
        <Header />
        <div className={"wrapper is--accent-light-bg is--position-relative is--grow"}>
          <div className={"wrapper is--hero-internal-layout"}>
            <div id={"w-node-_1c9c79c4-c67c-e664-2e8a-04dc498bb5d6-55f8880f"} className={"wrapper is--hero-internal-text"}>
              <div className={"w-layout-blockcontainer container is--w-100p w-container"}>
                <div className={"wrapper is--hero-internal-text-wrapper"}>
                  <div className={"wrapper is--max-width-600"}>
                    <h1 className={"h1"}>
                      <span className={"is--accent"}>
                        {"Contact us"}
                      </span>
                      {" or leave a request for a free consultation"}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <div className={"hero-internal-image is--contacts"}>
            </div>
          </div>
        </div>
      </section>
      <section className={"section is--margin-top-144--t-128--m-104"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <h2 className={"h2 is--margin-bottom-40"}>
            {"We are always ready to help you"}
          </h2>
          <ContactPhonesGrid locale="en" labels={{ phone: "Phone", email: "E-mail" }} />
        </div>
      </section>
      <section className={"section is--margin-top-144--t-128--m-104"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <h2 className={"h2 is--margin-bottom-40"}>
            {"Get a prompt response"}
          </h2>
          <div className={"w-layout-grid is--grid--5fr-7fr"}>
            <div id={"w-node-_2b9e17bf-b873-0d9d-701e-fb4121632f33-55f8880f"} className={"wrapper is--accent-light-bg is--radius-6 is--form-wrapper"}>
              <div className={"wrapper is--max-width-408 is--margin-bottom-40"}>
                <h3 className={"h3 is--margin-bottom-12"}>
                  <strong>
                    {"Contact us"}
                  </strong>
                </h3>
                <p className={"regular-l"}>
                  {"Fill out this form to ask us any question, suggestion, or a comment. We are always ready to hear you out!"}
                </p>
              </div>
              <ContactForm />
            </div>
            <div id={"w-node-_52d71b19-300a-d87a-f7be-ea4d5bd8a3ad-55f8880f"} className={"grid-image is--position-relative"}>
              <div className={"is--position-absolute is--w-100p is--h-100p"}>
                <img src={"/images/contact-us/11-46553e20.webp"} loading={"lazy"} alt={""} className={"image-inside"} width={1500} height={844} decoding="async" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className={"section is--margin-top-144--t-128--m-104 is--margin-bottom-144--t-128--m-104"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <div className={"wrapper is--v-flex-center-center"}>
            <div className={"wrapper is--max-width-408 is--w-100p"}>
              <h2 className={"h2 is--center is--margin-bottom-40"}>
                {"Follow us on social platforms"}
              </h2>
            </div>
            <div className={"wrapper is--socials-wrapper"}>
              <a href={"https://web.telegram.org/k/#@esosh_info"} target={"_blank"} className={"social-link-wrapper-copy w-inline-block"} rel="noopener noreferrer" aria-label="Telegram">
                <img src={"/images/home/Telegram-eef42f1e.svg"} loading={"lazy"} width={32} height={32} alt={""} />
              </a>
              <a href={"https://www.facebook.com/groups/esosh"} target={"_blank"} className={"social-link-wrapper-copy w-inline-block"} rel="noopener noreferrer" aria-label="Facebook">
                <img src={"/images/home/Facebook-a4a21991.svg"} loading={"lazy"} width={32} height={32} alt={""} />
              </a>
              <a href={"https://www.linkedin.com/company/esosh-the-european-society-of-occupational-safety-health/"} target={"_blank"} className={"social-link-wrapper w-inline-block"} rel="noopener noreferrer" aria-label="LinkedIn">
                <img src={"/images/home/LinkedIn-2baea71c.svg"} loading={"lazy"} width={32} height={32} alt={""} />
              </a>
              <a href={"https://www.youtube.com/@esosh7814"} target={"_blank"} className={"social-link-wrapper w-inline-block"} rel="noopener noreferrer" aria-label="YouTube">
                <img src={"/images/home/YouTube-bc59eff6.svg"} loading={"lazy"} width={32} height={32} alt={""} />
              </a>
              <a href={"https://www.instagram.com/esosh_ukraine/"} target={"_blank"} className={"social-link-wrapper w-inline-block"} rel="noopener noreferrer" aria-label="Instagram">
                <img src={"/images/home/Instagram-footer.svg"} loading={"lazy"} width={32} height={32} alt={""} />
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
