import { AdminSecurityForm } from "@/components/admin/AdminSecurityForm";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminSession } from "@/lib/admin/auth";
import { redirect } from "next/navigation";

/** RU: Кімната безпеки / зміна пароля. EN: Security room (change password). */
export default async function AdminSecurityPage() {
  const user = await getAdminSession();
  if (!user) redirect("/admin/login");

  return (
    <AdminShell title="Безпека" pathname="/admin/security">
      <AdminSecurityForm mustChangePassword={user.mustChangePassword} />
    </AdminShell>
  );
}
