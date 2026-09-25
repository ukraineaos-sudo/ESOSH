"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AdminConfirmDelete } from "@/components/admin/AdminConfirmDelete";
import { emitAdminAppsRefresh } from "@/components/admin/AdminNewAppsBadge";
import { ADMIN_DELETE_CONFIRM } from "@/lib/admin/confirm-delete";
import {
  LEVEL_LABELS_UK,
  STATUS_LABELS_UK,
  APPLICATION_STATUSES,
  LEVEL_CODES,
  type ApplicationStatus,
  type LevelCode,
} from "@/lib/enrollment/levels";

type ListItem = {
  id: number;
  publicId: string;
  status: string;
  autoLevel: string | null;
  approvedLevel: string | null;
  requiresManualReview: boolean;
  createdAt: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  organization: string | null;
  industry: string | null;
};

const POLL_MS = 30_000;

function statusTone(status: string): "new" | "progress" | "done" | "other" {
  if (status === "new") return "new";
  if (status === "in_review" || status === "needs_info") return "progress";
  if (status === "confirmed" || status === "confirmed_no_level" || status === "rejected") return "done";
  return "other";
}

/** RU: Клієнтський реєстр заявок. EN: Applications registry client. */
export function ApplicationsAdminClient({ initialItems }: { initialItems: ListItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [autoLevel, setAutoLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<ListItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const stopPollRef = useRef(false);
  const pendingDeleteRef = useRef(pendingDelete);

  useLayoutEffect(() => {
    pendingDeleteRef.current = pendingDelete;
  }, [pendingDelete]);

  const filteredHint = useMemo(() => {
    if (items.length === 0) return "Немає записів за поточними фільтрами";
    if (items.length === 1) return "1 заявка";
    if (items.length < 5) return `${items.length} заявки`;
    return `${items.length} заявок`;
  }, [items.length]);

  const syncHeaderBadge = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/applications?status=new");
      if (response.status === 401) {
        stopPollRef.current = true;
        return;
      }
      if (!response.ok) return;
      const data = (await response.json()) as { items?: unknown[] };
      if (Array.isArray(data.items)) emitAdminAppsRefresh(data.items.length);
    } catch {
      // ignore
    }
  }, []);

  const reload = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!opts?.silent) setLoading(true);
      try {
        const params = new URLSearchParams();
        if (q.trim()) params.set("q", q.trim());
        if (status) params.set("status", status);
        if (autoLevel) params.set("autoLevel", autoLevel);
        const response = await fetch(`/api/admin/applications?${params.toString()}`);
        if (response.status === 401) {
          stopPollRef.current = true;
          return;
        }
        const data = await response.json();
        if (response.ok && data.items) {
          setItems(data.items);
          void syncHeaderBadge();
        }
      } finally {
        if (!opts?.silent) setLoading(false);
      }
    },
    [q, status, autoLevel, syncHeaderBadge],
  );

  useEffect(() => {
    stopPollRef.current = false;
    const id = window.setInterval(() => {
      if (stopPollRef.current) return;
      if (pendingDeleteRef.current) return;
      void reload({ silent: true });
    }, POLL_MS);
    return () => window.clearInterval(id);
  }, [reload]);

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const response = await fetch(`/api/admin/applications/${pendingDelete.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: ADMIN_DELETE_CONFIRM }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setDeleteError(
          data.error === "confirm_required"
            ? "Потрібне підтвердження словом «так»"
            : "Не вдалося видалити заявку",
        );
        return;
      }
      setItems((prev) => prev.filter((item) => item.id !== pendingDelete.id));
      setPendingDelete(null);
      void syncHeaderBadge();
    } catch {
      setDeleteError("Мережева помилка");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="admin-stack">
      <div className="admin-toolbar">
        <input
          className="admin-input"
          placeholder="Пошук: ПІБ, скринька, організація, код…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void reload();
          }}
          aria-label="Пошук заявок"
        />
        <select
          className="admin-input"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Статус"
        >
          <option value="">Усі статуси</option>
          {APPLICATION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS_UK[s]}
            </option>
          ))}
        </select>
        <select
          className="admin-input"
          value={autoLevel}
          onChange={(e) => setAutoLevel(e.target.value)}
          aria-label="Попередній рівень"
        >
          <option value="">Усі рівні</option>
          {LEVEL_CODES.map((l) => (
            <option key={l} value={l}>
              {LEVEL_LABELS_UK[l]}
            </option>
          ))}
        </select>
        <button type="button" className="admin-btn" onClick={() => void reload()} disabled={loading}>
          {loading ? "Завантаження…" : "Показати"}
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-secondary"
          onClick={async () => {
            const response = await fetch("/api/admin/applications/export");
            if (!response.ok) return;
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "esosh-zayavky.csv";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Експорт
        </button>
      </div>
      <p className="admin-muted">
        {filteredHint}
        <span className="admin-poll-hint"> · оновлення кожні 30 с</span>
      </p>
      {items.length === 0 ? (
        <div className="admin-empty">
          <p>Заявок поки немає.</p>
          <p className="admin-muted">
            Нові анкети зʼявляться тут після заповнення форми на сторінці «Долучитися → Подати заявку».
          </p>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Код заявки</th>
              <th>ПІБ</th>
              <th>Організація</th>
              <th>Статус</th>
              <th>Попередній рівень</th>
              <th>Дата</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const tone = statusTone(item.status);
              return (
                <tr key={item.id} className={`admin-app-row admin-app-row--${tone}`}>
                  <td>
                    <Link href={`/admin/applications/${item.id}`}>{item.publicId}</Link>
                    {item.requiresManualReview ? (
                      <span className="admin-badge admin-badge-alert">потрібна перевірка</span>
                    ) : null}
                  </td>
                  <td>
                    {item.lastName} {item.firstName}
                    <div className="admin-muted">{item.email}</div>
                  </td>
                  <td>
                    {item.organization || "—"}
                    <div className="admin-muted">{item.industry}</div>
                  </td>
                  <td>
                    <span className={`admin-badge admin-badge-status admin-badge-status--${tone}`}>
                      {STATUS_LABELS_UK[item.status as ApplicationStatus] || item.status}
                    </span>
                  </td>
                  <td>
                    {item.autoLevel
                      ? LEVEL_LABELS_UK[item.autoLevel as LevelCode] || item.autoLevel
                      : "—"}
                  </td>
                  <td>{item.createdAt ? new Date(item.createdAt).toLocaleString("uk-UA") : ""}</td>
                  <td>
                    <div className="admin-row-actions">
                      <Link className="admin-link-btn" href={`/admin/applications/${item.id}`}>
                        Відкрити
                      </Link>
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger admin-btn-sm"
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
              );
            })}
          </tbody>
        </table>
      )}

      <AdminConfirmDelete
        open={Boolean(pendingDelete)}
        title="Видалити заявку?"
        description={
          pendingDelete
            ? `Заявку ${pendingDelete.publicId} буде видалено разом із файлами та журналом. Картка члена (якщо є) залишиться в реєстрі.`
            : ""
        }
        busy={deleting}
        error={deleteError}
        onCancel={() => {
          if (!deleting) setPendingDelete(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
