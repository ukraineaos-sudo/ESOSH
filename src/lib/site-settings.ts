import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { siteSettings } from "@/db/schema";
import { SITE } from "@/lib/site";

export type ContactSettings = {
  email: string;
  phones: { display: string; href: string }[];
  social: {
    facebook: string;
    linkedin: string;
    youtube: string;
    telegram: string;
    instagram: string;
  };
  addressUk: string;
  addressEn: string;
  knowledgeBaseDrive: string;
};

const CONTACTS_KEY = "contacts";

/** RU: Контакты по умолчанию из кода. EN: Default contact settings from code constants. */
export function defaultContactSettings(): ContactSettings {
  return {
    email: SITE.email,
    phones: SITE.phones.map((p) => ({ display: p.display, href: p.href })),
    social: { ...SITE.social },
    addressUk: "Київ, Україна, 02081, а/с 23",
    addressEn: "Kyiv, Ukraine, 02081, PO Box 23",
    knowledgeBaseDrive: SITE.knowledgeBaseDrive,
  };
}

/** RU: Читает контакты из БД или fallback. EN: Load contacts from DB with code fallback. */
export async function getContactSettings(): Promise<ContactSettings> {
  const db = getDb();
  if (!db) return defaultContactSettings();
  try {
    const rows = await db.select().from(siteSettings).where(eq(siteSettings.key, CONTACTS_KEY)).limit(1);
    const value = rows[0]?.value;
    if (!value || typeof value !== "object") return defaultContactSettings();
    return { ...defaultContactSettings(), ...(value as ContactSettings) };
  } catch {
    return defaultContactSettings();
  }
}

/** RU: Сохраняет контакты. EN: Persist contact settings. */
export async function saveContactSettings(next: ContactSettings): Promise<"ok" | "unavailable"> {
  const db = getDb();
  if (!db) return "unavailable";
  const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, CONTACTS_KEY)).limit(1);
  if (existing[0]) {
    await db.update(siteSettings).set({ value: next, updatedAt: new Date() }).where(eq(siteSettings.key, CONTACTS_KEY));
  } else {
    await db.insert(siteSettings).values({ key: CONTACTS_KEY, value: next });
  }
  return "ok";
}
