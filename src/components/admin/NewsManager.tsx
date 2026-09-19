"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import type { CmsBlock } from "@/lib/cms/blocks";
import { emptyBlocks, newBlockId } from "@/lib/cms/blocks";

type NewsItem = {
  id: number;
  locale: string;
  slug: string;
  title: string;
  excerpt: string;
  coverUrl: string | null;
  body: CmsBlock[];
  status: string;
};

/** RU: CRUD новостей CMS. EN: CMS news manager. */
export function NewsManager({ initialItems }: { initialItems: NewsItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [creating, setCreating] = useState(false);

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
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locale: form.get("locale"),
        slug: form.get("slug"),
        title: form.get("title"),
        excerpt: form.get("excerpt") || "",
        status: "draft",
        body: emptyBlocks(),
      }),
    });
    if (!response.ok) {
      setError("Не вдалося створити.");
      return;
    }
    setCreating(false);
    await refresh();
  }

  async function saveEditing() {
    if (!editing) return;
    const response = await fetch("/api/admin/news", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    if (!response.ok) {
      setError("Не вдалося зберегти.");
      return;
    }
    setEditing(null);
    await refresh();
  }

  function addRichText() {
    if (!editing) return;
    setEditing({
      ...editing,
      body: [
        ...editing.body,
        { id: newBlockId(), type: "richText", html: "<p>Новий абзац</p>" },
      ],
    });
  }

  return (
    <div className="admin-stack">
      {error ? <p className="admin-error">{error}</p> : null}
      <div className="admin-toolbar">
        <button className="admin-btn" type="button" onClick={() => setCreating(true)}>
          Нова новина
        </button>
      </div>

      {creating ? (
        <form className="admin-panel admin-form" onSubmit={createNews}>
          <label>
            Локаль
            <select name="locale" defaultValue="uk">
              <option value="uk">uk</option>
              <option value="en">en</option>
            </select>
          </label>
          <label>
            Slug
            <input name="slug" required placeholder="my-news-slug" />
          </label>
          <label>
            Заголовок
            <input name="title" required />
          </label>
          <label>
            Excerpt
            <textarea name="excerpt" />
          </label>
          <div className="admin-actions">
            <button className="admin-btn" type="submit">
              Створити draft
            </button>
            <button className="admin-btn admin-btn-secondary" type="button" onClick={() => setCreating(false)}>
              Скасувати
            </button>
          </div>
        </form>
      ) : null}

      {editing ? (
        <div className="admin-panel admin-form admin-stack">
          <h2>Редагування #{editing.id}</h2>
          <label>
            Заголовок
            <input
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
            />
          </label>
          <label>
            Slug
            <input
              value={editing.slug}
              onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
            />
          </label>
          <label>
            Excerpt
            <textarea
              value={editing.excerpt}
              onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
            />
          </label>
          <label>
            Cover URL
            <input
              value={editing.coverUrl || ""}
              onChange={(e) => setEditing({ ...editing, coverUrl: e.target.value || null })}
            />
          </label>
          <label>
            Статус
            <select
              value={editing.status}
              onChange={(e) => setEditing({ ...editing, status: e.target.value })}
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
            </select>
          </label>
          <label>
            Body HTML (richText блоки)
            <textarea
              rows={8}
              value={
                editing.body.find((b) => b.type === "richText")?.html ||
                editing.body.map((b) => JSON.stringify(b)).join("\n")
              }
              onChange={(e) => {
                const rich = editing.body.find((b) => b.type === "richText");
                if (rich && rich.type === "richText") {
                  setEditing({
                    ...editing,
                    body: editing.body.map((b) =>
                      b.id === rich.id && b.type === "richText"
                        ? { ...b, html: e.target.value }
                        : b,
                    ),
                  });
                } else {
                  setEditing({
                    ...editing,
                    body: [
                      ...editing.body,
                      { id: newBlockId(), type: "richText", html: e.target.value },
                    ],
                  });
                }
              }}
            />
          </label>
          <div className="admin-actions">
            <button className="admin-btn" type="button" onClick={() => void saveEditing()}>
              Зберегти
            </button>
            <button className="admin-btn admin-btn-secondary" type="button" onClick={addRichText}>
              + richText
            </button>
            <a
              className="admin-btn admin-btn-secondary"
              href={`/${editing.locale === "en" ? "en/" : ""}news/${editing.slug}?preview=1`}
              target="_blank"
              rel="noreferrer"
            >
              Preview
            </a>
            <button className="admin-btn admin-btn-secondary" type="button" onClick={() => setEditing(null)}>
              Закрити
            </button>
          </div>
        </div>
      ) : null}

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Locale</th>
            <th>Title</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.locale}</td>
              <td>
                <Link href={`/${item.locale === "en" ? "en/" : ""}news/${item.slug}`} target="_blank">
                  {item.title}
                </Link>
              </td>
              <td>
                <span className="admin-badge">{item.status}</span>
              </td>
              <td>
                <button className="admin-btn admin-btn-secondary" type="button" onClick={() => setEditing(item)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
