import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { getAdminSession } from "@/lib/admin/auth";
import { getDb } from "@/db";

/** RU: Страница входа. EN: Admin login page. */
export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin");
  const dbReady = Boolean(getDb());
  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <h1>ESOSH Admin</h1>
        <p className="admin-muted">Кабінет управління сайтом</p>
        {!dbReady ? <p className="admin-error">Додайте DATABASE_URL у .env для роботи адмінки.</p> : null}
        <Suspense fallback={<p className="admin-muted">Завантаження…</p>}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
