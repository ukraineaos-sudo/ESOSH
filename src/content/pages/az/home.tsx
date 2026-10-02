/* Public ESOSH content captured 2026-09-07. Edit text and media here. */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CmsNewsListItems } from "@/components/cms/CmsNewsListItems";
import { HomeMembersStat } from "@/components/cms/HomeMembersStat";

/** RU: Содержимое страницы. EN: Static page content. */
export default function PageContent() {
  return (
    <>
      <section className={"section is--accent-light-bg"}>
        <Header />
        <div className={"w-layout-blockcontainer container w-container"}>
          <div className={"wrapper is--offer is--margin-top-128--t-112--m-88 is--margin-bottom-88--m-72"}>
            <h1 className={"h1 is--max-width-648"}>
              {"Ukraynada Avropa səviyyəli"}
              <span className={"is--accent"}>
                {" əməyin mühafizəsi və sağlamlığı"}
              </span>
              {" qurmaq"}
            </h1>
            <div className={"wrapper is--max-width-456"}>
              <p className={"regular-l is--margin-bottom-24"}>
                {"Avropa Əməyin Təhlükəsizliyi və Sağlamlığı Cəmiyyəti ESOSH dəyərləri formalaşdırır, bilik səviyyəsini yüksəldir, qanunvericilik dəyişikliklərinə təsir göstərir və Ukraynada işi təhlükəsiz etmək üçün beynəlxalq aparıcı təşkilatlarla əlaqələr saxlayır. İştirak pulsuzdur, qoşulun və təkmilləşin."}
              </p>
              <a href={"/az/businesses"} className={"btn is--primary w-button"}>
                {"Mən maraqlıyam"}
              </a>
            </div>
          </div>
          <div className={"hero-image is--margin-bottom-64--t-48--m-24"}>
          </div>
        </div>
      </section>
      <section className={"section is--margin-top-144--t-128--m-104"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <div className={"wrapper is--h-flex-bottom-space-between is--margin-bottom-40"}>
            <h2 className={"h2"}>
              {"Xəbərlər və hadisələr"}
            </h2>
            <a href={"/az/news"} className={"btn is--tertiary w-inline-block"}>
              <div className={"wrapper is--h-flex-center-left is--gap-4-columns"}>
                <div className={"bold-m"}>
                  {"Daha çox xəbər"}
                </div>
                <img src={"/images/home/Chevron-Right-1f56be04.svg"} loading={"lazy"} alt={""} className={"is--icon-size-16"} />
              </div>
            </a>
          </div>
          <div className={"collection-list-wrapper w-dyn-list"}>
            <div role={"list"} className={"collection-list is--grid-3-columns--a-1-column w-dyn-items"}>
              <CmsNewsListItems locale="az" limit={3} />
            </div>
          </div>
        </div>
      </section>
      <section className={"section is--margin-top-144--t-128--m-104"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <div className={"wrapper is--h-flex-bottom-space-between is--margin-bottom-40"}>
            <h2 className={"h2"}>
              {"Müəssisələr üçün"}
            </h2>
            <a href={"/az/businesses"} className={"btn is--tertiary w-inline-block"}>
              <div className={"wrapper is--h-flex-center-left is--gap-4-columns"}>
                <div className={"bold-m"}>
                  {"Ətraflı məlumat əldə edin"}
                </div>
                <img src={"/images/home/Chevron-Right-1f56be04.svg"} loading={"lazy"} alt={""} className={"is--icon-size-16"} />
              </div>
            </a>
          </div>
          <div className={"wrapper is--grid-block-2-columns--a-1column"}>
            <a href={"/az/education/projects"} className={"block is--spacing-32-32--m-24-32 is--border-grey-7 is--v-flex-start-start w-inline-block"}>
              <img src={"/images/home/Presentation-file-d50be3ea.svg"} loading={"lazy"} alt={""} className={"is--icon-size-40 is--margin-bottom-32"} />
              <div className={"wrapper is--v-flex-start-space-between is--grow"}>
                <div className={"wrapper is--max-width-480 is--margin-bottom-32"}>
                  <h3 className={"h3 is--margin-bottom-12"}>
                    {"Riskin qiymətləndirilməsi"}
                  </h3>
                  <p className={"regular-l"}>
                    {"Riskin qiymətləndirilməsi, auditlər, layihə dəstəyi və xüsusi təhlükəsizlik proqramları. Mütəxəssislərimiz daim xaricdə öz bacarıqlarını təkmilləşdirir, Ukraynada xəsarətlərin qarşısının alınması təcrübələrini həyata keçirirlər və biznesinizdə faydalı ola bilərlər."}
                  </p>
                </div>
                <div className={"btn is--tertiary is--no-link"}>
                  <div className={"wrapper is--h-flex-center-left is--gap-4-columns"}>
                    <div className={"bold-m"}>
                      {"Layihələrimiz"}
                    </div>
                    <img src={"/images/home/Chevron-Right-1f56be04.svg"} loading={"lazy"} alt={""} className={"is--icon-size-16"} />
                  </div>
                </div>
              </div>
            </a>
            <a href={"/az/education/courses"} className={"block is--spacing-32-32--m-24-32 is--border-grey-7 is--v-flex-start-start w-inline-block"}>
              <img src={"/images/home/Persons-348db007.svg"} loading={"lazy"} alt={""} className={"is--icon-size-40 is--margin-bottom-32"} />
              <div className={"wrapper is--v-flex-start-space-between is--grow"}>
                <div className={"wrapper is--max-width-480 is--margin-bottom-32"}>
                  <h3 className={"h3 is--margin-bottom-12"}>
                    {"Təlim proqramları"}
                  </h3>
                  <p className={"regular-l"}>
                    {"Əməyin mühafizəsi və təhlükəsizliyi üzrə mütəxəssislər, mühəndis və texniki işçilər, yüksək və orta səviyyəli menecerlər üçün beynəlxalq təhlükəsizlik kursları."}
                  </p>
                </div>
                <div className={"btn is--tertiary is--no-link"}>
                  <div className={"wrapper is--h-flex-center-left is--gap-4-columns"}>
                    <div className={"bold-m"}>
                      {"Kurs seçin"}
                    </div>
                    <img src={"/images/home/Chevron-Right-1f56be04.svg"} loading={"lazy"} alt={""} className={"is--icon-size-16"} />
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>
      <section className={"section is--margin-top-144--t-128--m-104 is--section-spacing is--accent-light-bg"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <div className={"w-layout-grid is--grid-image-text"}>
            <div id={"w-node-d8ee5e26-040b-16c3-6788-48a568aed696-3a95260b"} className={"grid-image is--position-relative"}>
              <div className={"is--position-absolute is--w-100p is--h-100p"}>
                <img src={"/images/home/OHS-Directors-Board-in-ESOSH-v2-36cae184.webp"} loading={"lazy"} alt={""} className={"image-inside"} width={1920} height={1440} decoding="async" />
              </div>
            </div>
            <div id={"w-node-_23df81b9-94cc-8778-bf62-3ed355cf6153-3a95260b"} className={"wrapper is--grid-text-spacing"}>
              <div className={"wrapper is--max-width-584"}>
                <h2 className={"h2 is--margin-bottom-24"}>
                  {"Biz əməyin mühafizəsi və sağlamlığı üzrə mütəxəssislərin peşəkar birliyiyik"}
                </h2>
                <p className={"regular-l is--margin-bottom-32"}>
                  {"Avropa Əməyin Təhlükəsizliyi və Sağlamlığı Cəmiyyəti (ESOSH) əməyin mühafizəsi və sağlamlıq sahəsində qabaqcıl beynəlxalq təcrübələri təbliğ edən və səriştələri inkişaf etdirən əməyin mühafizəsi üzrə mütəxəssislərin peşəkar birliyidir. "}
                  {"Assosiasiyanın mütəxəssisləri beynəlxalq şirkətlərdə praktiki təcrübəyə və Avropa ixtisaslarına malik mütəxəssislərdir."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <HomeMembersStat locale="az" />
      <section className={"section is--margin-top-144--t-128--m-104"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <div className={"wrapper is--h-flex-center-center is--margin-bottom-64"}>
            <h2 className={"h2 is--center is--max-width-648"}>
              {"Cəmiyyətə qoşulun və işdə təhlükəsizlik və sağlamlıq sahəsində inkişaf edin"}
            </h2>
          </div>
          <div className={"w-layout-grid is--grid-links-image"}>
            <div id={"w-node-e9e4dc40-f9df-be5c-f780-cd2efd0543a3-3a95260b"} className={"wrapper is--v-flex-start-start is--rows-gap-32 is--max-width-560"}>
              <a href={"/az/join/participation"} className={"wrapper is--no-link is--h-flex-top-left is--gap-24 w-inline-block"}>
                <img src={"/images/home/Diamond-1f302500.svg"} loading={"lazy"} alt={""} className={"is--icon-size-32"} />
                <div className={"wrapper"}>
                  <div className={"wrapper is--h-flex-center-left--m-top is--gap-16 is--margin-bottom-12"}>
                    <h3 className={"h3"}>
                      {"Müəssisələr üçün ESOSH-da iştirak"}
                    </h3>
                    <img src={"/images/home/Arrow-Right-dfaefc46.svg"} loading={"lazy"} alt={""} className={"is--icon-size-20"} />
                  </div>
                  <p className={"regular-l"}>
                    {"Birlikdə inkişaf etdirmək və yaxşı təcrübələri tətbiq etmək və Ukraynada iş sağlamlığı və təhlükəsizliyini təşviq etmək üçün bizə qoşulun."}
                  </p>
                </div>
              </a>
              <a href={"/az/join/enrollment"} className={"wrapper is--no-link is--h-flex-top-left is--gap-24 w-inline-block"}>
                <img src={"/images/home/Inventory-75285e5a.svg"} loading={"lazy"} alt={""} className={"is--icon-size-32"} />
                <div className={"wrapper"}>
                  <div className={"wrapper is--h-flex-center-left--m-top is--gap-16 is--margin-bottom-12"}>
                    <h3 className={"h3"}>
                      {"Peşəkarlar üçün ESOSH-a qoşulun"}
                    </h3>
                    <img src={"/images/home/Arrow-Right-dfaefc46.svg"} loading={"lazy"} alt={""} className={"is--icon-size-20"} />
                  </div>
                  <p className={"regular-l"}>
                    {"ESOSH-a qoşulun və əməyin mühafizəsi və sağlamlığı ilə bağlı qabaqcıl bilik və resurslara çıxış əldə edin."}
                  </p>
                </div>
              </a>
              <a href={"/az/join/codex"} className={"wrapper is--no-link is--h-flex-top-left is--gap-24 w-inline-block"}>
                <img src={"/images/home/Documents-e8daedbf.svg"} loading={"lazy"} alt={""} className={"is--icon-size-32"} />
                <div className={"wrapper"}>
                  <div className={"wrapper is--h-flex-center-left--m-top is--gap-16 is--margin-bottom-12"}>
                    <h3 className={"h3"}>
                      {"Davranış Kodeksi"}
                    </h3>
                    <img src={"/images/home/Arrow-Right-dfaefc46.svg"} loading={"lazy"} alt={""} className={"is--icon-size-20"} />
                  </div>
                  <p className={"regular-l"}>
                    {"Davranış Kodeksimiz işimizdə və qarşılıqlı əlaqələrimizdə tətbiq etməyə çalışan əsas dəyərlərimizi və standartlarımızı müəyyən edir."}
                  </p>
                </div>
              </a>
              <a href={"/az/join/terms"} className={"wrapper is--no-link is--h-flex-top-left is--gap-24 w-inline-block"}>
                <img src={"/images/home/Document-Info-b858472d.svg"} loading={"lazy"} alt={""} className={"is--icon-size-32"} />
                <div className={"wrapper"}>
                  <div className={"wrapper is--h-flex-center-left--m-top is--gap-16 is--margin-bottom-12"}>
                    <h3 className={"h3"}>
                      {"Fəaliyyət bəyanatı"}
                    </h3>
                    <img src={"/images/home/Arrow-Right-dfaefc46.svg"} loading={"lazy"} alt={""} className={"is--icon-size-20"} />
                  </div>
                  <p className={"regular-l"}>
                    {"Bəyanatımız fəaliyyətimizi və icmamızın fəaliyyətini tənzimləyən əsas prinsip və normaları müəyyən edir."}
                  </p>
                </div>
              </a>
              <a href={"/az/join/safety-league-best-practices"} className={"wrapper is--no-link is--h-flex-top-left is--gap-24 w-inline-block"}>
                <img src={"/images/home/User-Team-8fa295aa.svg"} loading={"lazy"} alt={""} className={"is--icon-size-32"} />
                <div className={"wrapper"}>
                  <div className={"wrapper is--h-flex-center-left--m-top is--gap-16 is--margin-bottom-12"}>
                    <h3 className={"h3"}>
                      {"ESOSH Qruplar"}
                    </h3>
                    <img src={"/images/home/Arrow-Right-dfaefc46.svg"} loading={"lazy"} alt={""} className={"is--icon-size-20"} />
                  </div>
                  <p className={"regular-l"}>
                    {"Biz iş yeri təhlükəsizliyi üçün yeni standartlar və yaxşı təcrübələr yaratmaq üçün birlikdə işləyirik."}
                  </p>
                </div>
              </a>
            </div>
            <div id={"w-node-d2f0656b-9dfd-e281-31ce-7619b8ad73d4-3a95260b"} className={"grid-image is--position-relative"}>
              <div className={"is--position-absolute is--w-100p is--h-100p"}>
                <img src={"/images/home/IMG-6693-052d0f21.webp"} loading={"lazy"} alt={""} className={"image-inside"} width={1953} height={1365} decoding="async" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className={"section is--margin-top-144--t-128--m-104"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <div className={"wrapper is--h-flex-bottom-space-between is--margin-bottom-40"}>
            <h2 className={"h2"}>
              {"Kurslarımız"}
            </h2>
            <a href={"/az/education/courses"} className={"btn is--tertiary w-inline-block"}>
              <div className={"wrapper is--h-flex-center-left is--gap-4-columns"}>
                <div className={"bold-m"}>
                  {"Daha çox baxın"}
                </div>
                <img src={"/images/home/Chevron-Right-1f56be04.svg"} loading={"lazy"} alt={""} className={"is--icon-size-16"} />
              </div>
            </a>
          </div>
          <div className={"w-layout-grid is--courses-grid is--home"}>
            <a id={"w-node-_6ee2f36e-8ff0-0717-7fa1-c2e14037c784-3a95260b"} href={"#"} className={"wrapper is--course w-inline-block"}>
              <div className={"course-image-wrapper"}>
                <img src={"/images/home/christina-hawkins-VDpYOvZm2Ok-unsplash-e7a1d6db.webp"} loading={"lazy"} alt={""} className={"course-image"} width={1920} height={1280} decoding="async" />
              </div>
              <div className={"course-content"}>
                <div className={"chips is--green"}>
                  <div className={"medium-xs"}>
                    {"Əsas"}
                  </div>
                </div>
                <h3 className={"h3 is--max-width-440"}>
                  {"Maneəsiz + təhlükəsizlik. Əlilliyi olan işçilərin və ziyarətçilərin təhlükəsizliyi"}
                </h3>
              </div>
            </a>
            <a id={"w-node-_6ee2f36e-8ff0-0717-7fa1-c2e14037c78d-3a95260b"} href={"#"} className={"wrapper is--course w-inline-block"}>
              <div className={"course-image-wrapper"}>
                <img src={"/images/home/linkedin-sales-solutions-YDVdprpgHv4-unsplash-00d296f0.webp"} loading={"lazy"} alt={""} className={"course-image"} width={2000} height={1364} decoding="async" />
              </div>
              <div className={"course-content"}>
                <div className={"chips is--green"}>
                  <div className={"medium-xs"}>
                    {"Əsas"}
                  </div>
                </div>
                <h3 className={"h3 is--max-width-440"}>
                  {"Müharibə zamanı əməyin mühafizəsi və sağlamlığı (ƏSG). Müharibə zamanı risklər"}
                </h3>
              </div>
            </a>
            <a id={"w-node-_6ee2f36e-8ff0-0717-7fa1-c2e14037c796-3a95260b"} href={"#"} className={"wrapper is--course w-inline-block"}>
              <div className={"course-image-wrapper"}>
                <img src={"/images/home/sams-solutions-qsk-ifUucWE-unsplash-ddff0b33.webp"} loading={"lazy"} alt={""} className={"course-image"} width={1920} height={1277} decoding="async" />
              </div>
              <div className={"course-content"}>
                <div className={"chips is--green"}>
                  <div className={"medium-xs"}>
                    {"Əsas"}
                  </div>
                </div>
                <h3 className={"h3 is--max-width-440"}>
                  {"İş yerində psixi sağlamlığın idarə edilməsi. Sistemli və fərdi yanaşma"}
                </h3>
              </div>
            </a>
          </div>
        </div>
      </section>
      <section className={"section is--margin-top-144--t-128--m-104"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <div className={"banner is--spacing-32-32--m-24-32 is--radius-6 is--height-600--m-520 is--v-flex-center-center is--practice"}>
            <div className={"wrapper is--v-flex-center-top is--max-width-408"}>
              <h2 className={"h2 is--white is--center is--margin-bottom-16"}>
                {"ESOSH peşəkar qruplar tərəfindən yaradılmış ən yaxşı təcrübələr və standartlar"}
              </h2>
              <p className={"regular-l is--white is--center is--margin-bottom-24"}>
                {"ESOSH Bilik Bazamızda mövcud sənədlərin tam siyahısına daxil olun."}
              </p>
              <a href={"#"} className={"btn is--secondary is--white-btn w-button"}>
                {"Təcrübələr"}
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className={"section is--margin-top-144--t-128--m-104 is--margin-bottom-144--t-128--m-104"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <h2 className={"h2 is--margin-bottom-40"}>
            {"Biz sizə zəmanət veririk"}
          </h2>
          <div className={"w-layout-grid is--grid-4-columns--t-2--m-1"}>
            <div id={"w-node-e34f6418-fd89-5a0f-0d63-008e1540b400-3a95260b"} className={"block is--radius-6 is--accent-light-bg is--spacing-32-32--m-24-32"}>
              <img src={"/images/home/Brain-aaa97dc7.svg"} loading={"lazy"} alt={""} className={"is--icon-size-40 is--margin-bottom-40"} />
              <h3 className={"h3 is--margin-bottom-12"}>
                <strong>
                  {"Əhəmiyyətli bilik"}
                </strong>
              </h3>
              <p className={"regular-l"}>
                {"Sizin əməyin mühafizəsi ilə bağlı problemlərinizi artıq kimsə həll edib, bizdən öyrənin."}
              </p>
            </div>
            <div id={"w-node-_8450b4ce-6ee2-a921-8c2c-b1107e1990d2-3a95260b"} className={"block is--radius-6 is--accent-light-bg is--spacing-32-32--m-24-32"}>
              <img src={"/images/home/Idea-adcf02ed.svg"} loading={"lazy"} alt={""} className={"is--icon-size-40 is--margin-bottom-40"} />
              <h3 className={"h3 is--margin-bottom-12"}>
                <strong>
                  {"Açıq layihələr"}
                </strong>
              </h3>
              <p className={"regular-l"}>
                {"Burada necə təkmilləşdirə biləcəyinizlə bağlı ən son məlumatları tapa bilərsiniz."}
              </p>
            </div>
            <div id={"w-node-_2be49470-7540-86ac-5975-dc6c527364a6-3a95260b"} className={"block is--radius-6 is--accent-light-bg is--spacing-32-32--m-24-32"}>
              <img src={"/images/home/Checkmark-Shield-914e3ddb.svg"} loading={"lazy"} alt={""} className={"is--icon-size-40 is--margin-bottom-40"} />
              <h3 className={"h3 is--margin-bottom-12"}>
                <strong>
                  {"Keyfiyyətli təlim"}
                </strong>
              </h3>
              <p className={"regular-l"}>
                {"Ən yaxşı təlimçilərə, ən tanınmış kurslara və əməyin mühafizəsi üzrə effektiv təhsil proqramlarına çıxış."}
              </p>
            </div>
            <div id={"w-node-_937e1218-5f73-bb69-a6b0-40558164f1b4-3a95260b"} className={"block is--radius-6 is--accent-light-bg is--spacing-32-32--m-24-32"}>
              <img src={"/images/home/Purchase-74439efd.svg"} loading={"lazy"} alt={""} className={"is--icon-size-40 is--margin-bottom-40"} />
              <h3 className={"h3 is--margin-bottom-12"}>
                <strong>
                  {"İştirak pulsuzdur "}
                </strong>
              </h3>
              <p className={"regular-l"}>
                {"Biz təhlükəsizlik üzrə bilik və təcrübəni mümkün qədər əlçatan etməyə çalışırıq."}
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
