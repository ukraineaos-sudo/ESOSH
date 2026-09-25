import { AdminShell } from "@/components/admin/AdminShell";
import { LeadershipManager } from "@/components/admin/LeadershipManager";
import { getDb } from "@/db";
import { leadershipPeople } from "@/db/schema";
import { asc } from "drizzle-orm";

/** RU: Кімната керівного складу. EN: Leadership room. */
export default async function AdminLeadershipPage() {
  const db = getDb();
  let initialItems: {
    id: number;
    sortOrder: number;
    photoUrl: string;
    photoClass: string;
    nameUk: string;
    nameEn: string;
    roleUk: string;
    roleEn: string;
    status: string;
  }[] = [];
  if (db) {
    try {
      const rows = await db
        .select()
        .from(leadershipPeople)
        .orderBy(asc(leadershipPeople.sortOrder), asc(leadershipPeople.id));
      initialItems = rows.map((row) => ({
        id: row.id,
        sortOrder: row.sortOrder,
        photoUrl: row.photoUrl || "",
        photoClass: row.photoClass || "",
        nameUk: row.nameUk,
        nameEn: row.nameEn,
        roleUk: row.roleUk,
        roleEn: row.roleEn,
        status: row.status,
      }));
    } catch {
      initialItems = [];
    }
  }

  return (
    <AdminShell title="Керівний склад" pathname="/admin/content/leadership">
      <p className="admin-muted" style={{ marginBottom: 16 }}>
        Картки людей на сторінці «Про ESOSH» (українською та англійською). Порядок у списку = порядок на
        сайті. Фото — з бібліотеки «Медіа».
      </p>
      <LeadershipManager initialItems={initialItems} />
    </AdminShell>
  );
}
