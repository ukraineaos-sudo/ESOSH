import { AdminShell } from "@/components/admin/AdminShell";
import { UsersManager } from "@/components/admin/UsersManager";
import { getDb } from "@/db";
import { adminUsers } from "@/db/schema";
import { getAdminSession, requireAdmin } from "@/lib/admin/auth";
import { redirect } from "next/navigation";

/** RU: Комната пользователей. EN: Users room. */
export default async function AdminUsersPage() {
  const user = await getAdminSession();
  if (!user || !requireAdmin(user)) redirect("/admin");

  const db = getDb();
  let initialItems: { id: number; username: string; email: string | null; role: string; active: boolean }[] = [];
  if (db) {
    try {
      initialItems = await db
        .select({
          id: adminUsers.id,
          username: adminUsers.username,
          email: adminUsers.email,
          role: adminUsers.role,
          active: adminUsers.active,
        })
        .from(adminUsers);
    } catch {
      initialItems = [];
    }
  }

  return (
    <AdminShell title="Користувачі" pathname="/admin/users">
      <UsersManager initialItems={initialItems} />
    </AdminShell>
  );
}
