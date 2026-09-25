"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AdminConfirmDelete } from "@/components/admin/AdminConfirmDelete";
import { AdminMediaPicker } from "@/components/admin/AdminMediaPicker";
import { AdminRichTextEditor } from "@/components/admin/AdminRichTextEditor";
import { ADMIN_DELETE_CONFIRM } from "@/lib/admin/confirm-delete";
import type { CmsBlock } from "@/lib/cms/blocks";
import { newBlockId } from "@/lib/cms/blocks";
import { newsPublicPath, slugifyTitle } from "@/lib/cms/slugify";

type NewsItem = {
  id: number;
  locale: string;
  slug: string;
  title: string;
  excerpt: string;
  coverUrl: string | null;
  body: CmsBlock[];
  status: string;
  publishedAt?: string | Date | null;
};

function emptyNewsBody(): CmsBlock[] {
  return [{ id: newBlockId(), type: "richText", html: "<p></p>" }];
}

function richHtml(body: CmsBlock[]): string {
  const rich = body.find((b) => b.type === "richText");
  return rich && rich.type === "richText" ? rich.html : "";
}

function withRichHtml(body: CmsBlock[], html: string): CmsBlock[] {
  const rich = body.find((b) => b.type === "richText");
  if (rich && rich.type === "richText") {
    return body.map((b) => (b.id === rich.id && b.type === "richText" ? { ...b, html } : b));
  }
  return [...body, { id: newBlockId(), type: "richText", html }];
}

function statusLabelUk(status: string): string {
  if (status === "draft") return "Чернетка";
  if (status === "published") return "На сайті";
  return status;
}

function localeLabelUk(locale: string): string {
  if (locale === "uk") return "Українська";
  if (locale === "en") return "English";
  return locale;
}

function formatDate(value: string | Date | null | undefined, locale: string): string {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(locale === "en" ? "en-GB" : "uk-UA");
}

