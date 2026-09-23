"use client";

import { useId, useState } from "react";
import { ADMIN_DELETE_CONFIRM } from "@/lib/admin/confirm-delete";

type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  busy?: boolean;
  error?: string | null;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
};

/** RU: Діалог видалення з підтвердженням словом «так». EN: Delete dialog requiring «так». */
export function AdminConfirmDelete({
  open,
  title,
  description,
  confirmLabel = "Видалити назавжди",
  busy = false,
  error = null,
  onCancel,
  onConfirm,
}: Props) {
  if (!open) return null;
  return (
    <AdminConfirmDeleteBody
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      busy={busy}
      error={error}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}

function AdminConfirmDeleteBody({
  title,
  description,
  confirmLabel,
  busy,
  error,
  onCancel,
  onConfirm,
}: Omit<Props, "open">) {
  const titleId = useId();
  const [typed, setTyped] = useState("");
  const canConfirm = typed.trim() === ADMIN_DELETE_CONFIRM && !busy;

  return (
    <div className="admin-dialog-backdrop" role="presentation" onClick={onCancel}>
      <div
        className="admin-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id={titleId}>{title}</h2>
        <p className="admin-muted">{description}</p>
        <label className="admin-label">
          Щоб підтвердити, введіть <strong>{ADMIN_DELETE_CONFIRM}</strong>
          <input
            className="admin-input admin-confirm-input"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            autoComplete="off"
            autoFocus
            disabled={busy}
          />
        </label>
        {error ? <p className="admin-error">{error}</p> : null}
        <div className="admin-dialog-actions">
          <button type="button" className="admin-btn admin-btn-secondary" onClick={onCancel} disabled={busy}>
            Скасувати
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-danger"
            onClick={() => void onConfirm()}
            disabled={!canConfirm}
          >
            {busy ? "Видаляємо…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
