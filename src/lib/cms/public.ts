import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { newsPosts, pages } from "@/db/schema";
import type { CmsBlock } from "@/lib/cms/blocks";
import { getAdminSession } from "@/lib/admin/auth";

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
    if (row.status !== "published") {
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

/** RU: Список опубликованных CMS-новостей. EN: List published CMS news. */
export async function listPublishedCmsNews(locale: string): Promise<CmsNewsDoc[]> {
  const db = getDb();
  if (!db) return [];
  try {
    const rows = await db
      .select()
      .from(newsPosts)
      .where(and(eq(newsPosts.locale, locale), eq(newsPosts.status, "published")))
      .orderBy(desc(newsPosts.publishedAt))
      .limit(100);
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

/** RU: Пути CMS-новостей для sitemap. EN: CMS news paths for sitemap. */
export async function listPublishedCmsNewsPaths(): Promise<string[]> {
  const db = getDb();
  if (!db) return [];
  try {
    const rows = await db
      .select({ locale: newsPosts.locale, slug: newsPosts.slug })
      .from(newsPosts)
      .where(eq(newsPosts.status, "published"))
      .limit(500);
    return rows.map((row) =>
      row.locale === "en" ? `/en/news/${row.slug}` : `/news/${row.slug}`,
    );
  } catch {
    return [];
  }
}
