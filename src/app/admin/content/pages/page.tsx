import { redirect } from "next/navigation";

/**
 * RU: Кімната CMS-сторінок вимкнена (Phase D).
 * EN: CMS pages room disabled (Phase D).
 *
 * Чому / критерії увімкнення: `docs/PAGES_CMS.md`.
 * Код редактора збережено нижче в коментарі + `PagesManager`.
 */
export default function AdminPagesPage() {
  redirect("/admin");
}

/*
import { AdminShell } from "@/components/admin/AdminShell";
import { PagesManager } from "@/components/admin/PagesManager";
import { getDb } from "@/db";
import { pages } from "@/db/schema";
import { listCatalogRoutes } from "@/lib/cms/catalog";
import type { CmsBlock } from "@/lib/cms/blocks";
import { desc } from "drizzle-orm";

export default async function AdminPagesPageEnabled() {
  const catalog = listCatalogRoutes();
  const db = getDb();
  let initialItems: {
    id: number;
    locale: string;
    route: string;
    title: string;
    status: string;
    blocks: CmsBlock[];
  }[] = [];
  if (db) {
    try {
      const rows = await db.select().from(pages).orderBy(desc(pages.updatedAt)).limit(500);
      initialItems = rows.map((row) => ({
        id: row.id,
        locale: row.locale,
        route: row.route,
        title: row.title,
        status: row.status,
        blocks: Array.isArray(row.blocks) ? (row.blocks as CmsBlock[]) : [],
      }));
    } catch {
      initialItems = [];
    }
  }

  return (
    <AdminShell title="Сторінки" pathname="/admin/content/pages">
      <p className="admin-muted" style={{ marginBottom: 16 }}>
        Опублікована версія з кабінету замінює статичну сторінку на сайті. Чернетка видима лише в
        попередньому перегляді.
      </p>
      <PagesManager catalog={catalog} initialItems={initialItems} />
    </AdminShell>
  );
}
*/
