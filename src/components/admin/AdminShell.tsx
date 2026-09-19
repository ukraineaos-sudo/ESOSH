import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getAdminSession } from "@/lib/admin/auth";

const rooms = [
  { href: "/admin", label: "Пульт", group: "main" },
  { href: "/admin/content/news", label: "Новини", group: "content" },
  { href: "/admin/content/pages", label: "Сторінки", group: "content" },
  { href: "/admin/media", label: "Медіа", group: "content" },
  { href: "/admin/settings/contacts", label: "Контакти сайту", group: "settings" },
  { href: "/admin/applications", label: "Заявки", group: "crm" },
  { href: "/admin/members", label: "Члени", group: "crm" },
  { href: "/admin/users", label: "Користувачі", group: "settings" },
] as const;

/** RU: Сайдбар пульта для авторизованных страниц. EN: Authenticated admin shell. */
export async function AdminShell({ children, title, pathname }: { children: ReactNode; title: string; pathname: string }) {
  const user = await getAdminSession();
  if (!user) redirect("/admin/login");
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">ESOSH <span>кабінет</span></div>
        <nav className="admin-nav" aria-label="Навігація кабінету">
          <div className="admin-nav-label">Пульт</div>
          {rooms.filter((r) => r.group === "main").map((room) => (
            <Link key={room.href} href={room.href} aria-current={pathname === room.href ? "page" : undefined}>{room.label}</Link>
          ))}
          <div className="admin-nav-label">Контент</div>
          {rooms.filter((r) => r.group === "content").map((room) => (
            <Link key={room.href} href={room.href} aria-current={pathname.startsWith(room.href) ? "page" : undefined}>{room.label}</Link>
          ))}
          <div className="admin-nav-label">Реєстри</div>
          {rooms.filter((r) => r.group === "crm").map((room) => (
            <Link key={room.href} href={room.href} aria-current={pathname.startsWith(room.href) ? "page" : undefined}>{room.label}</Link>
          ))}
          <div className="admin-nav-label">Система</div>
          {rooms.filter((r) => r.group === "settings").map((room) => (
            <Link key={room.href} href={room.href} aria-current={pathname.startsWith(room.href) ? "page" : undefined}>{room.label}</Link>
          ))}
        </nav>
        <form action="/api/admin/logout" method="post" style={{ marginTop: "auto" }}>
          <button className="admin-btn admin-btn-secondary" type="submit" style={{ width: "100%" }}>Вийти ({user.email})</button>
        </form>
      </aside>
      <main className="admin-main">
        <div className="admin-topbar">
          <h1>{title}</h1>
          <span className="admin-badge">{user.role}</span>
        </div>
        {children}
      </main>
    </div>
  );
}
