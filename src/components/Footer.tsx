import { getLocale } from "next-intl/server";
import UkrainianFooter from "@/content/chrome/footer-uk";
import EnglishFooter from "@/content/chrome/footer-en";
import { getContactSettings } from "@/lib/site-settings";

/** RU: Выбирает подвал по языку. EN: Render the localized footer. */
export async function Footer() {
  const contacts = await getContactSettings();
  return (await getLocale()) === "en" ? (
    <EnglishFooter contacts={contacts} />
  ) : (
    <UkrainianFooter contacts={contacts} />
  );
}
