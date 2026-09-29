import type { AppLocale } from "@/i18n/routing";
import { localizedPath } from "@/lib/locale";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getTranslations } from "next-intl/server";

type Props = {
  locale: AppLocale;
  route: string;
};

/**
 * RU: Честный placeholder, если тела страницы для локали ещё нет.
 * EN: Honest placeholder when page body is not translated yet (no silent reuse of another language).
 */
export async function ContentTranslationPending({ locale, route }: Props) {
  const t = await getTranslations("content");
  const home = localizedPath(locale, "/");
  const ukPath = localizedPath("uk", route);
  const enPath = localizedPath("en", route);
  return (
    <>
      <Header />
      <main className="container w-container site-content-pending">
        <h1 className="h1">{t("pendingTitle")}</h1>
        <p className="regular-l">{t("pendingBody")}</p>
        <div className="wrapper is--h-flex-start-start is--rows-gap-12" style={{ gap: 12, flexWrap: "wrap" }}>
          <a className="btn is--primary w-button" href={home}>
            {t("pendingCtaHome")}
          </a>
          <a className="btn w-button" href={ukPath}>
            {t("pendingCtaUk")}
          </a>
          <a className="btn w-button" href={enPath}>
            {t("pendingCtaEn")}
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
