import type { ContactSettings } from "@/lib/site-settings";
import { defaultContactSettings } from "@/lib/site-settings";
import { FooterSocialIcons } from "@/components/FooterSocialIcons";
import { OpenConsentSettingsButton } from "@/components/consent/OpenConsentSettingsButton";

/** RU: Подвал (az). EN: az chrome footer. Strings aligned with messages/az.json nav/consent. */
export default function FooterContent({
  contacts = defaultContactSettings(),
  localePrefix = "/az",
}: {
  contacts?: ContactSettings;
  localePrefix?: string;
}) {
  const p = localePrefix || "/az";
  const phone0 = contacts.phones[0] || { display: "", href: "#" };
  const phone1 = contacts.phones[1] || { display: "", href: "#" };
  return (
      <section className={"section site-footer-content"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <div className={"footer-wrapper is--h-flex-top-space-between"}>
            <div className={"footer-logo-copyright"}>
              <a href={p} aria-current={"page"} className={"footer-logo-wrapper is--margin-bottom-24 w-inline-block w--current"}>
                <img src={"/images/home/Logo-White-c13cc8ca.png"} loading={"lazy"} alt={"Esosh"} className={"footer-logo"} width={104} height={40} decoding="async" />
              </a>
              <div className={"medium-xs is--grey-20"}>
                {"© 2022 ESOSH. Bütün hüquqlar qorunur"}
              </div>
              <div className={"footer-legal-links wrapper is--v-flex-start-start is--rows-gap-12 is--margin-top-16"}>
                <a href={`${p}/privacy-policy`} className={"footer-menu-link"}>
                  {"Məxfilik"}
                </a>
                <a href={`${p}/cookie-policy`} className={"footer-menu-link"}>
                  {"Cookie-lər"}
                </a>
                <OpenConsentSettingsButton className={"footer-menu-link"}>
                  {"Cookie parametrləri"}
                </OpenConsentSettingsButton>
              </div>
              <a href={"/admin"} className={"footer-menu-link footer-admin-link"}>
                {"Admin"}
              </a>
            </div>
            <div className={"w-layout-grid is--footer-grid"}>
              <div id={"w-node-_9bcc6dd1-016b-8498-c6ca-2e36aa9eba9d-aa9eba94"} className={"wrapper"}>
                <div className={"regular-l is--white is--margin-bottom-24"}>
                  {"Menyu"}
                </div>
                <div className={"wrapper is--v-flex-start-start is--rows-gap-12"}>
                  <a href={p} aria-current={"page"} className={"footer-menu-link w--current"}>
                    {"Ana səhifə"}
                  </a>
                  <a href={`${p}/about-esosh`} className={"footer-menu-link"}>
                    {"ESOSH haqqında"}
                  </a>
                  <a href={`${p}/businesses`} className={"footer-menu-link"}>
                    {"Müəssisələr üçün"}
                  </a>
                  <a href={`${p}/news`} className={"footer-menu-link"}>
                    {"Xəbərlər"}
                  </a>
                  <a href={`${p}/contact-us`} className={"footer-menu-link"}>
                    {"Əlaqə"}
                  </a>
                </div>
              </div>
              <div id={"w-node-_7ff4a067-3856-9226-473c-7932dbd2e92f-aa9eba94"} className={"wrapper"}>
                <div className={"regular-l is--white is--margin-bottom-24"}>
                  {"Təhsil"}
                </div>
                <div className={"wrapper is--v-flex-start-start is--rows-gap-12"}>
                  <a href={`${p}/education/projects`} className={"footer-menu-link"}>
                    {"Layihələr"}
                  </a>
                  <a href={`${p}/education/courses`} className={"footer-menu-link"}>
                    {"Kurslar"}
                  </a>
                  <a href={`${p}/education/trainings`} className={"footer-menu-link"}>
                    {"Təlimlər"}
                  </a>
                </div>
              </div>
              <div id={"w-node-_9bcc6dd1-016b-8498-c6ca-2e36aa9ebaa9-aa9eba94"} className={"wrapper"}>
                <div className={"regular-l is--white is--margin-bottom-24"}>
                  {"Qoşulun"}
                </div>
                <div className={"wrapper is--v-flex-start-start is--rows-gap-12"}>
                  <a href={`${p}/join/apply`} className={"footer-menu-link"}>
                    {"Formanı doldurun"}
                  </a>
                  <a href={`${p}/join/enrollment`} className={"footer-menu-link"}>
                    {"Müəssisələrin ESOSH-da iştirakı"}
                  </a>
                  <a href={`${p}/join/participation`} className={"footer-menu-link"}>
                    {"Mütəxəssislər üçün ESOSH-a giriş"}
                  </a>
                  <a href={`${p}/join/codex`} className={"footer-menu-link"}>
                    {"Davranış kodeksi"}
                  </a>
                  <a href={`${p}/join/terms`} className={"footer-menu-link"}>
                    <strong>
                      {"ESOSH haqqında əsasnamə"}
                    </strong>
                  </a>
                  <a href={`${p}/join/safety-league-best-practices`} className={"footer-menu-link"}>
                    <strong>
                      {"Peşə qrupları və qabaqcıl təcrübələr"}
                    </strong>
                  </a>
                </div>
              </div>
              <div id={"w-node-_2376a8a3-09b1-9797-9800-107d66343029-aa9eba94"} className={"wrapper is--foter-contacts"}>
                <div id={"w-node-_9bcc6dd1-016b-8498-c6ca-2e36aa9ebab7-aa9eba94"} className={"wrapper"}>
                  <div className={"regular-l is--white is--margin-bottom-24"}>
                    {"Əlaqə"}
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
                    {"Sosial şəbəkələrdə bizi izləyin"}
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
