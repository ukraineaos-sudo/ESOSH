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
    publishedAt: Date | null;
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
        publishedAt: row.publishedAt,
      }));
    } catch {
      initialItems = [];
    }
  }

  return (
    <AdminShell title="Новини" pathname="/admin/content/news">
      <p className="admin-muted" style={{ marginBottom: 16 }}>
        Єдиний список усіх новин сайту (українською та англійською). Опубліковані зʼявляються на
        /news і на головній (нові зверху). Приховані лишаються тут як чернетки — їх можна знову
        вивести на сайт або видалити.
      </p>
      <NewsManager initialItems={initialItems} />
    </AdminShell>
  );
}
