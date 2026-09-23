import Link from "next/link";
import { count, eq } from "drizzle-orm";
import { AdminShell } from "@/components/admin/AdminShell";
import { getDb } from "@/db";
import { applications, members } from "@/db/schema";

type DashCard = {
  href: string;
  title: string;
  description: string;
  mark: string;
  tone: "crm" | "content" | "settings";
  featured?: boolean;
  badge?: string;
  cta: string;
};

/** RU: Дашборд пульта. EN: Admin dashboard rooms. */
export default async function AdminHomePage() {
  const db = getDb();
  const dbReady = Boolean(db);

  let newApplications = 0;
  let totalApplications = 0;
  let totalMembers = 0;

  if (db) {
    try {
      const [newRow] = await db
        .select({ value: count() })
        .from(applications)
        .where(eq(applications.status, "new"));
      const [appsRow] = await db.select({ value: count() }).from(applications);
      const [membersRow] = await db.select({ value: count() }).from(members);
      newApplications = Number(newRow?.value ?? 0);
      totalApplications = Number(appsRow?.value ?? 0);
      totalMembers = Number(membersRow?.value ?? 0);
    } catch {
      // keep zeros
    }
  }

  const hasNewApps = newApplications > 0;

  const cards: DashCard[] = [
    {
      href: "/admin/applications",
      title: "Заявки",
      description: "Перегляд анкет, перевірка документів і рішення щодо рівня.",
      mark: "✉",
      tone: "crm",
      featured: hasNewApps,
      badge: hasNewApps ? `${newApplications} нових` : undefined,
      cta: hasNewApps ? "Відкрити нові →" : "Відкрити реєстр →",
    },
    {
      href: "/admin/members",
      title: "Члени",
      description: "Картки учасників: контакти, статус і рівень після підтвердження.",
      mark: "☺",
      tone: "crm",
      cta: "Перейти →",
    },
    {
      href: "/admin/content/news",
      title: "Новини",
      description: "Статті українською та англійською з попереднім переглядом.",
      mark: "✎",
      tone: "content",
      cta: "Редагувати →",
    },
    // CMS «Сторінки» приховано до окремого ТЗ.
    {
      href: "/admin/media",
      title: "Медіа",
      description: "Зображення для новин і сторінок у сховищі Blob.",
      mark: "▣",
      tone: "content",
      cta: "Відкрити бібліотеку →",
    },
    {
      href: "/admin/settings/contacts",
      title: "Контакти",
      description: "Телефони, електронна скринька, соцмережі та адреса на сайті.",
      mark: "☎",
      tone: "settings",
      cta: "Налаштувати →",
    },
  ];

  const ordered = hasNewApps
    ? [...cards.filter((c) => c.featured), ...cards.filter((c) => !c.featured)]
    : cards;

  return (
    <AdminShell title="Огляд" pathname="/admin">
      {!dbReady ? (
        <p className="admin-error">База даних не підключена — задайте DATABASE_URL (Neon Postgres).</p>
      ) : null}
      <p className="admin-muted admin-lead">
        Оперативні показники реєстрів і швидкий доступ до розділів. Нові заявки потребують уваги першими.
      </p>
      {dbReady ? (
        <div className="admin-metric-grid" aria-label="Оперативні показники">
          <Link
            href="/admin/applications"
            className={`admin-metric${hasNewApps ? " admin-metric--alert" : ""}`}
          >
            <span className="admin-metric__label">Нові заявки</span>
            <strong className="admin-metric__value">{newApplications}</strong>
            <span className="admin-metric__hint">
              {hasNewApps ? "потребують уваги" : "немає нових"}
            </span>
          </Link>
          <Link href="/admin/applications" className="admin-metric admin-metric--apps">
            <span className="admin-metric__label">Усі заявки</span>
            <strong className="admin-metric__value">{totalApplications}</strong>
            <span className="admin-metric__hint">у реєстрі</span>
          </Link>
          <Link href="/admin/members" className="admin-metric admin-metric--members">
            <span className="admin-metric__label">Члени</span>
            <strong className="admin-metric__value">{totalMembers}</strong>
            <span className="admin-metric__hint">карток у базі</span>
          </Link>
        </div>
      ) : null}
      <p className="admin-section-label">Швидкий доступ</p>
      <div className="admin-card-grid">
        {ordered.map((card) => (
          <Link
            key={card.href}
            className={`admin-card admin-card--${card.tone}${card.featured ? " admin-card--featured" : ""}`}
            href={card.href}
          >
            <div className="admin-card__head">
              <span className="admin-card__mark" aria-hidden="true">
                {card.mark}
              </span>
              <h2>
                {card.title}
                {card.badge ? <span className="admin-badge admin-badge-alert">{card.badge}</span> : null}
              </h2>
            </div>
            <p>{card.description}</p>
            <div className="admin-card__cta">{card.cta}</div>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
