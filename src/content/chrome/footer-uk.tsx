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
              <a href={"/"} aria-current={"page"} className={"footer-logo-wrapper is--margin-bottom-24 w-inline-block w--current"}>
                <img src={"/images/home/Logo-White-c13cc8ca.png"} loading={"lazy"} alt={"Esosh"} className={"footer-logo"} width={104} height={40} decoding="async" />
              </a>
              <div className={"medium-xs is--grey-20"}>
                {"© 2022 ESOSH. All Rights Reserved"}
              </div>
              <a href={"/admin"} className={"footer-menu-link footer-admin-link"}>
                {"Адмін"}
              </a>
            </div>
            <div className={"w-layout-grid is--footer-grid"}>
              <div id={"w-node-_9bcc6dd1-016b-8498-c6ca-2e36aa9eba9d-aa9eba94"} className={"wrapper"}>
                <div className={"regular-l is--white is--margin-bottom-24"}>
                  {"Меню"}
                </div>
                <div className={"wrapper is--v-flex-start-start is--rows-gap-12"}>
                  <a href={"/"} aria-current={"page"} className={"footer-menu-link w--current"}>
                    {"Головна"}
                  </a>
                  <a href={"/about-esosh"} className={"footer-menu-link"}>
                    {"Про ESOSH"}
                  </a>
                  <a href={"/businesses"} className={"footer-menu-link"}>
                    {"Підприємствам"}
                  </a>
                  <a href={"/news"} className={"footer-menu-link"}>
                    {"Новини"}
                  </a>
                  <a href={"/contact-us"} className={"footer-menu-link"}>
                    {"Контакти"}
                  </a>
                </div>
              </div>
              <div id={"w-node-_7ff4a067-3856-9226-473c-7932dbd2e92f-aa9eba94"} className={"wrapper"}>
                <div className={"regular-l is--white is--margin-bottom-24"}>
                  {"Навчання"}
                </div>
                <div className={"wrapper is--v-flex-start-start is--rows-gap-12"}>
                  <a href={"/education/projects"} className={"footer-menu-link"}>
                    {"Проекти"}
                  </a>
                  <a href={"/education/courses"} className={"footer-menu-link"}>
                    {"Курси"}
                  </a>
                </div>
              </div>
              <div id={"w-node-_9bcc6dd1-016b-8498-c6ca-2e36aa9ebaa9-aa9eba94"} className={"wrapper"}>
                <div className={"regular-l is--white is--margin-bottom-24"}>
                  {"Доєднатися"}
                </div>
                <div className={"wrapper is--v-flex-start-start is--rows-gap-12"}>
                  <a href={"/join/apply"} className={"footer-menu-link"}>
                    {"Заповнити форму"}
                  </a>
                  <a href={"/join/enrollment"} className={"footer-menu-link"}>
                    {"Участь в ЄСОП підприємств"}
                  </a>
                  <a href={"/join/participation"} className={"footer-menu-link"}>
                    {"Вступ в ЄСОП фахівцям"}
                  </a>
                  <a href={"/join/codex"} className={"footer-menu-link"}>
                    {"Кодекс поведінки"}
                  </a>
                  <a href={"/join/terms"} className={"footer-menu-link"}>
                    {"Положення про ЄСОП"}
                  </a>
                  <a href={"/join/safety-league-best-practices"} className={"footer-menu-link"}>
                    {"Фахові групи та"}
                    <br />
                    {"передові практики"}
                  </a>
                </div>
              </div>
              <div className={"wrapper is--foter-contacts"}>
                <div id={"w-node-_9bcc6dd1-016b-8498-c6ca-2e36aa9ebab7-aa9eba94"} className={"wrapper"}>
                  <div className={"regular-l is--white is--margin-bottom-24"}>
                    {"Контакти"}
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
                    {"Слідкуйте за нами"}
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
