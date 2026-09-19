import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { getDb } from "@/db";

/** RU: Дашборд пульта. EN: Admin dashboard rooms. */
export default async function AdminHomePage() {
  const dbReady = Boolean(getDb());
  return (
    <AdminShell title="Пульт управління" pathname="/admin">
      {!dbReady ? <p className="admin-error">DATABASE_URL не задано — підключіть Neon Postgres.</p> : null}
      <p className="admin-muted" style={{ marginBottom: 20 }}>
        Єдиний кабінет замість Webflow: контент, новини, контакти, заявки.
      </p>
      <div className="admin-card-grid">
        <Link className="admin-card" href="/admin/content/news"><h2>Новини</h2><p>Створення та редагування статей uk/en з попереднім переглядом.</p></Link>
        <Link className="admin-card" href="/admin/content/pages"><h2>Сторінки</h2><p>Блочний редактор маршрутів сайту з publish/draft.</p></Link>
        <Link className="admin-card" href="/admin/media"><h2>Медіа</h2><p>Завантаження зображень у Vercel Blob.</p></Link>
        <Link className="admin-card" href="/admin/settings/contacts"><h2>Контакти</h2><p>Телефони, email, соцмережі, адреса.</p></Link>
        <Link className="admin-card" href="/admin/applications"><h2>Заявки</h2><p>Реєстр заявок на вступ (підготовка під форму).</p></Link>
        <Link className="admin-card" href="/admin/members"><h2>Члени</h2><p>Картки учасників з ID та двома email.</p></Link>
      </div>
    </AdminShell>
  );
}
