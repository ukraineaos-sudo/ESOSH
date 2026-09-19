import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { routing } from "@/i18n/routing";
import { BinotelWidgets } from "@/components/BinotelWidgets";
import "@/styles/reference.css";
import "@/styles/navigation.css";
import "@/styles/contact.css";
import "@/styles/refinements.css";
import "../globals.css";

/** RU: Список языков для сборки. EN: Pre-render supported locales. */
export function generateStaticParams() { return routing.locales.map((locale) => ({ locale })); }

/** RU: Языковая оболочка сайта. EN: Locale document and translation provider. */
export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  return <html lang={locale}><body><NextIntlClientProvider messages={{ nav: messages.nav, contact: messages.contact }}>{children}</NextIntlClientProvider><BinotelWidgets /></body></html>;
}
