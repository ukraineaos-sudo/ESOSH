import { AdminShell } from "@/components/admin/AdminShell";
import { NewsManager } from "@/components/admin/NewsManager";
import { getDb } from "@/db";
import { newsPosts } from "@/db/schema";
import type { CmsBlock } from "@/lib/cms/blocks";
import { desc } from "drizzle-orm";

/** RU: Комната новостей. EN: News room. */
export default async function AdminNewsPage() {
  const db = getDb();
  let initialItems: {
    id: number;
    locale: string;
    slug: string;
    title: string;
    excerpt: string;
    coverUrl: string | null;
    body: CmsBlock[];
    status: string;
  }[] = [];
  if (db) {
    try {
      const rows = await db.select().from(newsPosts).orderBy(desc(newsPosts.updatedAt)).limit(500);
      initialItems = rows.map((row) => ({
        id: row.id,
        locale: row.locale,
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        coverUrl: row.coverUrl,
        body: Array.isArray(row.body) ? (row.body as CmsBlock[]) : [],
        status: row.status,
      }));
    } catch {
      initialItems = [];
    }
  }

  return (
    <AdminShell title="Новини" pathname="/admin/content/news">
      <NewsManager initialItems={initialItems} />
    </AdminShell>
  );
}
