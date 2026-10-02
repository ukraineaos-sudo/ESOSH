/* Public privacy policy (typical UK / international template). */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PRIVACY_NOTICE_VERSION } from "@/lib/consent";

/** RU: Політика конфіденційності EN. EN: Privacy policy content. */
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
                      {" de confidentialité"}
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
                {`Version ${PRIVACY_NOTICE_VERSION}`}
              </p>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"1. Responsable du traitement des données"}</h2>
                <p className={"regular-l"}>
                  {
                    "Le responsable du traitement des données personnelles est l’association ESOSH (European Society of Occupational Safety & Health), « ESOSH », « nous ». Contact pour les demandes relatives à la confidentialité : office@esosh.net."
                  }
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"2. Données que nous traitons"}</h2>
                <p className={"regular-l is--margin-bottom-12"}>
                  {"En fonction de la façon dont vous utilisez le site, nous pouvons traiter :"}
                </p>
                <ul className={"regular-l"}>
                  <li>{"identité et coordonnées (nom, email, téléphone, organisation, fonction) ;"}</li>
                  <li>{"messages soumis via le formulaire de contact ;"}</li>
                  <li>{"les données de demande d'adhésion/d'inscription et les fichiers justificatifs ;"}</li>
                  <li>{"données techniques (IP, type de navigateur, cookies tels que décrits dans la politique en matière de cookies) ;"}</li>
                  <li>{"données de communication via des widgets tiers (par exemple Binotel) si vous y consentez ;"}</li>
                  <li>
                    {"les données du lecteur tiers YouTube sur les pages de formation si vous consentez à la catégorie Marketing."}
                  </li>
                </ul>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"3. Finalités et bases juridiques"}</h2>
                <p className={"regular-l"}>
                  {"Nous traitons les données pour exploiter le site Web ; répondre aux demandes de renseignements ; examiner les demandes d'adhésion ; tenir à jour le registre des membres ; poursuivre les objectifs statutaires de l’association ; et protéger la sécurité. Les bases juridiques peuvent inclure le consentement, l'exécution d'une relation contractuelle/d'adhésion, les intérêts légitimes et les obligations juridiques en vertu de la loi ukrainienne (et, le cas échéant, du RGPD pour les particuliers dans l'EEE)."}
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"4. Destinataires et transferts internationaux"}</h2>
                <p className={"regular-l"}>
                  {"Les fournisseurs d'infrastructure peuvent inclure Vercel, Neon et Vercel Blob. Les notifications par e-mail peuvent utiliser un fournisseur tel que Brevo. Les soumissions du formulaire de contact peuvent être transmises via un webhook configuré. Les widgets Binotel ne se chargent qu'après consentement à la catégorie Communications. Le lecteur YouTube sur les pages de formation se charge uniquement après accord marketing. Les accords de sous-traitant (DPA) sont conclus séparément. Les transferts en dehors de l'Ukraine/de l'EEE reposent sur les garanties offertes par ces fournisseurs."}
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"5. Rétention"}</h2>
                <p className={"regular-l"}>
                  {"Les messages de contact sont conservés aussi longtemps que nécessaire pour répondre et conserver des enregistrements (à titre indicatif jusqu'à 24 mois, sauf si la loi exige plus de temps). Les candidatures et les données d’adhésion sont conservées pendant la période d’examen et la relation d’adhésion, puis conformément à la politique d’archivage de l’association."}
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"6. Vos droits"}</h2>
                <p className={"regular-l"}>
                  {
                    "Vous pouvez contacter office@esosh.net pour demander l’accès, la rectification, l’effacement, la limitation, l’opposition, le retrait du consentement et la portabilité des données, le cas échéant. Vous pouvez également déposer une plainte auprès d’une autorité de contrôle dans votre juridiction."
                  }
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"7. Enfants"}</h2>
                <p className={"regular-l"}>
                  {
                    "Le site ne s’adresse pas aux enfants de moins de 16 ans. Nous ne collectons pas sciemment leurs données. Si vous pensez qu’un enfant a transmis des données, écrivez à office@esosh.net."
                  }
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"8. Cookies"}</h2>
                <p className={"regular-l"}>
                  {"Voir la "}
                  <a href={"/fr/cookie-policy"}>{"politique relative aux cookies"}</a>
                  {" pour plus de détails."}
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"9. Modifications"}</h2>
                <p className={"regular-l"}>
                  {"Nous pouvons mettre à jour cette politique. La version actuelle est publiée sur cette page avec un numéro de version mis à jour. Les changements importants peuvent nécessiter un consentement renouvelé si nécessaire."}
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
