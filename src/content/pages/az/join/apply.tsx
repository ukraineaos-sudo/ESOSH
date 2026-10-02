/* Public ESOSH content — clean enrollment application page (no hero photo). */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EnrollmentCaptchaGate } from "@/components/EnrollmentCaptchaGate";

/** RU: Чиста AZ-сторінка форми вступу. EN: Clean Azerbaijani enrollment apply page. */
export default function PageContent() {
  return (
    <>
      <section className="section enrollment-apply-top">
        <Header />
        <div className="wrapper is--accent-light-bg">
          <div className="w-layout-blockcontainer container w-container">
            <div className="enrollment-apply-heading">
              <h1 className={"h1"}>
                <span className={"is--accent"}>
                  {"Müraciət"}
                </span>
                {" — ESOSH-a qoşulmaq"}
              </h1>
            </div>
          </div>
        </div>
      </section>
      <section className="section is--section-spacing enrollment-apply-body">
        <div className="w-layout-blockcontainer container w-container">
          <div className="wrapper is--max-width-720 is--margin-bottom-40">
            <p className="regular-l is--margin-bottom-16">
              Kompüter və ya telefondan çoxaddımlı müraciəti doldurun. Sistem ilkin peşəkar səviyyəni
              göstərir; yekun səviyyəni sənədlərə baxışdan sonra ESOSH administratoru təsdiqləyir.
            </p>
            <p className="regular-s is--margin-bottom-16">
              Məlumatlar müraciətin baxışı və üzvlər reyestri üçün emal olunur. Məcburi xidmət
              mesajları (müraciət statusu, sənəd sorğuları) istəyə bağlı marketinqdən ayrıdır —
              onları son addımda təsdiqləyəcəksiniz.
            </p>
            <div className="enrollment-prep">
              <p className="enrollment-prep__title">Sənədlər istəyə görədir</p>
              <ul className="enrollment-prep__list">
                <li>foto, diplom, sertifikatlar, təcrübə təsdiqi (PDF/JPG/PNG);</li>
                <li>son addımda faylları bir dəfəyə sürükləyib buraxa və ya keçə bilərsiniz.</li>
              </ul>
              <p className="enrollment-prep__note">
                Faylsız da göndərə bilərsiniz. Sənədlər baxışı sürətləndirir. Səhifə yeniləndikdən
                sonra fayllar bərpa olunmur.
              </p>
            </div>
          </div>
          <EnrollmentCaptchaGate />
        </div>
      </section>
      <Footer />
    </>
  );
}
