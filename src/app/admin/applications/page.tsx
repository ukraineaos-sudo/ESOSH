import { AdminShell } from "@/components/admin/AdminShell";
import { getDb } from "@/db";
import { applications } from "@/db/schema";
import { desc } from "drizzle-orm";

/** RU: Заглушка заявок (этап E). EN: Applications stub room. */
export default async function AdminApplicationsPage() {
  let items: (typeof applications.$inferSelect)[] = [];
  const db = getDb();
  if (db) {
    try {
      items = await db.select().from(applications).orderBy(desc(applications.createdAt)).limit(100);
    } catch {
      items = [];
    }
  }

  return (
    <AdminShell title="Заявки" pathname="/admin/applications">
      <div className="admin-panel admin-stack">
        <p className="admin-muted">
          Реєстр заявок на вступ підготовлено в схемі БД. Публічна форма вступу за ТЗ — наступний етап після
          працюючого пульта.
        </p>
        {items.length === 0 ? (
          <p className="admin-muted">Поки немає заявок.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Public ID</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.publicId}</td>
                  <td>
                    <span className="admin-badge">{item.status}</span>
                  </td>
                  <td>{item.createdAt?.toISOString?.() || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
}
