import { AdminShell } from "@/components/admin/AdminShell";
import { getDb } from "@/db";
import { members } from "@/db/schema";
import { LEVEL_LABELS_UK, memberStatusLabelUk, type LevelCode } from "@/lib/enrollment/levels";
import { desc } from "drizzle-orm";

/** RU: Реєстр учасників. EN: Members registry. */
export default async function AdminMembersPage() {
  let items: (typeof members.$inferSelect)[] = [];
  const db = getDb();
  if (db) {
    try {
      items = await db.select().from(members).orderBy(desc(members.createdAt)).limit(100);
    } catch {
      items = [];
    }
  }

  return (
    <AdminShell title="Члени" pathname="/admin/members">
      <div className="admin-panel admin-stack">
        <p className="admin-muted">
          Картки учасників: публічний код, основна та додаткова електронна скринька. Створюються автоматично з
          форми вступу.
        </p>
        {items.length === 0 ? (
          <p className="admin-muted">Поки немає записів.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>№</th>
                <th>Публічний код</th>
                <th>ПІБ</th>
                <th>Основна скринька</th>
                <th>Додаткова скринька</th>
                <th>Статус</th>
                <th>Рівень</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.publicId}</td>
                  <td>
                    {item.lastName} {item.firstName}
                  </td>
                  <td>{item.primaryEmail}</td>
                  <td>{item.secondaryEmail || "—"}</td>
                  <td>
                    <span className="admin-badge">{memberStatusLabelUk(item.status)}</span>
                  </td>
                  <td>
                    {item.level
                      ? LEVEL_LABELS_UK[item.level as LevelCode] || item.level
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
}
