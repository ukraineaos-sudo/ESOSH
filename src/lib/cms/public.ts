import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { newsPosts, pages } from "@/db/schema";
import type { CmsBlock } from "@/lib/cms/blocks";
import { getAdminSession } from "@/lib/admin/auth";
import { localizedPath } from "@/lib/locale";
import { routing } from "@/i18n/routing";

/**
 * RU: Публічний контент новин завжди українською (UI-локаль окремо).
 * EN: Public news body/list always Ukrainian; UI locale stays separate.
 */
export const NEWS_CONTENT_LOCALE = "uk" as const;

export type CmsPageDoc = {
  id: number;
  locale: string;
  route: string;
  title: string;
  status: string;
  blocks: CmsBlock[];
};

export type CmsNewsDoc = {
  id: number;
  locale: string;
  slug: string;
  title: string;
  excerpt: string;
  coverUrl: string | null;
  body: CmsBlock[];
  status: string;
  publishedAt: Date | null;
};

function asBlocks(value: unknown): CmsBlock[] {
  return Array.isArray(value) ? (value as CmsBlock[]) : [];
}

/** RU: CMS-страница (published или preview для админа). EN: CMS page for public/preview. */
export async function getCmsPage(
  locale: string,
  route: string,
  opts?: { preview?: boolean },
): Promise<CmsPageDoc | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const rows = await db
      .select()
      .from(pages)
      .where(and(eq(pages.locale, locale), eq(pages.route, route)))
      .limit(1);
    const row = rows[0];
    if (!row) return null;
    if (row.status !== "published") {
      if (!opts?.preview) return null;
      const user = await getAdminSession();
      if (!user) return null;
    }
    return {
      id: row.id,
      locale: row.locale,
      route: row.route,
      title: row.title,
      status: row.status,
      blocks: asBlocks(row.blocks),
    };
  } catch {
    return null;
  }
}

/** RU: Опубликованная новость CMS. EN: Published CMS news post. */
export async function getCmsNews(
  locale: string,
  slug: string,
  opts?: { preview?: boolean },
): Promise<CmsNewsDoc | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const rows = await db
      .select()
      .from(newsPosts)
      .where(and(eq(newsPosts.locale, locale), eq(newsPosts.slug, slug)))
      .limit(1);
    const row = rows[0];
    if (!row) return null;
    if (row.status === "deleted") {
      if (!opts?.preview) return null;
      const user = await getAdminSession();
      if (!user) return null;
    } else if (row.status !== "published") {
      if (!opts?.preview) return null;
      const user = await getAdminSession();
      if (!user) return null;
    }
    return {
      id: row.id,
      locale: row.locale,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      coverUrl: row.coverUrl,
      body: asBlocks(row.body),
      status: row.status,
      publishedAt: row.publishedAt,
    };
  } catch {
    return null;
  }
}

/**
 * RU: Наявність CMS-ряду для slug (без preview). unpublished/deleted → не fallback на TSX.
 * EN: CMS row presence for slug; unpublished blocks legacy TSX fallback.
 */
export async function getCmsNewsPresence(
  locale: string,
  slug: string,
): Promise<"missing" | "published" | "unpublished"> {
  const db = getDb();
  if (!db) return "missing";
  try {
    const rows = await db
      .select({ status: newsPosts.status })
      .from(newsPosts)
      .where(and(eq(newsPosts.locale, locale), eq(newsPosts.slug, slug)))
      .limit(1);
    const row = rows[0];
    if (!row) return "missing";
    if (row.status === "published") return "published";
    return "unpublished";
  } catch {
    return "missing";
  }
}

/**
 * RU: Список опублікованих CMS-новин для публічної стрічки (завжди `uk`).
 * EN: Public news feed always reads published Ukrainian CMS rows.
 * `_uiLocale` is ignored for content (kept for call-site compatibility).
 */
export async function listPublishedCmsNews(
  _uiLocale?: string,
  opts?: { limit?: number },
): Promise<CmsNewsDoc[]> {
  const db = getDb();
  if (!db) return [];
  const limit = Math.min(Math.max(opts?.limit ?? 100, 1), 500);
  try {
    const rows = await db
      .select()
      .from(newsPosts)
      .where(
        and(
          eq(newsPosts.locale, NEWS_CONTENT_LOCALE),
          eq(newsPosts.status, "published"),
        ),
      )
      .orderBy(desc(newsPosts.publishedAt), desc(newsPosts.id))
      .limit(limit);
    return rows.map((row) => ({
      id: row.id,
      locale: row.locale,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      coverUrl: row.coverUrl,
      body: asBlocks(row.body),
      status: row.status,
      publishedAt: row.publishedAt,
    }));
  } catch {
    return [];
  }
}

/**
 * RU: Публічні URL опублікованих uk-новин у всіх UI-локалях (sitemap).
 * EN: Sitemap paths for Ukrainian news under every UI locale prefix.
 */
export async function listPublishedCmsNewsPaths(): Promise<string[]> {
  const db = getDb();
  if (!db) return [];
  try {
    const rows = await db
      .select({ slug: newsPosts.slug })
      .from(newsPosts)
      .where(
        and(
          eq(newsPosts.locale, NEWS_CONTENT_LOCALE),
          eq(newsPosts.status, "published"),
        ),
      )
      .limit(500);
    const paths: string[] = [];
    for (const row of rows) {
      for (const locale of routing.locales) {
        paths.push(localizedPath(locale, `/news/${row.slug}`));
      }
    }
    return paths;
  } catch {
    return [];
  }
}
