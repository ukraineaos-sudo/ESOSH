/* Public privacy policy (typical UK / international template). */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PRIVACY_NOTICE_VERSION } from "@/lib/consent";

/** RU: Політика конфіденційності AZ. EN: Privacy policy content (az). */
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
                      <span className={"is--accent"}>{"Məxfilik"}</span>
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
                {`Version ${PRIVACY_NOTICE_VERSION}`}
              </p>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"1. Məlumatların nəzarətçisi"}</h2>
                <p className={"regular-l"}>
                  {
                    "Şəxsi məlumatların nəzarətçisi ESOSH cəmiyyətidir (European Society of Occupational Safety & Health), «ESOSH», «biz». Məxfilik sorğuları üçün əlaqə: office@esosh.net."
                  }
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"2. Emal etdiyimiz məlumatlar"}</h2>
                <p className={"regular-l is--margin-bottom-12"}>
                  {"Saytdan necə istifadə etdiyinizdən asılı olaraq, biz aşağıdakıları emal edə bilərik:"}
                </p>
                <ul className={"regular-l"}>
                  <li>{"şəxsiyyət və əlaqə məlumatları (ad, e-poçt, telefon, təşkilat, rol);"}</li>
                  <li>{"əlaqə forması vasitəsilə göndərilən mesajlar;"}</li>
                  <li>{"üzvlük / qeydiyyat müraciəti məlumatları və dəstəkləyici fayllar;"}</li>
                  <li>{"texniki məlumat (IP, brauzer növü, Cookie siyasətində təsvir olunan cookie-lər);"}</li>
                  <li>{"razılığınız olduqda üçüncü tərəf vidjetləri vasitəsilə kommunikasiya məlumatları (məs. Binotel);"}</li>
                  <li>
                    {"Marketinq kateqoriyasına razılıq verdikdə təlim səhifələrində üçüncü tərəf YouTube pleyerindən məlumatlar."}
                  </li>
                </ul>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"3. Məqsədlər və hüquqi əsaslar"}</h2>
                <p className={"regular-l"}>
                  {
                    "Biz məlumatları saytı idarə etmək; sorğulara cavab vermək; üzvlük müraciətlərini nəzərdən keçirmək; üzvlər reyestrini aparmaq; cəmiyyətin nizamnamə məqsədlərini həyata keçirmək; və təhlükəsizliyi qorumaq üçün emal edirik. Hüquqi əsaslara razılıq, müqavilənin / üzvlük münasibətinin yerinə yetirilməsi, qanuni maraqlar və Ukrayna qanunvericiliyi üzrə hüquqi öhdəliklər (və müvafiq hallarda EEA-dakı şəxslər üçün GDPR) daxil ola bilər."
                  }
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"4. Alıcılar və beynəlxalq ötürülmələr"}</h2>
                <p className={"regular-l"}>
                  {
                    "İnfrastruktur təminatçılarına Vercel, Neon və Vercel Blob daxil ola bilər. E-poçt bildirişləri üçün Brevo kimi təminatçı istifadə oluna bilər. Əlaqə formasının göndərişləri konfiqurasiya edilmiş webhook vasitəsilə yönləndirilə bilər. Binotel vidjetləri yalnız Kommunikasiya kateqoriyasına razılıqdan sonra yüklənir. Təlim səhifələrindəki YouTube pleyeri yalnız Marketinq razılığından sonra yüklənir. Prosessor müqavilələri (DPA) ayrıca bağlanır. Ukrayna / EEA xaricində ötürülmələr həmin təminatçıların təklif etdiyi təminatlara əsaslanır."
                  }
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"5. Saxlama müddəti"}</h2>
                <p className={"regular-l"}>
                  {
                    "Əlaqə mesajları cavab vermək və qeydləri saxlamaq üçün lazım olan müddətə saxlanılır (təxmini olaraq 24 aya qədər, qanun daha uzun tələb etmədikcə). Müraciətlər və üzvlük məlumatları baxış müddəti və üzvlük münasibəti üçün saxlanılır, sonra isə cəmiyyətin arxivləşdirmə siyasətinə uyğun olaraq."
                  }
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"6. Sizin hüquqlarınız"}</h2>
                <p className={"regular-l"}>
                  {
                    "Giriş, düzəliş, silinmə, məhdudlaşdırma, etiraz, razılığın geri götürülməsi və müvafiq hallarda məlumatların daşınabilirliyi üçün office@esosh.net ünvanına müraciət edə bilərsiniz. Həmçinin yurisdiksiyanızdakı nəzarət orqanına şikayət verə bilərsiniz."
                  }
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"7. Uşaqlar"}</h2>
                <p className={"regular-l"}>
                  {
                    "Sayt 16 yaşından kiçik uşaqlara yönəlməyib. Biz bilərəkdən onların məlumatlarını toplamırıq. Uşağın məlumat göndərdiyini düşünürsünüzsə, office@esosh.net ünvanına yazın."
                  }
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"8. Cookie-lər"}</h2>
                <p className={"regular-l"}>
                  {"Ətraflı məlumat üçün baxın: "}
                  <a href={"/az/cookie-policy"}>{"Cookie siyasəti"}</a>
                  {"."}
                </p>
              </div>

              <div className={"wrapper is--margin-bottom-48"}>
                <h2 className={"h2 is--margin-bottom-12"}>{"9. Dəyişikliklər"}</h2>
                <p className={"regular-l"}>
                  {
                    "Bu siyasəti yeniləyə bilərik. Cari versiya yenilənmiş versiya nömrəsi ilə bu səhifədə dərc olunur. Əhəmiyyətli dəyişikliklər lazım gəldikdə yenidən razılıq tələb edə bilər."
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
