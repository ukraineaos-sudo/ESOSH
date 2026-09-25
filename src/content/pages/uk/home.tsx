/* Public ESOSH content captured 2026-09-07. Edit text and media here. */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CmsNewsListItems } from "@/components/cms/CmsNewsListItems";

/** RU: Содержимое страницы. EN: Static page content. */
export default function PageContent() {
  return (
    <>
      <section className={"section is--accent-light-bg"}>
        <Header />
        <div className={"w-layout-blockcontainer container w-container"}>
          <div className={"wrapper is--offer is--margin-top-128--t-112--m-88 is--margin-bottom-88--m-72"}>
            <h1 className={"h1 is--max-width-648"}>
              {"Будуємо європейський рівень"}
              <br />
              <span className={"is--accent"}>
                {"безпеки праці"}
              </span>
              {" в Україні"}
            </h1>
            <div className={"wrapper is--max-width-456"}>
              <p className={"regular-l is--margin-bottom-24"}>
                {"Асоціація фахівців з безпеки праці ESOSH формує цінності, підвищує рівень знань, впливає на законодавчі зміни, тримає зв’язки з міжнародними провідними організаціями, аби праця в Україні була безпечною. Участь безоплатна, доєднуйтеся і зростайте."}
              </p>
              <a href={"/businesses"} className={"btn is--primary w-button"}>
                {"Цікавить"}
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
              {"Новини та заходи"}
            </h2>
            <a href={"/news"} className={"btn is--tertiary w-inline-block"}>
              <div className={"wrapper is--h-flex-center-left is--gap-4-columns"}>
                <div className={"bold-m"}>
                  {"Більше новин"}
                </div>
                <img src={"/images/home/Chevron-Right-1f56be04.svg"} loading={"lazy"} alt={""} className={"is--icon-size-16"} />
              </div>
            </a>
          </div>
          <div className={"collection-list-wrapper w-dyn-list"}>
            <div role={"list"} className={"collection-list is--grid-3-columns--a-1-column w-dyn-items"}>
              <CmsNewsListItems locale="uk" limit={3} />
            </div>
          </div>
        </div>
      </section>
      <section className={"section is--margin-top-144--t-128--m-104"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <div className={"wrapper is--h-flex-bottom-space-between is--margin-bottom-40"}>
            <h2 className={"h2"}>
              {"Підприємствам"}
            </h2>
            <a href={"/businesses"} className={"btn is--tertiary w-inline-block"}>
              <div className={"wrapper is--h-flex-center-left is--gap-4-columns"}>
                <div className={"bold-m"}>
                  {"Дізнатись більше"}
                </div>
                <img src={"/images/home/Chevron-Right-1f56be04.svg"} loading={"lazy"} alt={""} className={"is--icon-size-16"} />
              </div>
            </a>
          </div>
          <div className={"wrapper is--grid-block-2-columns--a-1column"}>
            <a href={"/education/projects"} className={"block is--spacing-32-32--m-24-32 is--border-grey-7 is--v-flex-start-start w-inline-block"}>
              <img src={"/images/home/Presentation-file-d50be3ea.svg"} loading={"lazy"} alt={""} className={"is--icon-size-40 is--margin-bottom-32"} />
              <div className={"wrapper is--v-flex-start-space-between is--grow"}>
                <div className={"wrapper is--max-width-480 is--margin-bottom-32"}>
                  <h3 className={"h3 is--margin-bottom-12"}>
                    {"Оцінка ризиків"}
                  </h3>
                  <p className={"regular-l"}>
                    {"Оцінювання ризиків, аудити, супровід проектів, специфічні безпекові програми. Наші фахівці постійно підвищують кваліфікацію за кордоном, впроваджують практики зниження травматизму в Україні, і можуть бути корисними і у вашій діяльності."}
                  </p>
                </div>
                <div className={"btn is--tertiary is--no-link"}>
                  <div className={"wrapper is--h-flex-center-left is--gap-4-columns"}>
                    <div className={"bold-m"}>
                      {"Наші проекти"}
                    </div>
                    <img src={"/images/home/Chevron-Right-1f56be04.svg"} loading={"lazy"} alt={""} className={"is--icon-size-16"} />
                  </div>
                </div>
              </div>
            </a>
            <a href={"/education/courses"} className={"block is--spacing-32-32--m-24-32 is--border-grey-7 is--v-flex-start-start w-inline-block"}>
              <img src={"/images/home/Persons-348db007.svg"} loading={"lazy"} alt={""} className={"is--icon-size-40 is--margin-bottom-32"} />
              <div className={"wrapper is--v-flex-start-space-between is--grow"}>
                <div className={"wrapper is--max-width-480 is--margin-bottom-32"}>
                  <h3 className={"h3 is--margin-bottom-12"}>
                    {"Тренінгові програми"}
                  </h3>
                  <p className={"regular-l"}>
                    {"Міжнародні курси з безпеки для фахівців з охорони праці, інженерно-технічних робітників, керівників вищої та середньої ланки."}
                  </p>
                </div>
                <div className={"btn is--tertiary is--no-link"}>
                  <div className={"wrapper is--h-flex-center-left is--gap-4-columns"}>
                    <div className={"bold-m"}>
                      {"Обрати курс"}
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
                  {"Ми — професійна асоціація спеціалістів з "}
                  <span className={"is--accent"}>
                    {"безпеки та здоров’я"}
                  </span>
                  {" на роботі"}
                </h2>
                <p className={"regular-l is--margin-bottom-32"}>
                  {"Європейське співтовариство з охорони праці (ЄСОП) – це професійна асоціація спеціалістів з виробничої безпеки, що поширює найкращі світові практики та розвиває компетенції з безпеки та гігієни праці."}
                  <br />
                  <br />
                  {"Експертами асоціації є фахівці з практичним досвідом роботи у міжнародних компаніях та європейською кваліфікацією."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className={"section is--margin-top-144--t-128--m-104"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <div className={"wrapper is--h-flex-center-center is--margin-bottom-64"}>
            <h2 className={"h2 is--center is--max-width-648"}>
              <span className={"is--accent"}>
                {"Приєднуйтеся до спільноти"}
              </span>
              {" та розвивайтеся в сфері безпеки та здоров’я на роботі"}
            </h2>
          </div>
          <div className={"w-layout-grid is--grid-links-image"}>
            <div id={"w-node-e9e4dc40-f9df-be5c-f780-cd2efd0543a3-3a95260b"} className={"wrapper is--v-flex-start-start is--rows-gap-32 is--max-width-560"}>
              <a href={"/join/participation"} className={"wrapper is--no-link is--h-flex-top-left is--gap-24 w-inline-block"}>
                <img src={"/images/home/Diamond-1f302500.svg"} loading={"lazy"} alt={""} className={"is--icon-size-32"} />
                <div className={"wrapper"}>
                  <div className={"wrapper is--h-flex-center-left--m-top is--gap-16 is--margin-bottom-12"}>
                    <h3 className={"h3"}>
                      {"Участь в ЄСОП підприємств"}
                    </h3>
                    <img src={"/images/home/Arrow-Right-dfaefc46.svg"} loading={"lazy"} alt={""} className={"is--icon-size-20"} />
                  </div>
                  <p className={"regular-l"}>
                    {"Приєднайтеся до нас, щоб спільно розробляти і впроваджувати найкращі практики з охорони праці та сприяти безпеці праці в Україні."}
                  </p>
                </div>
              </a>
              <a href={"/join/enrollment"} className={"wrapper is--no-link is--h-flex-top-left is--gap-24 w-inline-block"}>
                <img src={"/images/home/Inventory-75285e5a.svg"} loading={"lazy"} alt={""} className={"is--icon-size-32"} />
                <div className={"wrapper"}>
                  <div className={"wrapper is--h-flex-center-left--m-top is--gap-16 is--margin-bottom-12"}>
                    <h3 className={"h3"}>
                      {"Вступ в ЄСОП фахівцям"}
                    </h3>
                    <img src={"/images/home/Arrow-Right-dfaefc46.svg"} loading={"lazy"} alt={""} className={"is--icon-size-20"} />
                  </div>
                  <p className={"regular-l"}>
                    {"Приєднуйтесь до ЄСОП і отримайте доступ до передових знань і ресурсів з безпеки праці."}
                  </p>
                </div>
              </a>
              <a href={"/join/codex"} className={"wrapper is--no-link is--h-flex-top-left is--gap-24 w-inline-block"}>
                <img src={"/images/home/Documents-e8daedbf.svg"} loading={"lazy"} alt={""} className={"is--icon-size-32"} />
                <div className={"wrapper"}>
                  <div className={"wrapper is--h-flex-center-left--m-top is--gap-16 is--margin-bottom-12"}>
                    <h3 className={"h3"}>
                      {"Кодекс поведінки"}
                    </h3>
                    <img src={"/images/home/Arrow-Right-dfaefc46.svg"} loading={"lazy"} alt={""} className={"is--icon-size-20"} />
                  </div>
                  <p className={"regular-l"}>
                    {"Наш кодекс поведінки визначає наші основні цінності та стандарти, які ми прагнемо втілювати в своїй роботі та взаємодіях."}
                  </p>
                </div>
              </a>
              <a href={"/join/terms"} className={"wrapper is--no-link is--h-flex-top-left is--gap-24 w-inline-block"}>
                <img src={"/images/home/Document-Info-b858472d.svg"} loading={"lazy"} alt={""} className={"is--icon-size-32"} />
                <div className={"wrapper"}>
                  <div className={"wrapper is--h-flex-center-left--m-top is--gap-16 is--margin-bottom-12"}>
                    <h3 className={"h3"}>
                      {"Положення про ЄСОП"}
                    </h3>
                    <img src={"/images/home/Arrow-Right-dfaefc46.svg"} loading={"lazy"} alt={""} className={"is--icon-size-20"} />
                  </div>
                  <p className={"regular-l"}>
                    {"Наше положення про ЄСОП визначає ключові принципи та норми, які регулюють нашу діяльність та функціонування нашої спільноти."}
                  </p>
                </div>
              </a>
              <a href={"/join/safety-league-best-practices"} className={"wrapper is--no-link is--h-flex-top-left is--gap-24 w-inline-block"}>
                <img src={"/images/home/User-Team-8fa295aa.svg"} loading={"lazy"} alt={""} className={"is--icon-size-32"} />
                <div className={"wrapper"}>
                  <div className={"wrapper is--h-flex-center-left--m-top is--gap-16 is--margin-bottom-12"}>
                    <h3 className={"h3"}>
                      {"Фахові Групи ЄСОП"}
                    </h3>
                    <img src={"/images/home/Arrow-Right-dfaefc46.svg"} loading={"lazy"} alt={""} className={"is--icon-size-20"} />
                  </div>
                  <p className={"regular-l"}>
                    {"Ми працюємо разом для створення нових стандартів та найкращих практик з безпеки на робочих місцях."}
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
              {"Наші курси"}
            </h2>
            <a href={"/education/courses"} className={"btn is--tertiary w-inline-block"}>
              <div className={"wrapper is--h-flex-center-left is--gap-4-columns"}>
                <div className={"bold-m"}>
                  {"Переглянути більше"}
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
                    {"Базовий"}
                  </div>
                </div>
                <h3 className={"h3 is--max-width-440"}>
                  {"Безбар’єрність + безпека. Безпека працівників та відвідувачів з інвалідністю"}
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
                    {"Базовий"}
                  </div>
                </div>
                <h3 className={"h3 is--max-width-440"}>
                  {"Безпека та здоров’я на роботі (БЗР) у воєнний час. Ризики під час війни"}
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
                    {"Базовий"}
                  </div>
                </div>
                <h3 className={"h3 is--max-width-440"}>
                  {"Керування ментальним здоров’ям на роботі. Системний та індивідуальний підхід"}
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
                {"Передові практики та стандарти, створені фаховими групами ESOSH"}
              </h2>
              <p className={"regular-l is--white is--center is--margin-bottom-24"}>
                {"Отримайте доступ до повного переліку наявних документів у нашій базі знань ESOSH."}
              </p>
              <a href={"https://drive.google.com/drive/u/0/folders/1KPpnjR_MbWzw8G-0jxoyKRU_ld7rs_OD"} target={"_blank"} className={"btn is--secondary is--white-btn w-button"} rel="noopener noreferrer">
                {"До практик"}
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className={"section is--margin-top-144--t-128--m-104 is--margin-bottom-144--t-128--m-104"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <h2 className={"h2 is--margin-bottom-40"}>
            {"Ми гарантуємо вам"}
          </h2>
          <div className={"w-layout-grid is--grid-4-columns--t-2--m-1"}>
            <div id={"w-node-e34f6418-fd89-5a0f-0d63-008e1540b400-3a95260b"} className={"block is--radius-6 is--accent-light-bg is--spacing-32-32--m-24-32"}>
              <img src={"/images/home/Brain-aaa97dc7.svg"} loading={"lazy"} alt={""} className={"is--icon-size-40 is--margin-bottom-40"} />
              <h3 className={"h3 is--margin-bottom-12"}>
                {"Важливі знання"}
              </h3>
              <p className={"regular-l"}>
                {"Ваші проблеми з безпеки праці уже хтось вирішував, дізнавайтесь про це у нас."}
              </p>
            </div>
            <div id={"w-node-_8450b4ce-6ee2-a921-8c2c-b1107e1990d2-3a95260b"} className={"block is--radius-6 is--accent-light-bg is--spacing-32-32--m-24-32"}>
              <img src={"/images/home/Idea-adcf02ed.svg"} loading={"lazy"} alt={""} className={"is--icon-size-40 is--margin-bottom-40"} />
              <h3 className={"h3 is--margin-bottom-12"}>
                {"Відкриті проєкти"}
              </h3>
              <p className={"regular-l"}>
                {"Тут зібрана актуальна інформація про те, як ви можете проявити себе."}
              </p>
            </div>
            <div id={"w-node-_2be49470-7540-86ac-5975-dc6c527364a6-3a95260b"} className={"block is--radius-6 is--accent-light-bg is--spacing-32-32--m-24-32"}>
              <img src={"/images/home/Checkmark-Shield-914e3ddb.svg"} loading={"lazy"} alt={""} className={"is--icon-size-40 is--margin-bottom-40"} />
              <h3 className={"h3 is--margin-bottom-12"}>
                {"Якісне навчання"}
              </h3>
              <p className={"regular-l"}>
                {"Доступ до найкращих тренерів, найвідоміших курсів та дієвих освітніх програм з безпеки праці."}
              </p>
            </div>
            <div id={"w-node-_937e1218-5f73-bb69-a6b0-40558164f1b4-3a95260b"} className={"block is--radius-6 is--accent-light-bg is--spacing-32-32--m-24-32"}>
              <img src={"/images/home/Purchase-74439efd.svg"} loading={"lazy"} alt={""} className={"is--icon-size-40 is--margin-bottom-40"} />
              <h3 className={"h3 is--margin-bottom-12"}>
                {"Безкоштовна участь"}
              </h3>
              <p className={"regular-l"}>
                {"Ми прагнемо зробити знання та досвід з безпеки якомога доступнішими."}
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
