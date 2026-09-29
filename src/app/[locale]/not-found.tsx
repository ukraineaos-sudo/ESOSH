import { getLocale, getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { localizedPath } from "@/lib/locale";

/** RU: Отсутствующая страница. EN: Localized missing page. */
export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations("content");
  return (
    <>
      <Header />
      <main className="container w-container site-not-found">
        <h1 className="h1">404</h1>
        <p className="regular-l">{t("notFoundBody")}</p>
        <a className="btn is--primary" href={localizedPath(locale, "/")}>
          {t("notFoundHome")}
        </a>
      </main>
      <Footer />
    </>
  );
}
