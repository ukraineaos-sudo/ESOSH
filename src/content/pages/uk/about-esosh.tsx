/* Public ESOSH content. About page refreshed from client brief (ESOSH section). */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LeadershipSection } from "@/components/cms/LeadershipSection";
import { LocaleDocLink } from "@/components/docs/LocaleDocLink";

function Bullet({ children }: { children: string }) {
  return (
    <div className={"bullet-list__item is--w-100p"}>
      <div className={"bullet-list__bullet-wrapper"}>
        <div className={"bullet-list__bullet"} />
      </div>
      <p className={"regular-l is--w-100p"}>{children}</p>
    </div>
  );
}

/** RU: Содержимое страницы. EN: Static page content. */
export default function PageContent() {
  return (
    <>
      <section className={"section is--height-100vh--a-auto is--internal-hero"}>
        <Header />
        <div className={"wrapper is--accent-light-bg is--position-relative is--grow"}>
          <div className={"wrapper is--hero-internal-layout"}>
            <div
              id={"w-node-c2b76b49-bade-45ec-745c-ba969b70a108-4f5ccd80"}
              className={"wrapper is--hero-internal-text"}
            >
              <div className={"w-layout-blockcontainer container is--w-100p w-container"}>
                <div className={"wrapper is--hero-internal-text-wrapper"}>
                  <div className={"wrapper is--max-width-600"}>
                    <h1 className={"h1"}>
                      {"Єдина спілка фахівців з безпеки праці України, "}
                      <span className={"is--accent"}>{"визнана в Європі"}</span>
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <div className={"hero-internal-image"} />
          </div>
        </div>
      </section>

      <section className={"section is--margin-top-144--t-128--m-104"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <div className={"wrapper is--max-width-720 is--margin-bottom-40"}>
            <h2 className={"h2 is--margin-bottom-16"}>
              {"Професійна спільнота фахівців з безпеки праці"}
            </h2>
            <p className={"regular-l is--margin-bottom-16"}>
              {
                "ESOSH — міжнародна професійна спільнота, яка об’єднує фахівців з охорони праці, промислової безпеки, управління ризиками та сталого розвитку."
              }
            </p>
            <p className={"regular-l"}>
              {
                "Ми створюємо середовище, де експерти можуть обмінюватися досвідом, розвивати компетентності та впроваджувати сучасні підходи до безпеки праці в Україні та за її межами."
              }
            </p>
          </div>
          <div className={"w-layout-grid is--grid-image-text"}>
            <div
              id={"w-node-_23817ebf-f923-5fe5-67cb-6e2db151cf4e-4f5ccd80"}
              className={"grid-image is--position-relative"}
            >
              <div className={"is--position-absolute is--w-100p is--h-100p"}>
                <img
                  src={"/images/about-esosh/IMG-1276-bacf5ac6.webp"}
                  loading={"lazy"}
                  alt={""}
                  className={"image-inside"}
                  width={1800}
                  height={1200}
                  decoding="async"
                />
              </div>
            </div>
            <div
              id={"w-node-_23817ebf-f923-5fe5-67cb-6e2db151cf4f-4f5ccd80"}
              className={"wrapper is--grid-text-spacing"}
            >
              <div className={"wrapper is--max-width-584"}>
                <h2 className={"h2 is--margin-bottom-24 is--max-width-440"}>
                  {"Що робить ESOSH"}
                </h2>
                <div className={"text-spacing-wrapper is--margin-bottom-32"}>
                  <div className={"wrapper is--w-100p"}>
                    <div className={"bullet-list"}>
                      <Bullet>{"об’єднує фахівців у сфері безпеки праці;"}</Bullet>
                      <Bullet>{"розвиває професійну спільноту;"}</Bullet>
                      <Bullet>
                        {"підтримує міжнародні стандарти та сучасні підходи;"}
                      </Bullet>
                      <Bullet>
                        {
                          "допомагає впроваджувати принципи risk-based approach — ризик-орієнтований підхід;"
                        }
                      </Bullet>
                      <Bullet>{"популяризує сучасну культуру безпеки;"}</Bullet>
                      <Bullet>
                        {"підтримує професійний розвиток українських фахівців;"}
                      </Bullet>
                      <Bullet>
                        {"сприяє інтеграції України у міжнародний професійний простір."}
                      </Bullet>
                    </div>
                  </div>
                  <p className={"regular-l"}>
                    {
                      "Понад 3000 асоційованих членів із 14 країн, доєднуйтеся, це безоплатно. Чекатимемо на Ваше резюме, "
                    }
                    <a href={"mailto:office@esosh.net"} className={"link"}>
                      {"office@esosh.net"}
                    </a>
                    {" у відповідь — електронний сертифікат учасника ESOSH."}
                  </p>
                </div>
                <a href={"/join/enrollment"} className={"btn is--primary w-button"}>
                  {"Дізнатися більше"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className={
          "section is--margin-top-144--t-128--m-104 is--section-spacing is--accent-light-bg"
        }
      >
        <div className={"w-layout-blockcontainer container w-container"}>
          <h2 className={"h2 is--margin-bottom-40"}>{"Завжди на крок попереду"}</h2>
          <div className={"w-layout-grid is--grid-3-columns--t-1--m-1"}>
            <div
              id={"w-node-_210a8d6c-e1dd-14d7-ad32-9ae2c448a703-4f5ccd80"}
              className={"block is--radius-6 is--spacing-32-32--m-24-32 is--border-light-blue"}
            >
              <img
                src={"/images/home/Diamond-1f302500.svg"}
                loading={"lazy"}
                alt={""}
                className={"is--icon-size-40 is--margin-bottom-40"}
              />
              <div className={"wrapper is--max-width-480"}>
                <h3 className={"h3 is--margin-bottom-12"}>{"Місія ESOSH"}</h3>
                <p className={"regular-l"}>
                  {
                    "Захищати життя і здоров’я працівників через професійну спільноту, знання, стандарти та практичні рішення. Життя є найвищою цінністю."
                  }
                </p>
              </div>
            </div>
            <div
              id={"w-node-_40b6de8c-6383-761a-5491-db8adc9892c1-4f5ccd80"}
              className={"block is--radius-6 is--spacing-32-32--m-24-32 is--border-light-blue"}
            >
              <img
                src={"/images/about-esosh/Globe-e0dc32eb.svg"}
                loading={"lazy"}
                alt={""}
                className={"is--icon-size-40 is--margin-bottom-40"}
              />
              <div className={"wrapper is--max-width-480"}>
                <h3 className={"h3 is--margin-bottom-12"}>{"Міжнародне визнання"}</h3>
                <p className={"regular-l"}>
                  {
                    "З 2022 року ESOSH — член ENSHPO (Європейська мережа професійних організацій з безпеки та здоров’я на роботі). У 2022–2023 роках — виконавець проєктів МОП в Україні."
                  }
                </p>
              </div>
            </div>
            <div
              id={"w-node-_199ae3b7-85cc-36f7-4f5f-163c941a8571-4f5ccd80"}
              className={"block is--radius-6 is--spacing-32-32--m-24-32 is--border-light-blue"}
            >
              <img
                src={"/images/about-esosh/Education-3d3c478d.svg"}
                loading={"lazy"}
                alt={""}
                className={"is--icon-size-40 is--margin-bottom-40"}
              />
              <div className={"wrapper is--max-width-480"}>
                <h3 className={"h3 is--margin-bottom-12"}>{"Професійний підхід"}</h3>
                <p className={"regular-l"}>
                  {
                    "4 рівні професійної кваліфікації, понад 300 сертифікованих фахівців, власні методики аудитів і понад 30 унікальних тренінгів та програм з безпеки праці."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={"section is--margin-top-144--t-128--m-104"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <div className={"wrapper is--max-width-720 is--margin-bottom-40"}>
            <h2 className={"h2 is--margin-bottom-16"}>{"Напрями роботи ESOSH"}</h2>
            <p className={"regular-l"}>
              {
                "Чотири опори спільноти: мережа експертів, кваліфікація, стандарти та якісне навчання."
              }
            </p>
          </div>
          <div className={"w-layout-grid is--grid-3-columns--t-1--m-1"}>
            <div className={"block is--radius-6 is--spacing-32-32--m-24-32 is--border-light-blue"}>
              <h3 className={"h3 is--margin-bottom-12"}>{"Професійна спільнота"}</h3>
              <p className={"regular-l"}>
                {
                  "Мережа експертів, тренерів, консультантів і практиків у сфері безпеки праці."
                }
              </p>
            </div>
            <div className={"block is--radius-6 is--spacing-32-32--m-24-32 is--border-light-blue"}>
              <h3 className={"h3 is--margin-bottom-12"}>{"Кваліфікація фахівців"}</h3>
              <p className={"regular-l"}>
                {
                  "Розвиток компетентностей через навчання, сертифікаційні програми, професійні заходи та практичний обмін досвідом."
                }
              </p>
            </div>
            <div className={"block is--radius-6 is--spacing-32-32--m-24-32 is--border-light-blue"}>
              <h3 className={"h3 is--margin-bottom-12"}>{"Стандарти безпеки"}</h3>
              <p className={"regular-l"}>
                {
                  "Розроблення та просування сучасних стандартів у сфері безпеки праці, управління ризиками та сталого розвитку."
                }
              </p>
            </div>
            <div className={"block is--radius-6 is--spacing-32-32--m-24-32 is--border-light-blue"}>
              <h3 className={"h3 is--margin-bottom-12"}>{"Якісне навчання"}</h3>
              <p className={"regular-l"}>
                {
                  "Тренінги, вебінари, практичні програми та обмін досвідом від експертів з міжнародною практикою."
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className={
          "section is--margin-top-144--t-128--m-104 is--section-spacing is--accent-light-bg"
        }
      >
        <div className={"w-layout-blockcontainer container w-container"}>
          <div className={"w-layout-grid is--grid-image-text"}>
            <div className={"wrapper is--grid-text-spacing"}>
              <div className={"wrapper is--max-width-584"}>
                <h2 className={"h2 is--margin-bottom-24"}>{"ESOSH для України"}</h2>
                <div className={"text-spacing-wrapper"}>
                  <p className={"regular-l is--margin-bottom-16"}>
                    {
                      "ESOSH допомагає українським фахівцям інтегруватися у міжнародний професійний простір, розвивати компетентності та впроваджувати сучасні підходи до охорони праці."
                    }
                  </p>
                  <p className={"regular-l"}>
                    {
                      "Ми віримо, що безпечне відновлення України починається з людей, які мають знання, досвід і спільну відповідальність за майбутнє."
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className={"wrapper is--grid-text-spacing"}>
              <div className={"wrapper is--max-width-584"}>
                <h2 className={"h2 is--margin-bottom-24"}>{"Факти про ESOSH"}</h2>
                <div className={"bullet-list"}>
                  <Bullet>
                    {"ESOSH заснована у 2018 році українськими фахівцями з безпеки праці."}
                  </Bullet>
                  <Bullet>{"З 2022 року ESOSH є членом ENSHPO."}</Bullet>
                  <Bullet>
                    {
                      "У 2022–2023 роках ESOSH була виконавцем проєктів Міжнародної організації праці (МОП) в Україні."
                    }
                  </Bullet>
                  <Bullet>
                    {
                      "4 рівні професійної кваліфікації, понад 300 сертифікованих фахівців і більше 3000 асоційованих членів із 14 країн."
                    }
                  </Bullet>
                  <Bullet>
                    {
                      "Понад 30 унікальних тренінгів і програм з безпеки праці, а також власні методики аудитів."
                    }
                  </Bullet>
                  <Bullet>{"15 робочих галузевих груп."}</Bullet>
                  <Bullet>
                    {
                      "Формує систему стандартів з безпеки праці, які доповнюють законодавчі вимоги та орієнтуються на кращі міжнародні практики."
                    }
                  </Bullet>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={"section is--margin-top-144--t-128--m-104"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <div className={"wrapper is--max-width-720 is--margin-bottom-40"}>
            <h2 className={"h2 is--margin-bottom-16"}>{"ESOSH є засновником"}</h2>
            <p className={"regular-l"}>
              {
                "Спільнота ініціює та підтримує проєкти, що посилюють безпеку праці в Україні та зв’язок із міжнародними партнерами."
              }
            </p>
          </div>
          <div className={"bullet-list"}>
            <Bullet>
              {
                "Альянсу допомоги українським працівникам HelpUAWorkers — разом з VDSI (Німеччина);"
              }
            </Bullet>
            <Bullet>
              {
                "Розмовного клубу з безпеки праці та охорони здоров’я HSE-SC — разом з журналом «Охорона праці»;"
              }
            </Bullet>
            <Bullet>
              {"Платформи суспільного діалогу та реформ у сфері охорони праці SafePlatform;"}
            </Bullet>
            <Bullet>
              {
                "Асоціації виробників та постачальників засобів індивідуального захисту УкрАПБ;"
              }
            </Bullet>
            <Bullet>{"Навчального хабу з безпеки праці у співпраці з 8 університетами;"}</Bullet>
            <Bullet>{"Спортивного руху «Рух за безпечну працю»."}</Bullet>
          </div>
        </div>
      </section>

      <LeadershipSection locale="uk" />

      <section className={"section is--margin-top-144--t-128--m-104"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <div className={"wrapper is--max-width-537 is--margin-bottom-40"}>
            <h2 className={"h2 is--margin-bottom-16"}>{"Рекомендації"}</h2>
            <p className={"regular-l"}>
              {
                "Наші надійні та професійні партнери, роботу з якими ми рекомендуємо як фахова спілка з безпеки праці."
              }
            </p>
          </div>
          <div className={"w-layout-grid is--recomendations-grid"}>
            <a
              id={"w-node-fa8d2704-7ed9-b90d-48f0-3cd384b46d14-4f5ccd80"}
              href={"https://helpuaworkers.com/"}
              target={"_blank"}
              className={"recommendation w-inline-block"}
              rel="noopener noreferrer"
            >
              <div className={"wrapper"}>
                <img
                  src={"/images/about-esosh/Logo---Help-593dce61.png"}
                  loading={"lazy"}
                  alt={""}
                  className={"recommendation__logo is--margin-bottom-32"}
                  width={200}
                  height={40}
                  decoding="async"
                />
                <p className={"regular-l"}>
                  {
                    "Альянс допомоги українським працівникам – збір за кордоном та передача в Україну засобів захисту та експертних знань з безпеки праці в умовах війни, з 2022 року"
                  }
                </p>
              </div>
              <div className={"btn is--tertiary is--no-link"}>
                <div className={"wrapper is--h-flex-center-left is--gap-4-columns"}>
                  <div className={"bold-m"}>{"Дізнатись більше"}</div>
                  <img
                    src={"/images/home/Chevron-Right-1f56be04.svg"}
                    loading={"lazy"}
                    alt={""}
                    className={"is--icon-size-16"}
                  />
                </div>
              </div>
            </a>
            <a
              id={"w-node-_0980e80a-17ed-0b0d-8c29-8946e6fa3ff9-4f5ccd80"}
              href={"https://www.ramosegroup.com/"}
              target={"_blank"}
              className={"recommendation w-inline-block"}
              rel="noopener noreferrer"
            >
              <div className={"wrapper"}>
                <img
                  src={"/images/about-esosh/Logo---Ramose-c323e6ed.png"}
                  loading={"lazy"}
                  alt={""}
                  className={"recommendation__logo is--margin-bottom-32"}
                  width={200}
                  height={40}
                  decoding="async"
                />
                <p className={"regular-l"}>
                  {
                    "ТОВ «Реймос» організація навчання в Україні NEBOSH IGC, NEBOSH Oil&Gas, IOSH “Managing Safely”, курсів з методик оцінювання ризиків HAZOP, HAZID тощо з 2018 року."
                  }
                </p>
              </div>
              <div className={"btn is--tertiary is--no-link"}>
                <div className={"wrapper is--h-flex-center-left is--gap-4-columns"}>
                  <div className={"bold-m"}>{"Дізнатись більше"}</div>
                  <img
                    src={"/images/home/Chevron-Right-1f56be04.svg"}
                    loading={"lazy"}
                    alt={""}
                    className={"is--icon-size-16"}
                  />
                </div>
              </div>
            </a>
            <a
              id={"w-node-_96dc1fb0-6d5d-8e5a-b833-ef1dc4f19be0-4f5ccd80"}
              href={"https://www.loewen-defence.de"}
              target={"_blank"}
              className={"recommendation w-inline-block"}
              rel="noopener noreferrer"
            >
              <div className={"wrapper"}>
                <img
                  src={"/images/about-esosh/Opera-2025-06-16-161036-w-4c13cbb3.png"}
                  loading={"lazy"}
                  alt={""}
                  className={"recommendation__logo is--margin-bottom-32"}
                  width={200}
                  height={40}
                  decoding="async"
                />
                <p className={"regular-l"}>
                  {"Löwen Defence - міжнародні послуги у сфері захисту бізнесу та життя (Німеччина)."}
                </p>
              </div>
              <div className={"btn is--tertiary is--no-link"}>
                <div className={"wrapper is--h-flex-center-left is--gap-4-columns"}>
                  <div className={"bold-m"}>{"Дізнатись більше"}</div>
                  <img
                    src={"/images/home/Chevron-Right-1f56be04.svg"}
                    loading={"lazy"}
                    alt={""}
                    className={"is--icon-size-16"}
                  />
                </div>
              </div>
            </a>
            <a
              id={"w-node-_11200e39-aaa7-29b0-0198-9186b5a87a6e-4f5ccd80"}
              href={"https://ohoronapraci.kiev.ua/"}
              target={"_blank"}
              className={"recommendation w-inline-block"}
              rel="noopener noreferrer"
            >
              <div className={"wrapper"}>
                <img
                  src={"/images/about-esosh/Logo---Security-0a31e227.png"}
                  loading={"lazy"}
                  alt={""}
                  className={"recommendation__logo is--margin-bottom-32"}
                  width={200}
                  height={40}
                  decoding="async"
                />
                <p className={"regular-l"}>
                  {
                    "Редакція журналу «Охорона праці» - організація конференцій та вебинарів спільно з ESOSH з 2018 року"
                  }
                </p>
              </div>
              <div className={"btn is--tertiary is--no-link"}>
                <div className={"wrapper is--h-flex-center-left is--gap-4-columns"}>
                  <div className={"bold-m"}>{"Дізнатись більше"}</div>
                  <img
                    src={"/images/home/Chevron-Right-1f56be04.svg"}
                    loading={"lazy"}
                    alt={""}
                    className={"is--icon-size-16"}
                  />
                </div>
              </div>
            </a>
            <a
              id={"w-node-_8c5d82ef-4229-d8db-1aa8-526e3e6e58af-4f5ccd80"}
              href={"https://insightplus.com.ua"}
              target={"_blank"}
              className={"recommendation w-inline-block"}
              rel="noopener noreferrer"
            >
              <div className={"wrapper"}>
                <img
                  src={"/images/about-esosh/Insight-5953bd38.png"}
                  loading={"lazy"}
                  alt={""}
                  className={"recommendation__logo is--margin-bottom-32"}
                  width={200}
                  height={40}
                  decoding="async"
                />
                <p className={"regular-l"}>
                  {
                    "Компанія «ІНСАЙТ. UA» - український виробник і постачальник спецодягу, робочого взуття та ЗІЗ. ТМ INSIGHT і TM Free Work, успішно пройшла аудит з стійкого розвитку і рекомендована ESOSH як надійний партнер "
                  }
                </p>
              </div>
              <div className={"btn is--tertiary is--no-link"}>
                <div className={"wrapper is--h-flex-center-left is--gap-4-columns"}>
                  <div className={"bold-m"}>{"Дізнатись більше"}</div>
                  <img
                    src={"/images/home/Chevron-Right-1f56be04.svg"}
                    loading={"lazy"}
                    alt={""}
                    className={"is--icon-size-16"}
                  />
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className={"section is--margin-top-144--t-128--m-104"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <div className={"w-layout-grid is--grid-text-image"}>
            <div
              id={"w-node-bee42958-44c0-3e52-7377-fa0107d5d77b-4f5ccd80"}
              className={"wrapper is--grid-text-spacing"}
            >
              <div className={"wrapper is--max-width-584"}>
                <h2 className={"h2 is--margin-bottom-24 is--max-width-440"}>
                  {"Юридична інформація / Impressum"}
                </h2>
                <div className={"text-spacing-wrapper"}>
                  <p className={"regular-l"}>
                    {
                      "Громадська спілка «Європейське співтовариство з охорони праці» (ГС ЄСОП)"
                    }
                  </p>
                  <p className={"regular-l"}>{"ЄДРПОУ 42755196"}</p>
                  <p className={"regular-l"}>{"Дата реєстрації 15.01.2019"}</p>
                  <p className={"regular-l"}>{"Голова Правління Ольга Богданова"}</p>
                  <div className={"wrapper is--w-100p"}>
                    <div className={"wrapper is--margin-bottom-24"}>
                      <div className={"bold-l is--margin-bottom-12"}>{"Юридична адреса"}</div>
                      <p>
                        {
                          "Україна, 04107, м. Київ, вул. Татарська, буд. 21, літера А"
                        }
                      </p>
                    </div>
                    <div className={"wrapper is--margin-bottom-24"}>
                      <div className={"bold-l is--margin-bottom-12"}>{"Поштова адреса"}</div>
                      <p>{"м. Київ, 02081, п/с 23"}</p>
                    </div>
                    <div className={"wrapper"}>
                      <div className={"bold-l is--margin-bottom-12"}>{"e-mail"}</div>
                      <p>
                        <a href={"mailto:office@esosh.net"} className={"is--accent"}>
                          {"office@esosh.net"}
                        </a>
                      </p>
                    </div>
                  </div>
                  <LocaleDocLink docId="offer" locale="uk" className={"btn is--primary w-button"}>
                    {"Договір Публічної Оферти"}
                  </LocaleDocLink>
                </div>
              </div>
            </div>
            <div
              id={"w-node-bee42958-44c0-3e52-7377-fa0107d5d79d-4f5ccd80"}
              className={"grid-image is--position-relative"}
            >
              <div className={"is--position-absolute is--w-100p is--h-100p"}>
                <img
                  src={"/images/about-esosh/05-03-19-82-9ca3f0d7.webp"}
                  loading={"lazy"}
                  alt={""}
                  className={"image-inside"}
                  width={1920}
                  height={1280}
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={"section is--margin-top-144--t-128--m-104 is--big-banners"}>
        <div className={"big-banner-wrapper is--codex"}>
          <div className={"wrapper is--max-width-320 is--w-100p is--v-flex-center-center"}>
            <h2 className={"h2 is--white is--center is--margin-bottom-24"}>
              {"Участь в ЄСОП підприємствам"}
            </h2>
            <a
              href={"https://drive.google.com/drive/u/0/folders/1KPpnjR_MbWzw8G-0jxoyKRU_ld7rs_OD"}
              target={"_blank"}
              className={"btn is--secondary is--white-btn w-button"}
              rel="noopener noreferrer"
            >
              {"Дізнатись більше"}
            </a>
          </div>
        </div>
        <div className={"big-banner-wrapper is--participation"}>
          <div className={"wrapper is--max-width-320 is--w-100p is--v-flex-center-center"}>
            <h2 className={"h2 is--white is--center is--margin-bottom-24"}>
              {"Вступ до ЄСОП фахівцям"}
            </h2>
            <a
              href={"https://drive.google.com/drive/u/0/folders/1KPpnjR_MbWzw8G-0jxoyKRU_ld7rs_OD"}
              target={"_blank"}
              className={"btn is--secondary is--white-btn w-button"}
              rel="noopener noreferrer"
            >
              {"Дізнатись більше"}
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
