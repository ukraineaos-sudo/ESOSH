"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AdminConfirmDelete } from "@/components/admin/AdminConfirmDelete";
import { AdminMediaPicker } from "@/components/admin/AdminMediaPicker";
import { ADMIN_DELETE_CONFIRM } from "@/lib/admin/confirm-delete";

type Person = {
  id: number;
  sortOrder: number;
  photoUrl: string;
  photoClass: string;
  nameUk: string;
  nameEn: string;
  roleUk: string;
  roleEn: string;
  status: string;
};

function emptyDraft(sortOrder: number): Omit<Person, "id"> {
  return {
    sortOrder,
    photoUrl: "",
    photoClass: "",
    nameUk: "",
    nameEn: "",
    roleUk: "",
    roleEn: "",
    status: "published",
  };
}

/** RU: CRUD керівного складу. EN: Leadership team manager. */
export function LeadershipManager({ initialItems }: { initialItems: Person[] }) {
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<Person | null>(null);
  const [creating, setCreating] = useState(false);
  const [createDraft, setCreateDraft] = useState(() => emptyDraft(initialItems.length));
  const [saving, setSaving] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<"edit" | "create">("edit");
  const [pendingDelete, setPendingDelete] = useState<Person | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const sorted = useMemo(
    () => [...items].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id),
    [items],
  );

  useEffect(() => {
    if (!editing && !creating) return;
    editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [editing?.id, creating]);

  async function refresh() {
    const response = await fetch("/api/admin/leadership");
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError("Немає доступу до БД або сесії.");
      return;
    }
    setItems(data.items || []);
  }

  function mapApiError(response: Response, payload: { error?: string }): string {
    if (payload.error === "password_change_required") {
      return "Спочатку змініть початковий пароль у розділі «Безпека» — збереження заблоковано.";
    }
    if (response.status === 401) return "Сесія закінчилась. Увійдіть знову.";
    if (payload.error === "unavailable" || response.status === 503) {
      return "База даних недоступна.";
    }
    return "Не вдалося зберегти. Спробуйте ще раз.";
  }

  async function createPerson(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!createDraft.nameUk.trim() && !createDraft.nameEn.trim()) {
      setError("Вкажіть імʼя українською або англійською.");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch("/api/admin/leadership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createDraft),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(mapApiError(response, data));
        return;
      }
      setCreating(false);
      setCreateDraft(emptyDraft(items.length + 1));
      setMessage("Картку додано.");
      await refresh();
      if (data.item) setEditing(data.item);
    } finally {
      setSaving(false);
    }
  }

  async function saveEditing() {
    if (!editing) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/leadership", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(mapApiError(response, data));
        return;
      }
      setMessage("Збережено.");
      setEditing(data.item || null);
      await refresh();
    } finally {
      setSaving(false);
    }
  }

  async function move(person: Person, direction: -1 | 1) {
    const list = sorted;
    const index = list.findIndex((p) => p.id === person.id);
    const swapWith = list[index + direction];
    if (!swapWith) return;
    setError("");
    await Promise.all([
      fetch("/api/admin/leadership", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...person, sortOrder: swapWith.sortOrder }),
      }),
      fetch("/api/admin/leadership", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...swapWith, sortOrder: person.sortOrder }),
      }),
    ]);
    await refresh();
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const response = await fetch(`/api/admin/leadership/${pendingDelete.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: ADMIN_DELETE_CONFIRM }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setDeleteError(
          data.error === "confirm_required"
            ? "Потрібне підтвердження словом «так»"
            : "Не вдалося видалити",
        );
        return;
      }
      if (editing?.id === pendingDelete.id) setEditing(null);
      setPendingDelete(null);
      setMessage("Картку видалено.");
      await refresh();
    } catch {
      setDeleteError("Мережева помилка");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="admin-stack">
      {error ? <p className="admin-error">{error}</p> : null}
      {message ? <p className="admin-ok">{message}</p> : null}
      <div className="admin-toolbar">
        <button
          className="admin-btn"
          type="button"
          onClick={() => {
            setEditing(null);
            setCreating(true);
            setCreateDraft(emptyDraft(sorted.length ? sorted[sorted.length - 1].sortOrder + 1 : 0));
          }}
        >
          Додати людину
        </button>
        <a className="admin-btn admin-btn-secondary" href="/about-esosh" target="_blank" rel="noreferrer">
          Відкрити на сайті
        </a>
      </div>

      {creating ? (
        <form className="admin-panel admin-form admin-stack" onSubmit={createPerson}>
          <div ref={editorRef} />
          <h2>Нова картка</h2>
          <PersonFields
            value={createDraft}
            onChange={setCreateDraft}
            onPickPhoto={() => {
              setMediaTarget("create");
              setMediaOpen(true);
            }}
          />
          <div className="admin-actions">
            <button className="admin-btn" type="submit" disabled={saving}>
              Створити
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
        <div ref={editorRef} className="admin-panel admin-form admin-stack" id="admin-leadership-editor">
          <h2>Редагування</h2>
          <PersonFields
            value={editing}
            onChange={(next) => setEditing({ ...editing, ...next })}
            onPickPhoto={() => {
              setMediaTarget("edit");
              setMediaOpen(true);
            }}
          />
          <div className="admin-actions admin-actions-wrap">
            <button className="admin-btn" type="button" disabled={saving} onClick={() => void saveEditing()}>
              Зберегти
            </button>
            <button className="admin-btn admin-btn-secondary" type="button" onClick={() => setEditing(null)}>
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
          <p className="admin-muted">Прихований статус прибирає картку зі сторінки «Про ESOSH» після збереження.</p>
        </div>
      ) : null}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Порядок</th>
            <th>Фото</th>
            <th>Імʼя (UK)</th>
            <th>Посада (UK)</th>
            <th>Статус</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {sorted.map((person, index) => (
            <tr key={person.id}>
              <td>
                <div className="admin-actions admin-actions-compact">
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    disabled={index === 0}
                    onClick={() => void move(person, -1)}
                    aria-label="Вище"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    disabled={index === sorted.length - 1}
                    onClick={() => void move(person, 1)}
                    aria-label="Нижче"
                  >
                    ↓
                  </button>
                </div>
              </td>
              <td>
                {person.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={person.photoUrl}
                    alt=""
                    width={48}
                    height={48}
                    style={{ objectFit: "cover", borderRadius: 6 }}
                  />
                ) : (
                  "—"
                )}
              </td>
              <td>{person.nameUk || person.nameEn || "—"}</td>
              <td>{person.roleUk || person.roleEn || "—"}</td>
              <td>
                <span className="admin-badge">
                  {person.status === "published" ? "На сайті" : "Приховано"}
                </span>
              </td>
              <td>
                <div className="admin-actions admin-actions-compact">
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    onClick={() => {
                      setCreating(false);
                      setEditing(person);
                    }}
                  >
                    Редагувати
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-danger"
                    onClick={() => {
                      setDeleteError(null);
                      setPendingDelete(person);
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
          Поки немає карток. Натисніть «Додати людину» або виконайте{" "}
          <code>npm run db:seed-leadership</code>.
        </p>
      ) : null}

      <AdminMediaPicker
        open={mediaOpen}
        onClose={() => setMediaOpen(false)}
        onPick={(url) => {
          if (mediaTarget === "create") setCreateDraft((d) => ({ ...d, photoUrl: url }));
          else if (editing) setEditing({ ...editing, photoUrl: url });
        }}
      />

      <AdminConfirmDelete
        open={Boolean(pendingDelete)}
        title="Видалити картку?"
        description={
          pendingDelete
            ? `«${pendingDelete.nameUk || pendingDelete.nameEn}» зникне з адмінки й зі сторінки Про ESOSH.`
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

function PersonFields({
  value,
  onChange,
  onPickPhoto,
}: {
  value: Omit<Person, "id"> | Person;
  onChange: (next: Omit<Person, "id"> | Person) => void;
  onPickPhoto: () => void;
}) {
  return (
    <>
      <label>
        Імʼя (українською)
        <input
          value={value.nameUk}
          onChange={(e) => onChange({ ...value, nameUk: e.target.value })}
          required={false}
        />
      </label>
      <label>
        Імʼя (English)
        <input value={value.nameEn} onChange={(e) => onChange({ ...value, nameEn: e.target.value })} />
      </label>
      <label>
        Посада (українською)
        <input value={value.roleUk} onChange={(e) => onChange({ ...value, roleUk: e.target.value })} />
      </label>
      <label>
        Посада (English)
        <input value={value.roleEn} onChange={(e) => onChange({ ...value, roleEn: e.target.value })} />
      </label>
      <div>
        <div className="admin-muted" style={{ marginBottom: 8 }}>
          Фото
        </div>
        {value.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value.photoUrl}
            alt=""
            width={120}
            height={140}
            style={{ objectFit: "cover", borderRadius: 8, marginBottom: 8 }}
          />
        ) : null}
        <div className="admin-actions">
          <button type="button" className="admin-btn admin-btn-secondary" onClick={onPickPhoto}>
            Завантажити / обрати
          </button>
          {value.photoUrl ? (
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => onChange({ ...value, photoUrl: "" })}
            >
              Прибрати фото
            </button>
          ) : null}
        </div>
      </div>
      <label>
        Статус
        <select
          value={value.status === "draft" ? "draft" : "published"}
          onChange={(e) =>
            onChange({ ...value, status: e.target.value === "draft" ? "draft" : "published" })
          }
        >
          <option value="published">На сайті</option>
          <option value="draft">Приховано</option>
        </select>
      </label>
    </>
  );
}
