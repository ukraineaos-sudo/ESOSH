import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { getDb } from "@/db";
import { siteSettings } from "@/db/schema";
import { DbUnavailableError, isDbUnavailable } from "@/lib/cache/db-unavailable";
import { bustTag, CACHE_TAGS } from "@/lib/cache/tags";
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
const CONTACTS_REVALIDATE_SEC = 60 * 60;

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

/** Throws DbUnavailableError on transient Neon failure (not cached). */
async function loadContactSettingsFromDb(): Promise<ContactSettings> {
  const db = getDb();
  if (!db) return defaultContactSettings();
  try {
    const rows = await db.select().from(siteSettings).where(eq(siteSettings.key, CONTACTS_KEY)).limit(1);
    const value = rows[0]?.value;
    if (!value || typeof value !== "object") return defaultContactSettings();
    return { ...defaultContactSettings(), ...(value as ContactSettings) };
  } catch (err) {
    throw new DbUnavailableError(err);
  }
}

const getContactSettingsCached = unstable_cache(
  async () => loadContactSettingsFromDb(),
  ["site-contacts-v1"],
  { revalidate: CONTACTS_REVALIDATE_SEC, tags: [CACHE_TAGS.siteContacts] },
);

/** RU: Читает контакты из БД или fallback (кэш; збої Neon не кешуються). */
export async function getContactSettings(): Promise<ContactSettings> {
  try {
    return await getContactSettingsCached();
  } catch (err) {
    if (isDbUnavailable(err)) return defaultContactSettings();
    throw err;
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
  bustTag(CACHE_TAGS.siteContacts);
  return "ok";
}