/** RU: Панель новин CMS (список + редактор). EN: CMS news manager. */
export function NewsManager({ initialItems }: { initialItems: NewsItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [slugManual, setSlugManual] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createSlug, setCreateSlug] = useState("");
  const [createLocale, setCreateLocale] = useState<"uk" | "en">("uk");
  const [saving, setSaving] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<NewsItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const editorPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editing) return;
    editorPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [editing?.id]);

  const sorted = useMemo(
    () =>
      [...items].sort((a, b) => {
        const ta = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const tb = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        if (tb !== ta) return tb - ta;
        return b.id - a.id;
      }),
    [items],
  );

  async function refresh() {
    const response = await fetch("/api/admin/news");
    const data = await response.json();
    if (!response.ok) {
      setError("Немає доступу до БД або сесії.");
      return;
    }
    setItems(data.items || []);
  }

  async function createNews(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const locale = form.get("locale") === "en" ? "en" : "uk";
    const title = String(form.get("title") || "").trim();
    const slug = String(form.get("slug") || slugifyTitle(title) || "").trim();
    if (!title || !slug) {
      setError("Потрібні заголовок і шлях у URL.");
      return;
    }
    const response = await fetch("/api/admin/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locale,
        slug,
        title,
        excerpt: form.get("excerpt") || "",
        status: "draft",
        body: emptyNewsBody(),
      }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      if (payload.error === "password_change_required") {
        setError("Спочатку змініть початковий пароль у розділі «Безпека» — збереження заблоковано.");
      } else if (response.status === 401) {
        setError("Сесія закінчилась. Увійдіть знову в адмінку.");
      } else if (payload.error === "duplicate" || response.status === 409) {
        setError("Такий шлях уже зайнятий для цієї мови. Змініть «Шлях у адресі».");
      } else if (payload.error === "unavailable" || response.status === 503) {
        setError("База даних недоступна. Перевірте підключення DATABASE_URL.");
      } else {
        setError("Не вдалося створити новину. Спробуйте ще раз або змініть шлях.");
      }
      return;
    }
    const data = await response.json().catch(() => ({}));
    setCreating(false);
    setCreateTitle("");
    setCreateSlug("");
    setSlugManual(false);
    setMessage("Чернетку створено.");
    await refresh();
    if (data.item) {
      setEditing({
        ...data.item,
        body: Array.isArray(data.item.body) ? data.item.body : emptyNewsBody(),
      });
      setSlugManual(true);
    }
  }

  async function saveEditing(opts: { status?: "draft" | "published"; bumpPublishedAt?: boolean }) {
    if (!editing) return;
    setSaving(true);
    setError("");
    setMessage("");
    const nextStatus = opts.status ?? (editing.status === "published" ? "published" : "draft");
    const payload = {
      ...editing,
      status: nextStatus,
      bumpPublishedAt: Boolean(opts.bumpPublishedAt),
      slug: editing.slug.trim(),
      title: editing.title.trim(),
    };
    try {
      const response = await fetch("/api/admin/news", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        setError("Не вдалося зберегти.");
        return;
      }
      const data = await response.json().catch(() => ({}));
      setEditing(
        data.item
          ? {
              ...data.item,
              body: Array.isArray(data.item.body) ? data.item.body : emptyNewsBody(),
            }
          : { ...editing, status: nextStatus },
      );
      setMessage(
        nextStatus === "published" ? "Опубліковано — новина на сайті." : "Чернетку збережено.",
      );
      await refresh();
    } finally {
      setSaving(false);
    }
  }

  async function setStatusQuick(item: NewsItem, status: "draft" | "published") {
    setError("");
    setMessage("");
    const response = await fetch("/api/admin/news", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...item,
        status,
        bumpPublishedAt: status === "published" && item.status !== "published",
      }),
    });
    if (!response.ok) {
      setError(status === "published" ? "Не вдалося опублікувати." : "Не вдалося приховати.");
      return;
    }
    setMessage(status === "published" ? "На сайті." : "Приховано з сайту (чернетка).");
    if (editing?.id === item.id) {
      setEditing({ ...item, status });
    }
    await refresh();
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const response = await fetch(`/api/admin/news/${pendingDelete.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: ADMIN_DELETE_CONFIRM }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setDeleteError(
          data.error === "confirm_required"
            ? "Потрібне підтвердження словом «так»"
            : "Не вдалося видалити новину",
        );
        return;
      }
      if (editing?.id === pendingDelete.id) setEditing(null);
      setPendingDelete(null);
      setMessage("Новину видалено.");
      await refresh();
    } catch {
      setDeleteError("Мережева помилка");
    } finally {
      setDeleting(false);
    }
  }

  const previewHref = editing
    ? `${newsPublicPath(editing.locale, editing.slug)}?preview=1`
    : "#";
  const publicHref = editing ? newsPublicPath(editing.locale, editing.slug) : "#";

  return (
    <div className="admin-stack">
      {error ? <p className="admin-error">{error}</p> : null}
      {message ? <p className="admin-ok">{message}</p> : null}
      <div className="admin-toolbar">
        <button
          className="admin-btn"
          type="button"
          onClick={() => {
            setCreating(true);
            setEditing(null);
            setSlugManual(false);
            setCreateTitle("");
            setCreateSlug("");
            setCreateLocale("uk");
          }}
        >
          Нова новина
        </button>
      </div>

      {creating ? (
        <form className="admin-panel admin-form" onSubmit={createNews}>
          <h2>Нова новина</h2>
          <label>
            Мова
            <select
              name="locale"
              value={createLocale}
              onChange={(e) => setCreateLocale(e.target.value === "en" ? "en" : "uk")}
            >
              <option value="uk">Українська</option>
              <option value="en">English</option>
            </select>
          </label>
          <label>
            Заголовок
            <input
              name="title"
              required
              value={createTitle}
              onChange={(e) => {
                const title = e.target.value;
                setCreateTitle(title);
                if (!slugManual) setCreateSlug(slugifyTitle(title));
              }}
            />
          </label>
          <label>
            Шлях у адресі сторінки
            <input
              name="slug"
              required
              value={createSlug}
              onChange={(e) => {
                setSlugManual(true);
                setCreateSlug(e.target.value);
              }}
              placeholder="my-news-slug"
            />
          </label>
          <p className="admin-muted">
            Буде за адресою:{" "}
            <code>{newsPublicPath(createLocale, createSlug || "…")}</code>
          </p>
          <label>
            Короткий анонс (необовʼязково)
            <textarea name="excerpt" />
          </label>
          <div className="admin-actions">
            <button className="admin-btn" type="submit">
              Створити чернетку
            </button>
            <button
              className="admin-btn admin-btn-secondary"
              type="button"
              onClick={() => setCreating(false)}
            >
              Скасувати
            </button>
          </div>
        </form>
      ) : null}

      {editing ? (
        <div ref={editorPanelRef} className="admin-panel admin-form admin-stack" id="admin-news-editor">
          <h2>Редагування</h2>
          <p className="admin-muted">
            Статус: <strong>{statusLabelUk(editing.status)}</strong>
            {" · "}
            {localeLabelUk(editing.locale)}
          </p>
          <label>
            Мова
            <select
              value={editing.locale}
              onChange={(e) =>
                setEditing({ ...editing, locale: e.target.value === "en" ? "en" : "uk" })
              }
            >
              <option value="uk">Українська</option>
              <option value="en">English</option>
            </select>
          </label>
          <label>
            Заголовок
            <input
              value={editing.title}
              onChange={(e) => {
                const title = e.target.value;
                if (!slugManual) {
                  setEditing({ ...editing, title, slug: slugifyTitle(title) });
                } else {
                  setEditing({ ...editing, title });
                }
              }}
            />
          </label>
          <label>
            Шлях у адресі сторінки
            <input
              value={editing.slug}
              onChange={(e) => {
                setSlugManual(true);
                setEditing({ ...editing, slug: e.target.value });
              }}
            />
          </label>
          <p className="admin-muted">
            На сайті:{" "}
            <a href={publicHref} target="_blank" rel="noreferrer">
              {publicHref}
            </a>
          </p>
          <label>
            Короткий анонс
            <textarea
              value={editing.excerpt}
              onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
            />
          </label>
          <div className="admin-cover-field">
            <span className="admin-label-text">Обкладинка</span>
            {editing.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="admin-cover-preview" src={editing.coverUrl} alt="" />
            ) : (
              <p className="admin-muted">Ще не вибрано</p>
            )}
            <div className="admin-actions">
              <button
                className="admin-btn admin-btn-secondary"
                type="button"
                onClick={() => setMediaOpen(true)}
              >
                Завантажити / обрати
              </button>
              {editing.coverUrl ? (
                <button
                  className="admin-btn admin-btn-secondary"
                  type="button"
                  onClick={() => setEditing({ ...editing, coverUrl: null })}
                >
                  Прибрати
                </button>
              ) : null}
            </div>
            <label>
              Або вставте посилання на зображення
              <input
                value={editing.coverUrl || ""}
                onChange={(e) => setEditing({ ...editing, coverUrl: e.target.value || null })}
                placeholder="https://… або /images/…"
              />
            </label>
          </div>
          <AdminRichTextEditor
            value={richHtml(editing.body)}
            onChange={(html) => setEditing({ ...editing, body: withRichHtml(editing.body, html) })}
          />
          <div className="admin-actions admin-actions-wrap">
            <button
              className="admin-btn"
              type="button"
              disabled={saving}
              onClick={() => void saveEditing({ status: "draft" })}
            >
              Зберегти чернетку
            </button>
            <a
              className="admin-btn admin-btn-secondary"
              href={previewHref}
              target="_blank"
              rel="noreferrer"
            >
              Перегляд
            </a>
            <button
              className="admin-btn"
              type="button"
              disabled={saving}
              onClick={() => void saveEditing({ status: "published", bumpPublishedAt: true })}
            >
              Опублікувати
            </button>
            {editing.status === "published" ? (
              <button
                className="admin-btn admin-btn-secondary"
                type="button"
                disabled={saving}
                onClick={() => void saveEditing({ status: "draft" })}
              >
                Приховати з сайту
              </button>
            ) : null}
            <button
              className="admin-btn admin-btn-secondary"
              type="button"
              onClick={() => setEditing(null)}
            >
              Закрити
            </button>
            <button
              className="admin-btn admin-btn-danger"
              type="button"
              onClick={() => {
                setDeleteError(null);
                setPendingDelete(editing);
              }}
            >
              Видалити
            </button>
          </div>
        </div>
      ) : null}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Заголовок</th>
            <th>Мова</th>
            <th>Статус</th>
            <th>Дата</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {sorted.map((item) => (
            <tr key={item.id}>
              <td>
                <Link
                  href={newsPublicPath(item.locale, item.slug)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.title}
                </Link>
              </td>
              <td>{localeLabelUk(item.locale)}</td>
              <td>
                <span className="admin-badge">{statusLabelUk(item.status)}</span>
              </td>
              <td>{formatDate(item.publishedAt, item.locale)}</td>
              <td>
                <div className="admin-actions admin-actions-compact">
                  <button
                    className="admin-btn admin-btn-secondary"
                    type="button"
                    onClick={() => {
                      setCreating(false);
                      setSlugManual(true);
                      setEditing({
                        ...item,
                        body: Array.isArray(item.body) ? item.body : emptyNewsBody(),
                      });
                    }}
                  >
                    Редагувати
                  </button>
                  {item.status === "published" ? (
                    <button
                      className="admin-btn admin-btn-secondary"
                      type="button"
                      onClick={() => void setStatusQuick(item, "draft")}
                    >
                      Приховати
                    </button>
                  ) : (
                    <button
                      className="admin-btn admin-btn-secondary"
                      type="button"
                      onClick={() => void setStatusQuick(item, "published")}
                    >
                      На сайт
                    </button>
                  )}
                  <button
                    className="admin-btn admin-btn-danger"
                    type="button"
                    onClick={() => {
                      setDeleteError(null);
                      setPendingDelete(item);
                    }}
                  >
                    Видалити
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {sorted.length === 0 ? (
        <p className="admin-muted">
          Поки немає новин. Створіть першу кнопкою вище або виконайте імпорт архіву з репозиторію
          (<code>npm run db:import-news</code>, див. документацію імпорту).
        </p>
      ) : null}

      <AdminMediaPicker
        open={mediaOpen}
        onClose={() => setMediaOpen(false)}
        onPick={(url) => {
          if (editing) setEditing({ ...editing, coverUrl: url });
        }}
      />

      <AdminConfirmDelete
        open={Boolean(pendingDelete)}
        title="Видалити новину?"
        description={
          pendingDelete
            ? `«${pendingDelete.title}» зникне з адмінки й з сайту. Це не можна скасувати.`
            : ""
        }
        busy={deleting}
        error={deleteError}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
