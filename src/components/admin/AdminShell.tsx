import Link from "next/link";
import { redirect } from "next/navigation";
import { count, eq } from "drizzle-orm";
import type { ReactNode } from "react";
import { AdminNewAppsBadge } from "@/components/admin/AdminNewAppsBadge";
import { getDb } from "@/db";
import { applications } from "@/db/schema";
import { getAdminSession, isPasswordChangeEnforced, type AdminRole } from "@/lib/admin/auth";

const rooms = [
  { href: "/admin", label: "Огляд", group: "main", icon: "⌂" },
  { href: "/admin/content/news", label: "Новини", group: "content", icon: "✎" },
  { href: "/admin/content/leadership", label: "Керівний склад", group: "content", icon: "◆" },
  // CMS «Сторінки» приховано — див. docs/PAGES_CMS.md (WYSIWYG + імпорт перед увімкненням).
  // { href: "/admin/content/pages", label: "Сторінки", group: "content", icon: "▦" },
  { href: "/admin/media", label: "Медіа", group: "content", icon: "▣" },
  { href: "/admin/applications", label: "Заявки", group: "crm", icon: "✉", badgeKey: "newApps" as const },
  { href: "/admin/members", label: "Члени", group: "crm", icon: "☺" },
  { href: "/admin/settings/contacts", label: "Контакти", group: "settings", icon: "☎" },
  { href: "/admin/security", label: "Безпека", group: "settings", icon: "🔒" },
  { href: "/admin/users", label: "Користувачі", group: "settings", icon: "⚙" },
] as const;

function roleLabelUk(role: AdminRole): string {
  if (role === "admin") return "Адміністратор";
  if (role === "editor") return "Редактор";
  return role;
}

function avatarLetter(username: string): string {
  const ch = username.trim().charAt(0);
  return ch ? ch.toUpperCase() : "?";
}

function NavLink({
  href,
  label,
  icon,
  current,
  badge,
}: {
  href: string;
  label: string;
  icon: string;
  current: boolean;
  badge?: number;
}) {
  const showBadge = typeof badge === "number" && badge > 0;
  return (
    <Link href={href} aria-current={current ? "page" : undefined}>
      <span className="admin-nav-ico" aria-hidden="true">
        {icon}
      </span>
      <span className="admin-nav-text">{label}</span>
      {showBadge ? <span className="admin-nav-badge">{badge}</span> : null}
    </Link>
  );
}

async function loadNewAppsCount(): Promise<number> {
  const db = getDb();
  if (!db) return 0;
  try {
    const [row] = await db
      .select({ value: count() })
      .from(applications)
      .where(eq(applications.status, "new"));
    return Number(row?.value ?? 0);
  } catch {
    return 0;
  }
}

/** RU: Сайдбар + sticky шапка пульта. EN: Authenticated admin shell. */
export async function AdminShell({
  children,
  title,
  pathname,
}: {
  children: ReactNode;
  title: string;
  pathname: string;
}) {
  const user = await getAdminSession();
  if (!user) redirect("/admin/login");
  const newApps = await loadNewAppsCount();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          ESOSH <span>кабінет</span>
        </div>
        <nav className="admin-nav" aria-label="Навігація кабінету">
          <div className="admin-nav-label">Пульт</div>
          {rooms
            .filter((r) => r.group === "main")
            .map((room) => (
              <NavLink
                key={room.href}
                href={room.href}
                label={room.label}
                icon={room.icon}
                current={pathname === room.href}
              />
            ))}
          <div className="admin-nav-label">Контент</div>
          {rooms
            .filter((r) => r.group === "content")
            .map((room) => (
              <NavLink
                key={room.href}
                href={room.href}
                label={room.label}
                icon={room.icon}
                current={pathname.startsWith(room.href)}
              />
            ))}
          <div className="admin-nav-label">Реєстри</div>
          {rooms
            .filter((r) => r.group === "crm")
            .map((room) => (
              <NavLink
                key={room.href}
                href={room.href}
                label={room.label}
                icon={room.icon}
                current={pathname.startsWith(room.href)}
                badge={"badgeKey" in room && room.badgeKey === "newApps" ? newApps : undefined}
              />
            ))}
          <div className="admin-nav-label">Система</div>
          {rooms
            .filter((r) => r.group === "settings")
            .map((room) => (
              <NavLink
                key={room.href}
                href={room.href}
                label={room.label}
                icon={room.icon}
                current={pathname.startsWith(room.href)}
              />
            ))}
        </nav>
      </aside>
      <div className="admin-workspace">
        <header className="admin-chrome">
          <div className="admin-chrome__title">
            <h1>{title}</h1>
          </div>
          <div className="admin-chrome__ops">
            <AdminNewAppsBadge initialCount={newApps} />
            <Link className="admin-chrome-link" href="/" target="_blank" rel="noreferrer">
              На сайт
            </Link>
            <div
              className="admin-user-chip admin-user-chip--compact"
              title={user.email ? `${user.username} · ${user.email}` : user.username}
              aria-label={user.email ? `${roleLabelUk(user.role)}, ${user.username}, ${user.email}` : `${roleLabelUk(user.role)}, ${user.username}`}
            >
              <span className="admin-user-chip__avatar" aria-hidden="true">
                {avatarLetter(user.username)}
              </span>
              <div className="admin-user-chip__meta">
                <span className="admin-badge admin-badge-role">{roleLabelUk(user.role)}</span>
              </div>
            </div>
            <form action="/api/admin/logout" method="post">
              <button className="admin-btn admin-btn-secondary admin-btn-sm" type="submit">
                Вийти
              </button>
            </form>
          </div>
        </header>
        {user.mustChangePassword && pathname !== "/admin/security" ? (
          <div className="admin-warn-banner admin-warn-banner--bar" role="status">
            {isPasswordChangeEnforced() ? (
              <>
                Змініть початковий пароль у розділі{" "}
                <Link href="/admin/security">Безпека</Link>
                {" — "}типовий admin/admin небезпечний. Записи (збереження/видалення) заблоковані, доки пароль не
                змінено.
              </>
            ) : (
              <>
                Рекомендовано змінити початковий пароль у розділі{" "}
                <Link href="/admin/security">Безпека</Link>
                {" — "}типовий admin/admin небезпечний. Блокування записів зараз вимкнено (тест).
              </>
            )}
          </div>
        ) : null}
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
