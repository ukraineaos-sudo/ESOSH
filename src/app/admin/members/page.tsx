import { count, desc, inArray } from "drizzle-orm";
import { AdminShell } from "@/components/admin/AdminShell";
import { MembersAdminClient, type MemberListItem } from "@/components/admin/MembersAdminClient";
import { getDb } from "@/db";
import { applications, members } from "@/db/schema";

/** RU: Реєстр учасників. EN: Members registry. */
export default async function AdminMembersPage() {
  let items: MemberListItem[] = [];
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(members).orderBy(desc(members.createdAt)).limit(100);
      const ids = rows.map((row) => row.id);
      const linkedMap = new Map<number, number>();
      if (ids.length > 0) {
        const linkedRows = await db
          .select({
            memberId: applications.memberId,
            value: count(),
          })
          .from(applications)
          .where(inArray(applications.memberId, ids))
          .groupBy(applications.memberId);
        for (const row of linkedRows) {
          if (row.memberId != null) linkedMap.set(row.memberId, Number(row.value));
        }
      }
      items = rows.map((row) => ({
        id: row.id,
        publicId: row.publicId,
        firstName: row.firstName,
        lastName: row.lastName,
        primaryEmail: row.primaryEmail,
        secondaryEmail: row.secondaryEmail,
        status: row.status,
        level: row.level,
        linkedApplications: linkedMap.get(row.id) ?? 0,
      }));
    } catch {
      items = [];
    }
  }

  return (
    <AdminShell title="Члени" pathname="/admin/members">
      <div className="admin-panel">
        <MembersAdminClient initialItems={items} />
      </div>
    </AdminShell>
  );
}
