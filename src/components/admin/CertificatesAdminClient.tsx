"use client";

import { useMemo, useState } from "react";
import { AdminConfirmDelete } from "@/components/admin/AdminConfirmDelete";
import { ADMIN_DELETE_CONFIRM } from "@/lib/admin/confirm-delete";
import type {
  AdminCertificateCourseStat,
  AdminCertificateListItem,
  AdminListMeta,
} from "@/lib/admin/training-certificates";

type Props = {
  initialItems: AdminCertificateListItem[];
  initialCourses: AdminCertificateCourseStat[];
  initialMeta?: AdminListMeta;
};

type PendingDelete =
  | { mode: "one"; id: number; label: string }
  | { mode: "course"; courseCode: string; label: string }
  | { mode: "all"; label: string };

/** RU: Реєстр сертифікатів тренінгів. EN: Training certificates registry UI. */
export function CertificatesAdminClient({
  initialItems,
  initialCourses,
  initialMeta,
}: Props) {
  const [items, setItems] = useState(initialItems);
  const [courses, setCourses] = useState(initialCourses);
  const [listMeta, setListMeta] = useState<AdminListMeta>(
    initialMeta ?? { limit: 500, total: initialItems.length, truncated: false },
  );
  const [courseFilter, setCourseFilter] = useState("");
  const [query, setQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [busyReload, setBusyReload] = useState(false);

  const filtered = useMemo(() => {
    const code = courseFilter.trim().toUpperCase();
    const q = query.trim().toLocaleLowerCase("uk-UA");
    return items.filter((item) => {
      if (code && item.courseCode.toUpperCase() !== code) return false;
      if (!q) return true;
      return (
        item.participantName.toLocaleLowerCase("uk-UA").includes(q) ||
        item.certificateNumber.toLocaleLowerCase("uk-UA").includes(q)
      );
    });
  }, [items, courseFilter, query]);

  async function reload() {
    setBusyReload(true);
    try {
      const params = new URLSearchParams();
      if (courseFilter.trim()) params.set("courseCode", courseFilter.trim().toUpperCase());
      if (query.trim()) params.set("q", query.trim());
      const res = await fetch(`/api/admin/certificates?${params.toString()}`, {
        credentials: "same-origin",
      });
      const data = (await res.json()) as {
        ok?: boolean;
        items?: AdminCertificateListItem[];
        courses?: AdminCertificateCourseStat[];
        limit?: number;
        total?: number;
        truncated?: boolean;
      };
      if (res.ok && data.ok && data.items && data.courses) {
        setItems(data.items);
        setCourses(data.courses);
        if (typeof data.total === "number" && typeof data.limit === "number") {
          setListMeta({
            limit: data.limit,
            total: data.total,
            truncated: Boolean(data.truncated),
          });
        }
      }
    } finally {
      setBusyReload(false);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete || deleting) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const body: Record<string, unknown> = {
        confirm: ADMIN_DELETE_CONFIRM,
        mode: pendingDelete.mode,
      };
      if (pendingDelete.mode === "one") body.id = pendingDelete.id;
      if (pendingDelete.mode === "course") body.courseCode = pendingDelete.courseCode;

      const res = await fetch("/api/admin/certificates", {
        method: "DELETE",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; deleted?: number };
      if (!res.ok || !data.ok) {
        setDeleteError(
          data.error === "confirm_required"
            ? "Потрібне підтвердження словом «так»"
            : data.error === "not_found"
              ? "Запис не знайдено"
              : "Не вдалося видалити",
        );
        return;
      }
      setPendingDelete(null);
      await reload();
    } catch {
      setDeleteError("Не вдалося видалити");
    } finally {
      setDeleting(false);
    }
  }

  const totalIssued = courses.reduce((sum, c) => sum + c.count, 0);

  async function exportCsv() {
    const params = new URLSearchParams();
    if (courseFilter.trim()) params.set("courseCode", courseFilter.trim().toUpperCase());
    if (query.trim()) params.set("q", query.trim());
    const response = await fetch(`/api/admin/certificates/export?${params.toString()}`, {
      credentials: "same-origin",
    });
    if (!response.ok) return;
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const stamp = new Date().toISOString().slice(0, 10);
    const codePart = courseFilter.trim().toUpperCase() || "all";
    a.download = `esosh-certificates-${codePart}-${stamp}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="admin-stack">
      {listMeta.truncated ? (
        <p className="admin-warn-banner" role="status">
          Показано {items.length} з {listMeta.total} (ліміт списку {listMeta.limit}). Уточніть фільтр
          або експортуйте Excel (до 5000 рядків).
        </p>
      ) : null}
      <div className="admin-metric-grid admin-metric-grid--2">
        <div className="admin-metric">
          <span className="admin-metric__label">Усього видано</span>
          <strong className="admin-metric__value">{totalIssued}</strong>
        </div>
        <div className="admin-metric">
          <span className="admin-metric__label">Курсів у реєстрі</span>
          <strong className="admin-metric__value">{courses.filter((c) => c.count > 0).length}</strong>
        </div>
      </div>

      <section className="admin-panel" aria-labelledby="cert-courses-title">
        <h2 id="cert-courses-title" className="admin-h2">
          Коди курсів
        </h2>
        <p className="admin-muted">
          Відомі коди з контенту тренінгів і коди, що вже зустрічаються у БД. Нові коди зʼявляться тут
          після наповнення курсів. Видалення сертифікатів не скидає лічильники номерів.
        </p>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Код</th>
                <th>Курс</th>
                <th>Slug</th>
                <th>Видано</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.courseCode}>
                  <td>
                    <code>{course.courseCode}</code>
                    {!course.known ? (
                      <span className="admin-muted"> · з БД</span>
                    ) : null}
                  </td>
                  <td>{course.titleUk}</td>
                  <td>{course.slug || "—"}</td>
                  <td>{course.count}</td>
                  <td className="admin-table-actions">
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      onClick={() => setCourseFilter(course.courseCode)}
                    >
                      Фільтр
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      disabled={course.count === 0}
                      onClick={() => {
                        setDeleteError(null);
                        setPendingDelete({
                          mode: "course",
                          courseCode: course.courseCode,
                          label: `${course.courseCode} (${course.count})`,
                        });
                      }}
                    >
                      Відкликати курс
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-panel" aria-labelledby="cert-list-title">
        <div className="admin-toolbar">
          <h2 id="cert-list-title" className="admin-h2">
            Видані сертифікати
          </h2>
          <div className="admin-toolbar__actions">
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => void exportCsv()}
              disabled={filtered.length === 0}
            >
              Експорт Excel
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-danger"
              disabled={items.length === 0}
              onClick={() => {
                setDeleteError(null);
                setPendingDelete({
                  mode: "all",
                  label: `усі сертифікати (${totalIssued})`,
                });
              }}
            >
              Відкликати всі
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => void reload()}
              disabled={busyReload}
            >
              Оновити
            </button>
          </div>
        </div>

        <div className="admin-filters admin-filters--certs">
          <label className="admin-label">
            Курс
            <select
              className="admin-input"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
            >
              <option value="">Усі</option>
              {courses.map((c) => (
                <option key={c.courseCode} value={c.courseCode}>
                  {c.courseCode} — {c.titleUk}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-label">
            Пошук (ПІБ / номер)
            <input
              className="admin-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Прізвище або ESOSH-UAV-…"
            />
          </label>
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-filter-reset"
            title="Скинути фільтри"
            aria-label="Скинути фільтри"
            disabled={!courseFilter && !query.trim()}
            onClick={() => {
              setCourseFilter("");
              setQuery("");
            }}
          >
            <span aria-hidden="true">↻</span>
          </button>
        </div>

        {filtered.length === 0 ? (
          <p className="admin-muted">Записів немає.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Номер</th>
                  <th>ПІБ</th>
                  <th>Курс</th>
                  <th>Результат</th>
                  <th>Дата курсу</th>
                  <th>Видано</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <code>{item.certificateNumber}</code>
                    </td>
                    <td>{item.participantName}</td>
                    <td>
                      <code>{item.courseCode}</code>
                      <div className="admin-muted">{item.courseTitleUk}</div>
                    </td>
                    <td>
                      {item.scoreTotal > 0
                        ? `${item.score}/${item.scoreTotal} (${item.scorePercent}%)`
                        : "—"}
                    </td>
                    <td>{item.completionDate}</td>
                    <td>{formatIssuedAt(item.issuedAt)}</td>
                    <td className="admin-table-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => {
                          setDeleteError(null);
                          setPendingDelete({
                            mode: "one",
                            id: item.id,
                            label: item.certificateNumber,
                          });
                        }}
                      >
                        Відкликати
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <AdminConfirmDelete
        open={Boolean(pendingDelete)}
        title={
          pendingDelete?.mode === "all"
            ? "Відкликати всі сертифікати?"
            : pendingDelete?.mode === "course"
              ? "Відкликати сертифікати курсу?"
              : "Відкликати сертифікат?"
        }
        description={
          pendingDelete
            ? `Буде видалено: ${pendingDelete.label}. Номери не використовуватимуться повторно (лічильник не скидається). Людина зможе знову пройти курс і отримати новий номер.`
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

function formatIssuedAt(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("uk-UA", { timeZone: "Europe/Kyiv" });
}
