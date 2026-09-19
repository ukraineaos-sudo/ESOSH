"use client";

import { FormEvent, useState } from "react";

type MediaItem = { id: number; url: string; alt: string; contentType: string | null; sizeBytes: number | null };

/** RU: Библиотека медиа. EN: Media library manager. */
export function MediaLibrary({ initialItems }: { initialItems: MediaItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function refresh() {
    const response = await fetch("/api/admin/media");
    const data = await response.json();
    if (!response.ok) {
      setError(
        data.error === "blob_unavailable" || data.error === "unavailable"
          ? "Потрібні DATABASE_URL та BLOB_READ_WRITE_TOKEN."
          : "Помилка завантаження.",
      );
      return;
    }
    setItems(data.items || []);
  }

  async function onUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/media", { method: "POST", body: form });
    setPending(false);
    if (!response.ok) {
      setError("Не вдалося завантажити файл.");
      return;
    }
    event.currentTarget.reset();
    await refresh();
  }

  return (
    <div className="admin-stack">
      <form className="admin-form" onSubmit={onUpload}>
        <label>
          Файл
          <input name="file" type="file" accept="image/*,application/pdf" required />
        </label>
        <label>
          Alt / підпис
          <input name="alt" type="text" />
        </label>
        <button className="admin-btn" type="submit" disabled={pending}>
          {pending ? "Завантаження…" : "Завантажити"}
        </button>
      </form>
      {error ? <p className="admin-error">{error}</p> : null}
      <div className="admin-card-grid">
        {items.map((item) => (
          <a key={item.id} className="admin-card" href={item.url} target="_blank" rel="noreferrer">
            <h2>{item.alt || "Файл"}</h2>
            <p className="admin-muted" style={{ wordBreak: "break-all" }}>
              {item.url}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
