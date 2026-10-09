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
                      {"The only union of occupational safety specialists in Ukraine "}
                      <span className={"is--accent"}>{"recognized in Europe"}</span>
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
              {"A professional community of occupational safety specialists"}
            </h2>
            <p className={"regular-l is--margin-bottom-16"}>
              {
                "ESOSH is an international professional community that brings together specialists in occupational safety, industrial safety, risk management and sustainable development."
              }
            </p>
            <p className={"regular-l"}>
              {
                "We create an environment where experts can exchange experience, develop competencies and implement modern approaches to occupational safety in Ukraine and beyond."
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
                  {"What ESOSH does"}
                </h2>
                <div className={"text-spacing-wrapper is--margin-bottom-32"}>
                  <div className={"wrapper is--w-100p"}>
                    <div className={"bullet-list"}>
                      <Bullet>{"brings together occupational safety professionals;"}</Bullet>
                      <Bullet>{"develops the professional community;"}</Bullet>
                      <Bullet>
                        {"supports international standards and modern approaches;"}
                      </Bullet>
                      <Bullet>
                        {
                          "helps implement a risk-based approach to occupational safety;"
                        }
                      </Bullet>
                      <Bullet>{"promotes a modern safety culture;"}</Bullet>
                      <Bullet>
                        {"supports the professional development of Ukrainian specialists;"}
                      </Bullet>
                      <Bullet>
                        {
                          "contributes to Ukraine’s integration into the international professional space."
                        }
                      </Bullet>
                    </div>
                  </div>
                  <p className={"regular-l"}>
                    {
                      "More than 3,000 associate members from 14 countries — join us, it’s free. We look forward to your CV at "
                    }
                    <a href={"mailto:office@esosh.net"} className={"link"}>
                      {"office@esosh.net"}
                    </a>
                    {" — you will receive an electronic ESOSH participant certificate in response."}
                  </p>
                </div>
                <a href={"/en/join/enrollment"} className={"btn is--primary w-button"}>
                  {"Learn more"}
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
          <h2 className={"h2 is--margin-bottom-40"}>{"Always one step ahead"}</h2>
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
                <h3 className={"h3 is--margin-bottom-12"}>{"ESOSH mission"}</h3>
                <p className={"regular-l"}>
                  {
                    "To protect workers’ lives and health through a professional community, knowledge, standards and practical solutions. Life is the highest value."
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
                <h3 className={"h3 is--margin-bottom-12"}>{"International recognition"}</h3>
                <p className={"regular-l"}>
                  {
                    "Since 2022, ESOSH has been a member of ENSHPO (European Network of Safety and Health Professional Organisations). In 2022–2023, ESOSH delivered International Labour Organization (ILO) projects in Ukraine."
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
                <h3 className={"h3 is--margin-bottom-12"}>{"Professional approach"}</h3>
                <p className={"regular-l"}>
                  {
                    "Four professional qualification levels, more than 300 certified specialists, proprietary audit methodologies, and over 30 unique occupational safety trainings and programmes."
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
            <h2 className={"h2 is--margin-bottom-16"}>{"ESOSH areas of work"}</h2>
            <p className={"regular-l"}>
              {
                "Four pillars of the community: an expert network, qualifications, standards and quality learning."
              }
            </p>
          </div>
          <div className={"w-layout-grid is--grid-3-columns--t-1--m-1"}>
            <div className={"block is--radius-6 is--spacing-32-32--m-24-32 is--border-light-blue"}>
              <h3 className={"h3 is--margin-bottom-12"}>{"Professional community"}</h3>
              <p className={"regular-l"}>
                {
                  "A network of experts, trainers, consultants and practitioners in occupational safety."
                }
              </p>
            </div>
            <div className={"block is--radius-6 is--spacing-32-32--m-24-32 is--border-light-blue"}>
              <h3 className={"h3 is--margin-bottom-12"}>{"Specialist qualifications"}</h3>
              <p className={"regular-l"}>
                {
                  "Competency development through training, certification programmes, professional events and practical exchange of experience."
                }
              </p>
            </div>
            <div className={"block is--radius-6 is--spacing-32-32--m-24-32 is--border-light-blue"}>
              <h3 className={"h3 is--margin-bottom-12"}>{"Safety standards"}</h3>
              <p className={"regular-l"}>
                {
                  "Developing and promoting modern standards in occupational safety, risk management and sustainable development."
                }
              </p>
            </div>
            <div className={"block is--radius-6 is--spacing-32-32--m-24-32 is--border-light-blue"}>
              <h3 className={"h3 is--margin-bottom-12"}>{"Quality learning"}</h3>
              <p className={"regular-l"}>
                {
                  "Trainings, webinars, practical programmes and experience exchange from experts with international practice."
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
                <h2 className={"h2 is--margin-bottom-24"}>{"ESOSH for Ukraine"}</h2>
                <div className={"text-spacing-wrapper"}>
                  <p className={"regular-l is--margin-bottom-16"}>
                    {
                      "ESOSH helps Ukrainian specialists integrate into the international professional space, develop competencies and implement modern approaches to occupational safety."
                    }
                  </p>
                  <p className={"regular-l"}>
                    {
                      "We believe that Ukraine’s safe recovery starts with people who have knowledge, experience and a shared responsibility for the future."
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className={"wrapper is--grid-text-spacing"}>
              <div className={"wrapper is--max-width-584"}>
                <h2 className={"h2 is--margin-bottom-24"}>{"Facts about ESOSH"}</h2>
                <div className={"bullet-list"}>
                  <Bullet>
                    {
                      "ESOSH was founded in 2018 by Ukrainian occupational safety specialists."
                    }
                  </Bullet>
                  <Bullet>{"Since 2022, ESOSH has been a member of ENSHPO."}</Bullet>
                  <Bullet>
                    {
                      "In 2022–2023, ESOSH delivered International Labour Organization (ILO) projects in Ukraine."
                    }
                  </Bullet>
                  <Bullet>
                    {
                      "Four professional qualification levels, more than 300 certified specialists and over 3,000 associate members from 14 countries."
                    }
                  </Bullet>
                  <Bullet>
                    {
                      "Over 30 unique occupational safety trainings and programmes, plus proprietary audit methodologies."
                    }
                  </Bullet>
                  <Bullet>{"15 industry working groups."}</Bullet>
                  <Bullet>
                    {
                      "Builds a system of occupational safety standards that complement legal requirements and follow leading international practices."
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
            <h2 className={"h2 is--margin-bottom-16"}>{"ESOSH is a founder of"}</h2>
            <p className={"regular-l"}>
              {
                "The community initiates and supports projects that strengthen occupational safety in Ukraine and ties with international partners."
              }
            </p>
          </div>
          <div className={"bullet-list"}>
            <Bullet>
              {
                "Help Alliance for Ukrainian Workers (HelpUAWorkers) — together with VDSI (Germany);"
              }
            </Bullet>
            <Bullet>
              {
                "HSE Speaking Club (HSE-SC) — together with the Occupational Health and Safety magazine;"
              }
            </Bullet>
            <Bullet>
              {
                "SafePlatform — a platform for social dialogue and reforms in occupational safety;"
              }
            </Bullet>
            <Bullet>
              {
                "UkrAPB — the Association of PPE manufacturers and suppliers;"
              }
            </Bullet>
            <Bullet>
              {"an occupational safety learning hub in cooperation with 8 universities;"}
            </Bullet>
            <Bullet>{'the sports movement “Movement for Safe Work”.'}</Bullet>
          </div>
        </div>
      </section>

      <LeadershipSection locale="en" />

      <section className={"section is--margin-top-144--t-128--m-104"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <div className={"wrapper is--max-width-537 is--margin-bottom-40"}>
            <h2 className={"h2 is--margin-bottom-16"}>{"Recommendations"}</h2>
            <p className={"regular-l"}>
              {
                "Our reliable and professional partners, with whom we recommend working as a professional association for occupational safety."
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
                    "Help Alliance for Ukrainian workers — collecting protective equipment abroad and transferring it to Ukraine, as well as expertise on health and safety in war conditions, starting in 2022"
                  }
                </p>
              </div>
              <div className={"btn is--tertiary is--no-link"}>
                <div className={"wrapper is--h-flex-center-left is--gap-4-columns"}>
                  <div className={"bold-m"}>{"Learn more"}</div>
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
                    "Ramose LLC has been organizing training in Ukraine for NEBOSH IGC, NEBOSH Oil & Gas, IOSH “Managing Safely”, courses on HAZOP, HAZID risk assessment methods, etc. since 2018."
                  }
                </p>
              </div>
              <div className={"btn is--tertiary is--no-link"}>
                <div className={"wrapper is--h-flex-center-left is--gap-4-columns"}>
                  <div className={"bold-m"}>{"Learn more"}</div>
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
                  {
                    "Löwen Defence — international services in the field of business and life protection (Germany)."
                  }
                </p>
              </div>
              <div className={"btn is--tertiary is--no-link"}>
                <div className={"wrapper is--h-flex-center-left is--gap-4-columns"}>
                  <div className={"bold-m"}>{"Learn more"}</div>
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
                    "Editorial office of the “Occupational Health and Safety” magazine — organization of conferences and webinars together with ESOSH since 2018"
                  }
                </p>
              </div>
              <div className={"btn is--tertiary is--no-link"}>
                <div className={"wrapper is--h-flex-center-left is--gap-4-columns"}>
                  <div className={"bold-m"}>{"Learn more"}</div>
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
                    "INSIGHT. UA is a Ukrainian manufacturer and supplier of workwear, work footwear and PPE. INSIGHT and Free Work brands — successfully passed a sustainability audit and is recommended by ESOSH as a reliable partner"
                  }
                </p>
              </div>
              <div className={"btn is--tertiary is--no-link"}>
                <div className={"wrapper is--h-flex-center-left is--gap-4-columns"}>
                  <div className={"bold-m"}>{"Learn more"}</div>
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
                <h2 className={"h2 is--margin-bottom-24 is--max-width-440"}>{"Impressum"}</h2>
                <div className={"text-spacing-wrapper"}>
                  <p className={"regular-l"}>
                    {
                      "The European Society of Occupational Safety&Health, ESOSH. Register number 42755196"
                    }
                  </p>
                  <div className={"wrapper is--w-100p"}>
                    <div className={"wrapper is--margin-bottom-24"}>
                      <div className={"bold-l is--margin-bottom-12"}>{"Address"}</div>
                      <p>{"Kyiv, Ukraine, 04107, Tatarska str. 21, office A.."}</p>
                    </div>
                    <div className={"wrapper is--margin-bottom-24"}>
                      <div className={"bold-l is--margin-bottom-12"}>{"Post"}</div>
                      <p>{"Kyiv, Ukraine, 02081, PO Box 23, office@esosh.net"}</p>
                    </div>
                    <div className={"wrapper"}>
                      <div className={"bold-l is--margin-bottom-12"}>{"Contacts"}</div>
                      <p>{"+38 (050) 44-19-936 Olha Bohdanova"}</p>
                    </div>
                  </div>
                  <LocaleDocLink docId="offer" locale="en" className={"btn is--primary w-button"}>
                    {"The Public Offer Agreement"}
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
              {"Participation in ESOSH for enterprises"}
            </h2>
            <a href={"/en/join/enrollment"} className={"btn is--secondary is--white-btn w-button"}>
              {"Learn more"}
            </a>
          </div>
        </div>
        <div className={"big-banner-wrapper is--participation"}>
          <div className={"wrapper is--max-width-320 is--w-100p is--v-flex-center-center"}>
            <h2 className={"h2 is--white is--center is--margin-bottom-24"}>
              {"Joining ESOSH for professionals"}
            </h2>
            <a href={"/en/join/participation"} className={"btn is--secondary is--white-btn w-button"}>
              {"Learn more"}
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
