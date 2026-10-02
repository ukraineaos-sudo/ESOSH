import type { ContactSettings } from "@/lib/site-settings";
import { defaultContactSettings } from "@/lib/site-settings";
import { FooterSocialIcons } from "@/components/FooterSocialIcons";
import { OpenConsentSettingsButton } from "@/components/consent/OpenConsentSettingsButton";

/** RU: Подвал (fr). EN: fr chrome footer. */
export default function FooterContent({
  contacts = defaultContactSettings(),
  localePrefix = "/fr",
}: {
  contacts?: ContactSettings;
  localePrefix?: string;
}) {
  const p = localePrefix || "/fr";
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
                {"© 2022 ESOSH. Tous droits réservés"}
              </div>
              <div className={"footer-legal-links wrapper is--v-flex-start-start is--rows-gap-12 is--margin-top-16"}>
                <a href={`${p}/privacy-policy`} className={"footer-menu-link"}>
                  {"Confidentialité"}
                </a>
                <a href={`${p}/cookie-policy`} className={"footer-menu-link"}>
                  {"Cookies"}
                </a>
                <OpenConsentSettingsButton className={"footer-menu-link"}>
                  {"Paramètres des cookies"}
                </OpenConsentSettingsButton>
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
                  <a href={p} aria-current={"page"} className={"footer-menu-link w--current"}>
                    {"Accueil"}
                  </a>
                  <a href={`${p}/about-esosh`} className={"footer-menu-link"}>
                    {"À propos d’ESOSH"}
                  </a>
                  <a href={`${p}/businesses`} className={"footer-menu-link"}>
                    {"Pour les entreprises"}
                  </a>
                  <a href={`${p}/news`} className={"footer-menu-link"}>
                    {"Actualités"}
                  </a>
                  <a href={`${p}/contact-us`} className={"footer-menu-link"}>
                    {"Contact"}
                  </a>
                </div>
              </div>
              <div id={"w-node-_7ff4a067-3856-9226-473c-7932dbd2e92f-aa9eba94"} className={"wrapper"}>
                <div className={"regular-l is--white is--margin-bottom-24"}>
                  {"Formation"}
                </div>
                <div className={"wrapper is--v-flex-start-start is--rows-gap-12"}>
                  <a href={`${p}/education/projects`} className={"footer-menu-link"}>
                    {"Projets"}
                  </a>
                  <a href={`${p}/education/courses`} className={"footer-menu-link"}>
                    {"Cours"}
                  </a>
                  <a href={`${p}/education/trainings`} className={"footer-menu-link"}>
                    {"Formations"}
                  </a>
                </div>
              </div>
              <div id={"w-node-_9bcc6dd1-016b-8498-c6ca-2e36aa9ebaa9-aa9eba94"} className={"wrapper"}>
                <div className={"regular-l is--white is--margin-bottom-24"}>
                  {"Rejoindre"}
                </div>
                <div className={"wrapper is--v-flex-start-start is--rows-gap-12"}>
                  <a href={`${p}/join/apply`} className={"footer-menu-link"}>
                    {"Remplir le formulaire"}
                  </a>
                  <a href={`${p}/join/enrollment`} className={"footer-menu-link"}>
                    {"Participation à ESOSH pour les entreprises"}
                  </a>
                  <a href={`${p}/join/participation`} className={"footer-menu-link"}>
                    {"Adhésion à ESOSH pour les spécialistes"}
                  </a>
                  <a href={`${p}/join/codex`} className={"footer-menu-link"}>
                    {"Code de conduite"}
                  </a>
                  <a href={`${p}/join/terms`} className={"footer-menu-link"}>
                    <strong>
                      {"Règlement d’ESOSH"}
                    </strong>
                  </a>
                  <a href={`${p}/join/safety-league-best-practices`} className={"footer-menu-link"}>
                    <strong>
                      {"Groupes professionnels et bonnes pratiques"}
                    </strong>
                  </a>
                </div>
              </div>
              <div id={"w-node-_2376a8a3-09b1-9797-9800-107d66343029-aa9eba94"} className={"wrapper is--foter-contacts"}>
                <div id={"w-node-_9bcc6dd1-016b-8498-c6ca-2e36aa9ebab7-aa9eba94"} className={"wrapper"}>
                  <div className={"regular-l is--white is--margin-bottom-24"}>
                    {"Contact"}
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
                    {"Suivez-nous"}
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
