/* Public cookie policy (typical UK / international template). */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OpenConsentSettingsButton } from "@/components/consent/OpenConsentSettingsButton";
import { CONSENT_COOKIE_NAME, CONSENT_POLICY_VERSION } from "@/lib/consent";

/** RU: Політика cookies EN. EN: Cookie policy content. */
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
                      <span className={"is--accent"}>{"Politique"}</span>
                      {" relative aux cookies"}
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
                {`Version ${CONSENT_POLICY_VERSION}`}
              </p>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"1. Que sont les cookies ?"}</h2>
                <p className={"regular-l"}>
                  {"Les cookies sont de petits fichiers stockés dans votre navigateur. Nous pouvons également utiliser des technologies similaires (localStorage) pour mémoriser votre choix de consentement."}
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"2. Catégories"}</h2>
                <div className={"wrapper is--rows-gap-12"}>
                  <p className={"regular-l"}>
                    <strong>{"Nécessaire. "}</strong>
                    {"Requis pour le fonctionnement du site, la sécurité et la langue de l'interface (y compris les cookies de session next-intl/framework). Toujours allumé."}
                  </p>
                  <p className={"regular-l"}>
                    <strong>{"Communications. "}</strong>
                    {"Widgets de rappel et de discussion tiers Binotel. Chargé uniquement après votre consentement."}
                  </p>
                  <p className={"regular-l"}>
                    <strong>{"Analytique. "}</strong>
                    {"Pas encore utilisé ; réservé à l'avenir."}
                  </p>
                  <p className={"regular-l"}>
                    <strong>{"Marketing. "}</strong>
                    {"Lecteur YouTube tiers sur les pages de formation (youtube-nocookie.com). Chargé uniquement après votre consentement."}
                  </p>
                </div>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"3. Tableau des cookies (indicatif)"}</h2>
                <div className={"regular-l"}>
                  <p className={"is--margin-bottom-12"}>
                    <strong>{CONSENT_COOKIE_NAME}</strong>
                    {"— votre enregistrement de consentement (catégories, version de la politique, horodatage). Première partie, jusqu'à environ 12 mois."}
                  </p>
                  <p className={"is--margin-bottom-12"}>
                    <strong>{"Cookies techniques NEXT_LOCALE / Next.js"}</strong>
                    {"— fonctionnement de la langue et de l'application. Nécessaire."}
                  </p>
                  <p className={"is--margin-bottom-12"}>
                    <strong>{"Cookies Binotel"}</strong>
                    {"— seulement après le consentement des communications ; défini par widgets.binotel.com."}
                  </p>
                  <p className={"is--margin-bottom-12"}>
                    <strong>{"Cookies YouTube"}</strong>
                    {"— uniquement après accord marketing sur les pages de formation ; défini par youtube-nocookie.com / Google."}
                  </p>
                  <p>
                    <strong>{"esosh_admin_session"}</strong>
                    {"— personnel/administrateur uniquement ; ne fait pas partie de la bannière de consentement public."}
                  </p>
                </div>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"4. Comment modifier le consentement"}</h2>
                <p className={"regular-l is--margin-bottom-12"}>
                  {"Vous pouvez ouvrir les paramètres des cookies à tout moment ou voir à nouveau la bannière après une modification de la version de la politique."}
                </p>
                <OpenConsentSettingsButton className={"btn is--secondary w-button"}>
                  {"Paramètres des cookies"}
                </OpenConsentSettingsButton>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"5. Politique de confidentialité"}</h2>
                <p className={"regular-l"}>
                  {"Pour le traitement des données personnelles, voir le"}
                  <a href={"/fr/privacy-policy"}>{"politique de confidentialité"}</a>
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
