/* Public cookie policy (typical UK / international template). */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OpenConsentSettingsButton } from "@/components/consent/OpenConsentSettingsButton";
import { CONSENT_COOKIE_NAME, CONSENT_POLICY_VERSION } from "@/lib/consent";

/** RU: Політика cookies AZ. EN: Cookie policy content (az). */
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
                      {" siyasəti"}
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
                {`Versiya ${CONSENT_POLICY_VERSION}`}
              </p>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"1. Cookie-lər nədir"}</h2>
                <p className={"regular-l"}>
                  {"Cookie-lər brauzerinizdə saxlanılan kiçik fayllardır. Biz həmçinin razılıq seçiminizi yadda saxlamaq üçün oxşar texnologiyalardan (localStorage) istifadə edə bilərik."}
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"2. Kateqoriyalar"}</h2>
                <div className={"wrapper is--rows-gap-12"}>
                  <p className={"regular-l"}>
                    <strong>{"Zəruri. "}</strong>
                    {"Saytın işləməsi, təhlükəsizlik və interfeys dili (o cümlədən next-intl / çərçivə sessiya cookie-ləri) üçün tələb olunur. Həmişə aktivdir."}
                  </p>
                  <p className={"regular-l"}>
                    <strong>{"Kommunikasiya. "}</strong>
                    {"Üçüncü tərəf Binotel geri zəng və çat vidjetləri. Yalnız razılığınızdan sonra yüklənir."}
                  </p>
                  <p className={"regular-l"}>
                    <strong>{"Analitika. "}</strong>
                    {"Hələ istifadə olunmur; gələcək üçün saxlanılıb."}
                  </p>
                  <p className={"regular-l"}>
                    <strong>{"Marketinq. "}</strong>
                    {"Təlim səhifələrində üçüncü tərəf YouTube pleyeri (youtube-nocookie.com). Yalnız razılığınızdan sonra yüklənir."}
                  </p>
                </div>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"3. Cookie cədvəli (göstərici)"}</h2>
                <div className={"regular-l"}>
                  <p className={"is--margin-bottom-12"}>
                    <strong>{CONSENT_COOKIE_NAME}</strong>
                    {" — razılıq qeydiniz (kateqoriyalar, siyasət versiyası, zaman damğası). Birinci tərəf, təxminən 12 aya qədər."}
                  </p>
                  <p className={"is--margin-bottom-12"}>
                    <strong>{"NEXT_LOCALE / Next.js texniki cookie-ləri"}</strong>
                    {" — dil və proqramın işləməsi. Zəruri."}
                  </p>
                  <p className={"is--margin-bottom-12"}>
                    <strong>{"Binotel cookie-ləri"}</strong>
                    {" — yalnız Kommunikasiya razılığından sonra; widgets.binotel.com tərəfindən təyin edilir."}
                  </p>
                  <p className={"is--margin-bottom-12"}>
                    <strong>{"YouTube cookie-ləri"}</strong>
                    {" — yalnız təlim səhifələrində Marketinq razılığından sonra; youtube-nocookie.com / Google tərəfindən təyin edilir."}
                  </p>
                  <p>
                    <strong>{"esosh_admin_session"}</strong>
                    {" — yalnız heyət / admin; ictimai razılıq bannerinin bir hissəsi deyil."}
                  </p>
                </div>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"4. Razılığı necə dəyişdirmək olar"}</h2>
                <p className={"regular-l is--margin-bottom-12"}>
                  {"İstənilən vaxt cookie parametrlərini aça və ya siyasət versiyası yeniləndikdən sonra bannerə yenidən baxa bilərsiniz."}
                </p>
                <OpenConsentSettingsButton className={"btn is--secondary w-button"}>
                  {"Cookie parametrləri"}
                </OpenConsentSettingsButton>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"5. Məxfilik siyasəti"}</h2>
                <p className={"regular-l"}>
                  {"Şəxsi məlumatların emalı üçün baxın: "}
                  <a href={"/az/privacy-policy"}>{"Məxfilik siyasəti"}</a>
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
