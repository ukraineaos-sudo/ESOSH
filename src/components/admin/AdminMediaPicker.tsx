"use client";

import { useCallback, useEffect, useId, useState } from "react";

type MediaItem = {
  id: number;
  url: string;
  alt: string;
  contentType: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onPick: (url: string) => void;
};

/** RU: Выбор/загрузка обложки из медиатеки. EN: Pick/upload cover from media library. */
export function AdminMediaPicker({ open, onClose, onPick }: Props) {
  const titleId = useId();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/media");
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(
          data.error === "blob_unavailable" || data.error === "unavailable"
            ? "Потрібні DATABASE_URL та BLOB_READ_WRITE_TOKEN."
            : "Не вдалося завантажити медіатеку.",
        );
        setItems([]);
        return;
      }
      setItems(
        (data.items || []).filter(
          (item: MediaItem) => !item.contentType || item.contentType.startsWith("image/"),
        ),
      );
    } catch {
      setError("Мережева помилка.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (cancelled) return;
      void load();
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [open, load]);

  if (!open) return null;

  async function onUpload(file: File | null) {
    if (!file) return;
    setPending(true);
    setError("");
    const form = new FormData();
    form.set("file", file);
    form.set("alt", file.name);
    try {
      const response = await fetch("/api/admin/media", { method: "POST", body: form });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(response.status === 413 ? "Файл завеликий (макс. 10 МБ)." : "Не вдалося завантажити.");
        return;
      }
      if (data.item?.url) {
        onPick(String(data.item.url));
        onClose();
        return;
      }
      await load();
    } catch {
      setError("Мережева помилка.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="admin-dialog-backdrop" role="presentation" onClick={onClose}>
      <div
        className="admin-dialog admin-dialog-wide"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id={titleId}>Обкладинка</h2>
        <p className="admin-muted">Завантажте зображення або оберіть з медіатеки.</p>
        <label className="admin-label">
          Завантажити файл
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            disabled={pending}
            onChange={(e) => void onUpload(e.target.files?.[0] || null)}
          />
        </label>
        {error ? <p className="admin-error">{error}</p> : null}
        {loading ? <p className="admin-muted">Завантаження…</p> : null}
        <div className="admin-media-pick-grid">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className="admin-media-pick-item"
              onClick={() => {
                onPick(item.url);
                onClose();
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.alt || "Медіа"} />
              <span>{item.alt || "Без підпису"}</span>
            </button>
          ))}
        </div>
        {!loading && items.length === 0 ? (
          <p className="admin-muted">Поки немає зображень у медіатеці.</p>
        ) : null}
        <div className="admin-dialog-actions">
          <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose} disabled={pending}>
            Скасувати
          </button>
        </div>
      </div>
    </div>
  );
}
