import { getLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
/** RU: Отсутствующая страница. EN: Localized missing page. */
export default async function NotFound() {
  const en = (await getLocale()) === "en";
  return <><Header /><main className="container w-container site-not-found"><h1 className="h1">404</h1><p className="regular-l">{en ? "This page could not be found." : "Цю сторінку не знайдено."}</p><a className="btn is--primary" href={en ? "/en" : "/"}>{en ? "Home" : "На головну"}</a></main><Footer /></>;
}
