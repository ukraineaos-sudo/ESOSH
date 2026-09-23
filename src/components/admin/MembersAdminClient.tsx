"use client";

import { useMemo, useState } from "react";
import { AdminConfirmDelete } from "@/components/admin/AdminConfirmDelete";
import { ADMIN_DELETE_CONFIRM } from "@/lib/admin/confirm-delete";
import { LEVEL_LABELS_UK, memberStatusLabelUk, type LevelCode } from "@/lib/enrollment/levels";

export type MemberListItem = {
  id: number;
  publicId: string;
  firstName: string;
  lastName: string;
  primaryEmail: string;
  secondaryEmail: string | null;
  status: string;
  level: string | null;
  linkedApplications: number;
};

/** RU: Реєстр членів з видаленням. EN: Members registry with delete. */
export function MembersAdminClient({ initialItems }: { initialItems: MemberListItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [pendingDelete, setPendingDelete] = useState<MemberListItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const countHint = useMemo(() => {
    if (items.length === 0) return "Немає карток";
    if (items.length === 1) return "1 картка";
    if (items.length < 5) return `${items.length} картки`;
    return `${items.length} карток`;
  }, [items.length]);

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const response = await fetch(`/api/admin/members/${pendingDelete.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: ADMIN_DELETE_CONFIRM }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setDeleteError(
          data.error === "confirm_required"
            ? "Потрібне підтвердження словом «да»"
            : response.status === 401
              ? "Видалення доступне лише адміністратору"
              : "Не вдалося видалити картку",
        );
        return;
      }
      setItems((prev) => prev.filter((item) => item.id !== pendingDelete.id));
      setPendingDelete(null);
    } catch {
      setDeleteError("Мережева помилка");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="admin-stack">
      <p className="admin-muted">
        Картки учасників створюються автоматично з форми вступу. Видалення картки не знищує заявки — вони
        залишаться в реєстрі заявок без привʼязки до члена.
      </p>
      <p className="admin-muted">{countHint}</p>
      {items.length === 0 ? (
        <div className="admin-empty">
          <p>Поки немає карток членів.</p>
          <p className="admin-muted">Перша картка зʼявиться після подання заявки на вступ.</p>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>№</th>
              <th>Публічний код</th>
              <th>ПІБ</th>
              <th>Основна скринька</th>
              <th>Додаткова скринька</th>
              <th>Статус</th>
              <th>Рівень</th>
              <th>Заявки</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.publicId}</td>
                <td>
                  {item.lastName} {item.firstName}
                </td>
                <td>{item.primaryEmail}</td>
                <td>{item.secondaryEmail || "—"}</td>
                <td>
                  <span className="admin-badge">{memberStatusLabelUk(item.status)}</span>
                </td>
                <td>
                  {item.level
                    ? LEVEL_LABELS_UK[item.level as LevelCode] || item.level
                    : "—"}
                </td>
                <td>{item.linkedApplications}</td>
                <td>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <AdminConfirmDelete
        open={Boolean(pendingDelete)}
        title="Видалити картку члена?"
        description={
          pendingDelete
            ? pendingDelete.linkedApplications > 0
              ? `Картку ${pendingDelete.publicId} буде видалено. Звʼязані заявки (${pendingDelete.linkedApplications}) залишаться в реєстрі, але без привʼязки до цієї картки.`
              : `Картку ${pendingDelete.publicId} буде видалено назавжди.`
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
