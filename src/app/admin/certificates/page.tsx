import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { CertificatesAdminClient } from "@/components/admin/CertificatesAdminClient";
import { canManageRegistry, getAdminSession } from "@/lib/admin/auth";
import {
  listAdminCertificateCourseStats,
  listAdminCertificates,
} from "@/lib/admin/training-certificates";

/** RU: Реєстр сертифікатів тренінгів. EN: Training certificates registry. */
export default async function AdminCertificatesPage() {
  const user = await getAdminSession();
  if (!user || !canManageRegistry(user)) redirect("/admin/login");

  let items: Awaited<ReturnType<typeof listAdminCertificates>> = [];
  let courses: Awaited<ReturnType<typeof listAdminCertificateCourseStats>> = [];
  let loadError: "unavailable" | null = null;

  const [listed, stats] = await Promise.all([
    listAdminCertificates({}),
    listAdminCertificateCourseStats(),
  ]);

  if (!listed || !stats) {
    loadError = "unavailable";
    items = [];
    courses = [];
  } else {
    items = listed;
    courses = stats;
  }

  return (
    <AdminShell title="Сертифікати" pathname="/admin/certificates">
      <div className="admin-panel admin-stack">
        <p className="admin-muted">
          Статистика виданих іменованих сертифікатів: хто, який курс, який бал і номер. Відкликання —
          фізичне видалення запису з підтвердженням «так».
        </p>
        {loadError ? (
          <p className="admin-warn-banner" role="alert">
            Не вдалося завантажити реєстр (БД недоступна або міграція ще не застосована).
          </p>
        ) : (
          <CertificatesAdminClient initialItems={items} initialCourses={courses} />
        )}
      </div>
    </AdminShell>
  );
}
