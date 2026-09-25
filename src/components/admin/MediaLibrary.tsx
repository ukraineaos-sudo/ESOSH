"use client";

import { FormEvent, useState } from "react";

type MediaItem = {
  id: number;
  url: string;
  alt: string;
  contentType: string | null;
  sizeBytes: number | null;
};

function formatSize(bytes: number | null): string {
  if (bytes == null || !Number.isFinite(bytes) || bytes < 0) return "";
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

function typeLabelUk(contentType: string | null): string {
  if (!contentType) return "Файл";
  if (contentType.startsWith("image/")) return "Зображення";
  if (contentType === "application/pdf") return "PDF";
  return "Файл";
}

/** RU: Библиотека медиа. EN: Media library manager. */
export function MediaLibrary({ initialItems }: { initialItems: MediaItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function refresh() {
    const response = await fetch("/api/admin/media");
    const data = await response.json();
    if (!response.ok) {
      setError(
        data.error === "blob_unavailable" || data.error === "unavailable"
          ? "Сховище файлів недоступне. Перевірте підключення бази та сховища у налаштуваннях хостингу."
          : "Не вдалося оновити список файлів.",
      );
      return;
    }
    setItems(data.items || []);
  }

  async function onUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/media", { method: "POST", body: form });
    setPending(false);
    if (!response.ok) {
      setError("Не вдалося завантажити файл. Спробуйте інший формат (зображення або PDF).");
      return;
    }
    event.currentTarget.reset();
    setMessage("Файл завантажено — можна обирати його в новинах.");
    await refresh();
  }

  return (
    <div className="admin-stack">
      <form className="admin-panel admin-form" onSubmit={onUpload}>
        <h2>Завантажити файл</h2>
        <p className="admin-muted" style={{ marginTop: 0 }}>
          Зображення та PDF для обкладинок і матеріалів новин. Після завантаження файл зʼявиться в
          списку нижче і в вікні вибору обкладинки.
        </p>
        <label>
          Файл (зображення або PDF)
          <input name="file" type="file" accept="image/*,application/pdf" required />
        </label>
        <label>
          Підпис (що зображено)
          <input name="alt" type="text" placeholder="Короткий опис для доступності" />
        </label>
        <button className="admin-btn" type="submit" disabled={pending}>
          {pending ? "Завантаження…" : "Завантажити"}
        </button>
      </form>
      {error ? <p className="admin-error">{error}</p> : null}
      {message ? <p className="admin-ok">{message}</p> : null}

      <p className="admin-section-label">Завантажені файли</p>
      {items.length === 0 ? (
        <p className="admin-muted">Поки немає файлів. Завантажте перший вище.</p>
      ) : (
        <div className="admin-card-grid">
          {items.map((item) => {
            const size = formatSize(item.sizeBytes);
            return (
              <a
                key={item.id}
                className="admin-card"
                href={item.url}
                target="_blank"
                rel="noreferrer"
              >
                <h2>{item.alt || typeLabelUk(item.contentType)}</h2>
                <p className="admin-muted">
                  {typeLabelUk(item.contentType)}
                  {size ? ` · ${size}` : ""}
                </p>
                <p className="admin-muted" style={{ wordBreak: "break-all", fontSize: "0.85em" }}>
                  Відкрити файл
                </p>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
