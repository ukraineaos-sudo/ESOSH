import { AdminShell } from "@/components/admin/AdminShell";
import { getDb } from "@/db";
import { members } from "@/db/schema";
import { desc } from "drizzle-orm";

/** RU: Заглушка членів (этап E). EN: Members stub room. */
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
          Картки учасників (public ID + primary/secondary email) закладені в схему. UI форми вступу з’явиться
          після ТЗ етапу E.
        </p>
        {items.length === 0 ? (
          <p className="admin-muted">Поки немає записів.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Public ID</th>
                <th>Email</th>
                <th>Secondary</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.publicId}</td>
                  <td>{item.primaryEmail}</td>
                  <td>{item.secondaryEmail || "—"}</td>
                  <td>
                    <span className="admin-badge">{item.status}</span>
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
