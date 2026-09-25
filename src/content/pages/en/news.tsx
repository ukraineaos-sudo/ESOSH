/* Public ESOSH content — news listing from CMS (news_posts). */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CmsNewsListItems } from "@/components/cms/CmsNewsListItems";

/** RU: Содержимое страницы. EN: Static page content. */
export default function PageContent() {
  return (
    <>
      <section className={"section is--height-100vh--a-auto is--internal-hero"}>
        <Header />
        <div className={"wrapper is--accent-light-bg is--position-relative is--grow"}>
          <div className={"wrapper is--hero-internal-layout"}>
            <div id={"w-node-_94f251aa-f7e3-3250-4c48-de71405068e9-3c5e4f22"} className={"wrapper is--hero-internal-text"}>
              <div className={"w-layout-blockcontainer container is--w-100p w-container"}>
                <div className={"wrapper is--hero-internal-text-wrapper"}>
                  <div className={"wrapper is--max-width-600"}>
                    <h1 className={"h1"}>
                      {"Current "}
                      <span className={"is--accent"}>
                        {"events and news"}
                      </span>
                      {" in the field of health and safety"}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <div className={"hero-internal-image is--news"}>
            </div>
          </div>
        </div>
      </section>
      <section className={"section is--margin-top-144--t-128--m-104 is--margin-bottom-144--t-128--m-104"}>
        <div className={"w-layout-blockcontainer container w-container"}>
          <h2 className={"h2 is--margin-bottom-40"}>
            {"News on health and safety "}
          </h2>
          <div className={"collection-list-wrapper w-dyn-list"}>
            <div role={"list"} className={"collection-list is--grid-3-columns--t-2--m-1 w-dyn-items"}>
              <CmsNewsListItems locale="en" showEmpty />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
