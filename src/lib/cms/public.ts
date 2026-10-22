import { and, desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { getDb } from "@/db";
import { newsPosts, pages } from "@/db/schema";
import type { CmsBlock } from "@/lib/cms/blocks";
import {
  parseNewsCoverFormat,
  type NewsCoverFormat,
} from "@/lib/cms/news-cover-format";
import { getAdminSession } from "@/lib/admin/auth";
import { DbUnavailableError, isDbUnavailable } from "@/lib/cache/db-unavailable";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { localizedPath } from "@/lib/locale";
import { routing } from "@/i18n/routing";

/**
 * RU: Публічний контент новин завжди українською (UI-локаль окремо).
 * EN: Public news body/list always Ukrainian; UI locale stays separate.
 */
export const NEWS_CONTENT_LOCALE = "uk" as const;

const CMS_REVALIDATE_SEC = 5 * 60;

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
  coverFormat: NewsCoverFormat;
  body: CmsBlock[];
  status: string;
  publishedAt: Date | null;
};

type CmsNewsCached = Omit<CmsNewsDoc, "publishedAt"> & {
  publishedAt: string | null;
};

function asBlocks(value: unknown): CmsBlock[] {
  return Array.isArray(value) ? (value as CmsBlock[]) : [];
}

function hydrateNews(doc: CmsNewsCached): CmsNewsDoc {
  return {
    ...doc,
    publishedAt: doc.publishedAt ? new Date(doc.publishedAt) : null,
  };
}

function serializeNews(doc: CmsNewsDoc): CmsNewsCached {
  return {
    ...doc,
    publishedAt: doc.publishedAt ? doc.publishedAt.toISOString() : null,
  };
}

async function loadPublishedCmsPage(locale: string, route: string): Promise<CmsPageDoc | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const rows = await db
      .select()
      .from(pages)
      .where(and(eq(pages.locale, locale), eq(pages.route, route), eq(pages.status, "published")))
      .limit(1);
    const row = rows[0];
    if (!row) return null;
    return {
      id: row.id,
      locale: row.locale,
      route: row.route,
      title: row.title,
      status: row.status,
      blocks: asBlocks(row.blocks),
    };
  } catch (err) {
    throw new DbUnavailableError(err);
  }
}

async function loadCmsPageForPreview(locale: string, route: string): Promise<CmsPageDoc | null> {
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

/** RU: CMS-страница (published или preview для админа). EN: CMS page for public/preview. */
export async function getCmsPage(
  locale: string,
  route: string,
  opts?: { preview?: boolean },
): Promise<CmsPageDoc | null> {
  if (opts?.preview) {
    return loadCmsPageForPreview(locale, route);
  }
  try {
    return await unstable_cache(
      async () => loadPublishedCmsPage(locale, route),
      ["cms-page-v1", locale, route],
      { revalidate: CMS_REVALIDATE_SEC, tags: [CACHE_TAGS.cmsPages] },
    )();
  } catch (err) {
    if (isDbUnavailable(err)) return null;
    throw err;
  }
}

async function loadPublishedCmsNews(locale: string, slug: string): Promise<CmsNewsCached | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const rows = await db
      .select()
      .from(newsPosts)
      .where(
        and(
          eq(newsPosts.locale, locale),
          eq(newsPosts.slug, slug),
          eq(newsPosts.status, "published"),
        ),
      )
      .limit(1);
    const row = rows[0];
    if (!row) return null;
    return serializeNews({
      id: row.id,
      locale: row.locale,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      coverUrl: row.coverUrl,
      coverFormat: parseNewsCoverFormat(row.coverFormat),
      body: asBlocks(row.body),
      status: row.status,
      publishedAt: row.publishedAt,
    });
  } catch (err) {
    throw new DbUnavailableError(err);
  }
}

async function loadCmsNewsForPreview(locale: string, slug: string): Promise<CmsNewsDoc | null> {
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
      const user = await getAdminSession();
      if (!user) return null;
    } else if (row.status !== "published") {
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
      coverFormat: parseNewsCoverFormat(row.coverFormat),
      body: asBlocks(row.body),
      status: row.status,
      publishedAt: row.publishedAt,
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
  if (opts?.preview) {
    return loadCmsNewsForPreview(locale, slug);
  }
  try {
    const cached = await unstable_cache(
      async () => loadPublishedCmsNews(locale, slug),
      ["cms-news-v1", locale, slug],
      { revalidate: CMS_REVALIDATE_SEC, tags: [CACHE_TAGS.cmsNews] },
    )();
    return cached ? hydrateNews(cached) : null;
  } catch (err) {
    if (isDbUnavailable(err)) return null;
    throw err;
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
  try {
    return await unstable_cache(
      async () => {
        const db = getDb();
        if (!db) return "missing" as const;
        try {
          const rows = await db
            .select({ status: newsPosts.status })
            .from(newsPosts)
            .where(and(eq(newsPosts.locale, locale), eq(newsPosts.slug, slug)))
            .limit(1);
          const row = rows[0];
          if (!row) return "missing" as const;
          if (row.status === "published") return "published" as const;
          return "unpublished" as const;
        } catch (err) {
          throw new DbUnavailableError(err);
        }
      },
      ["cms-news-presence-v1", locale, slug],
      { revalidate: CMS_REVALIDATE_SEC, tags: [CACHE_TAGS.cmsNews] },
    )();
  } catch (err) {
    if (isDbUnavailable(err)) return "missing";
    throw err;
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
  const limit = Math.min(Math.max(opts?.limit ?? 100, 1), 500);
  try {
    const cached = await unstable_cache(
      async () => {
        const db = getDb();
        if (!db) return [] as CmsNewsCached[];
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
          return rows.map((row) =>
            serializeNews({
              id: row.id,
              locale: row.locale,
              slug: row.slug,
              title: row.title,
              excerpt: row.excerpt,
              coverUrl: row.coverUrl,
              coverFormat: parseNewsCoverFormat(row.coverFormat),
              body: asBlocks(row.body),
              status: row.status,
              publishedAt: row.publishedAt,
            }),
          );
        } catch (err) {
          throw new DbUnavailableError(err);
        }
      },
      ["cms-news-list-v1", String(limit)],
      { revalidate: CMS_REVALIDATE_SEC, tags: [CACHE_TAGS.cmsNews] },
    )();
    return cached.map(hydrateNews);
  } catch (err) {
    if (isDbUnavailable(err)) return [];
    throw err;
  }
}

/**
 * RU: Публічні URL опублікованих uk-новин у всіх UI-локалях (sitemap).
 * EN: Sitemap paths for Ukrainian news under every UI locale prefix.
 */
export async function listPublishedCmsNewsPaths(): Promise<string[]> {
  try {
    return await unstable_cache(
      async () => {
        const db = getDb();
        if (!db) return [] as string[];
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
        } catch (err) {
          throw new DbUnavailableError(err);
        }
      },
      ["cms-news-paths-v1"],
      { revalidate: CMS_REVALIDATE_SEC, tags: [CACHE_TAGS.cmsNews] },
    )();
  } catch (err) {
    if (isDbUnavailable(err)) return [];
    throw err;
  }
}
