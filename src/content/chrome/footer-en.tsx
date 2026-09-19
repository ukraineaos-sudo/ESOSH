import type { ContactSettings } from "@/lib/site-settings";
import { defaultContactSettings } from "@/lib/site-settings";
import { FooterSocialIcons } from "@/components/FooterSocialIcons";

/** RU: Подвал сайта. EN: Localized site footer. */
export default function FooterContent({
  contacts = defaultContactSettings(),
}: {
  contacts?: ContactSettings;
}) {
  const phone0 = contacts.phones[0] || { display: "", href: "#" };
  const phone1 = contacts.phones[1] || { display: "", href: "#" };
  return (
      <section className={"section site-footer-content"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <div className={"footer-wrapper is--h-flex-top-space-between"}>
            <div className={"footer-logo-copyright"}>
              <a href={"/en"} aria-current={"page"} className={"footer-logo-wrapper is--margin-bottom-24 w-inline-block w--current"}>
                <img src={"/images/home/Logo-White-c13cc8ca.png"} loading={"lazy"} alt={"Esosh"} className={"footer-logo"} width={104} height={40} decoding="async" />
              </a>
              <div className={"medium-xs is--grey-20"}>
                {"© 2022 ESOSH. All Rights Reserved"}
              </div>
              <a href={"/admin"} className={"footer-menu-link footer-admin-link"}>
                {"Admin"}
              </a>
            </div>
            <div className={"w-layout-grid is--footer-grid"}>
              <div id={"w-node-_9bcc6dd1-016b-8498-c6ca-2e36aa9eba9d-aa9eba94"} className={"wrapper"}>
                <div className={"regular-l is--white is--margin-bottom-24"}>
                  {"Menu"}
                </div>
                <div className={"wrapper is--v-flex-start-start is--rows-gap-12"}>
                  <a href={"/en"} aria-current={"page"} className={"footer-menu-link w--current"}>
                    {"Home"}
                  </a>
                  <a href={"/en/about-esosh"} className={"footer-menu-link"}>
                    {"About ESOSH"}
                  </a>
                  <a href={"/en/businesses"} className={"footer-menu-link"}>
                    {"For Enterprises"}
                  </a>
                  <a href={"/en/news"} className={"footer-menu-link"}>
                    {"News"}
                  </a>
                  <a href={"/en/contact-us"} className={"footer-menu-link"}>
                    {"Contacts"}
                  </a>
                </div>
              </div>
              <div id={"w-node-_7ff4a067-3856-9226-473c-7932dbd2e92f-aa9eba94"} className={"wrapper"}>
                <div className={"regular-l is--white is--margin-bottom-24"}>
                  {"Training"}
                </div>
                <div className={"wrapper is--v-flex-start-start is--rows-gap-12"}>
                  <a href={"/en/education/projects"} className={"footer-menu-link"}>
                    {"Projects"}
                  </a>
                  <a href={"/en/education/courses"} className={"footer-menu-link"}>
                    {"Courses"}
                  </a>
                </div>
              </div>
              <div id={"w-node-_9bcc6dd1-016b-8498-c6ca-2e36aa9ebaa9-aa9eba94"} className={"wrapper"}>
                <div className={"regular-l is--white is--margin-bottom-24"}>
                  {"Join"}
                </div>
                <div className={"wrapper is--v-flex-start-start is--rows-gap-12"}>
                  <a href={"/en/join/apply"} className={"footer-menu-link"}>
                    {"Fill out the form"}
                  </a>
                  <a href={"/en/join/enrollment"} className={"footer-menu-link"}>
                    {"Participation in ESOSH of enterprises"}
                  </a>
                  <a href={"/en/join/participation"} className={"footer-menu-link"}>
                    {"Joining ESOSH for professionals"}
                  </a>
                  <a href={"/en/join/codex"} className={"footer-menu-link"}>
                    {"Code of conduct"}
                  </a>
                  <a href={"/en/join/terms"} className={"footer-menu-link"}>
                    <strong>
                      {"Activity Statement of ESOSH"}
                    </strong>
                  </a>
                  <a href={"/en/join/safety-league-best-practices"} className={"footer-menu-link"}>
                    <strong>
                      {"ESOSH groups and good practices"}
                    </strong>
                  </a>
                </div>
              </div>
              <div id={"w-node-_2376a8a3-09b1-9797-9800-107d66343029-aa9eba94"} className={"wrapper is--foter-contacts"}>
                <div id={"w-node-_9bcc6dd1-016b-8498-c6ca-2e36aa9ebab7-aa9eba94"} className={"wrapper"}>
                  <div className={"regular-l is--white is--margin-bottom-24"}>
                    {"Contacts"}
                  </div>
                  <div className={"wrapper is--v-flex-start-start is--rows-gap-12"}>
                    <a href={phone0.href} className={"footer-menu-contacts w-inline-block"}>
                      <img src={"/images/home/Phone-106dae9b.svg"} loading={"lazy"} alt={""} className={"is--icon-size-16"} />
                      <div className={"medium-m is--grey-20"}>
                        {phone0.display}
                      </div>
                    </a>
                    <a href={phone1.href} className={"footer-menu-contacts w-inline-block"}>
                      <img src={"/images/home/Phone-106dae9b.svg"} loading={"lazy"} alt={""} className={"is--icon-size-16"} />
                      <div className={"medium-m is--grey-20"}>
                        {phone1.display}
                      </div>
                    </a>
                    <a href={`mailto:${contacts.email}`} className={"footer-menu-contacts w-inline-block"}>
                      <img src={"/images/home/Mail-6ccfcadf.svg"} loading={"lazy"} alt={""} className={"is--icon-size-16"} />
                      <div className={"medium-m is--grey-20"}>
                        {contacts.email}
                      </div>
                    </a>
                  </div>
                </div>
                <div className={"wrapper"}>
                  <div className={"regular-l is--white is--margin-bottom-24"}>
                    {"Follow us"}
                  </div>
                  <div>
                    <FooterSocialIcons social={contacts.social} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}
