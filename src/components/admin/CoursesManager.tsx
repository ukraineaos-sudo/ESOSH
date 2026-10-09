"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AdminConfirmDelete } from "@/components/admin/AdminConfirmDelete";
import { AdminMediaPicker } from "@/components/admin/AdminMediaPicker";
import { ADMIN_DELETE_CONFIRM } from "@/lib/admin/confirm-delete";

export type EducationCourse = {
  id: number;
  sortOrder: number;
  slug: string;
  imageUrl: string;
  levelUk: string;
  levelEn: string;
  titleUk: string;
  titleEn: string;
  descriptionUk: string;
  descriptionEn: string;
  descriptionExtraUk: string;
  descriptionExtraEn: string;
  ctaUrl: string;
  ctaLabelUk: string;
  ctaLabelEn: string;
  status: string;
};

function emptyDraft(sortOrder: number): Omit<EducationCourse, "id"> {
  return {
    sortOrder,
    slug: "",
    imageUrl: "",
    levelUk: "",
    levelEn: "",
    titleUk: "",
    titleEn: "",
    descriptionUk: "",
    descriptionEn: "",
    descriptionExtraUk: "",
    descriptionExtraEn: "",
    ctaUrl: "",
    ctaLabelUk: "Записатися",
    ctaLabelEn: "Register",
    status: "published",
  };
}

/** RU: CRUD каталогу «Наші курси». EN: Education courses catalog manager. */
export function CoursesManager({ initialItems }: { initialItems: EducationCourse[] }) {
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<EducationCourse | null>(null);
  const [creating, setCreating] = useState(false);
  const [createDraft, setCreateDraft] = useState(() => emptyDraft(initialItems.length));
  const [saving, setSaving] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<"edit" | "create">("edit");
  const [pendingDelete, setPendingDelete] = useState<EducationCourse | null>(null);
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
    const response = await fetch("/api/admin/courses");
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
    if (payload.error === "slug_taken") {
      return "Не вдалося зберегти адресу сторінки. Спробуйте ще раз або змініть назву.";
    }
    if (response.status === 401) return "Сесія закінчилась. Увійдіть знову.";
    if (payload.error === "unavailable" || response.status === 503) {
      return "База даних недоступна.";
    }
    return "Не вдалося зберегти. Спробуйте ще раз.";
  }

  async function createCourse(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!createDraft.titleUk.trim() && !createDraft.titleEn.trim()) {
      setError("Вкажіть назву українською або англійською.");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch("/api/admin/courses", {
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
      setMessage("Курс додано.");
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
      const response = await fetch("/api/admin/courses", {
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

  async function move(course: EducationCourse, direction: -1 | 1) {
    const list = sorted;
    const index = list.findIndex((c) => c.id === course.id);
    const swapWith = list[index + direction];
    if (!swapWith) return;
    setError("");
    await Promise.all([
      fetch("/api/admin/courses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...course, sortOrder: swapWith.sortOrder }),
      }),
      fetch("/api/admin/courses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...swapWith, sortOrder: course.sortOrder }),
      }),
    ]);
    await refresh();
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const response = await fetch(`/api/admin/courses/${pendingDelete.id}`, {
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
      setMessage("Курс видалено.");
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
          Додати курс
        </button>
        <a
          className="admin-btn admin-btn-secondary"
          href="/education/courses"
          target="_blank"
          rel="noreferrer"
        >
          Відкрити на сайті
        </a>
      </div>

      {creating ? (
        <form className="admin-panel admin-form admin-stack" onSubmit={createCourse}>
          <div ref={editorRef} />
          <h2>Новий курс</h2>
          <CourseFields
            value={createDraft}
            onChange={setCreateDraft}
            onPickImage={() => {
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
        <div ref={editorRef} className="admin-panel admin-form admin-stack" id="admin-courses-editor">
          <h2>Редагування</h2>
          <CourseFields
            value={editing}
            onChange={(next) => setEditing({ ...editing, ...next })}
            onPickImage={() => {
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
            {editing.slug ? (
              <a
                className="admin-btn admin-btn-secondary"
                href={`/education/courses/${editing.slug}`}
                target="_blank"
                rel="noreferrer"
              >
                Сторінка курсу
              </a>
            ) : null}
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
          <p className="admin-muted">
            «Опис основний» — на картці в сітці. «Опис додатковий» — на сторінці «Дізнатися більше».
            Зовнішнє посилання показується на сторінці курсу.
          </p>
        </div>
      ) : null}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Порядок</th>
            <th>Фото</th>
            <th>Назва (UK)</th>
            <th>Статус</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {sorted.map((course, index) => (
            <tr key={course.id}>
              <td>
                <div className="admin-actions admin-actions-compact">
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    disabled={index === 0}
                    onClick={() => void move(course, -1)}
                    aria-label="Вище"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    disabled={index === sorted.length - 1}
                    onClick={() => void move(course, 1)}
                    aria-label="Нижче"
                  >
                    ↓
                  </button>
                </div>
              </td>
              <td>
                {course.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={course.imageUrl}
                    alt=""
                    width={72}
                    height={48}
                    style={{ objectFit: "cover", borderRadius: 6 }}
                  />
                ) : (
                  "—"
                )}
              </td>
              <td>{course.titleUk || course.titleEn || "—"}</td>
              <td>
                <span className="admin-badge">
                  {course.status === "published" ? "На сайті" : "Приховано"}
                </span>
              </td>
              <td>
                <div className="admin-actions admin-actions-compact">
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    onClick={() => {
                      setCreating(false);
                      setEditing(course);
                    }}
                  >
                    Редагувати
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-danger"
                    onClick={() => {
                      setDeleteError(null);
                      setPendingDelete(course);
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
          Поки немає курсів. Натисніть «Додати курс» або{" "}
          <code>npm run db:seed-education-courses</code>.
        </p>
      ) : null}

      <AdminMediaPicker
        open={mediaOpen}
        onClose={() => setMediaOpen(false)}
        onPick={(url) => {
          if (mediaTarget === "create") setCreateDraft((d) => ({ ...d, imageUrl: url }));
          else if (editing) setEditing({ ...editing, imageUrl: url });
        }}
      />

      <AdminConfirmDelete
        open={Boolean(pendingDelete)}
        title="Видалити курс?"
        description={
          pendingDelete
            ? `«${pendingDelete.titleUk || pendingDelete.titleEn}» зникне з адмінки й із сітки «Наші курси».`
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

const HINT_LEVEL =
  "Короткий ярлик на картці курсу (наприклад «Базовий» або «Поглиблений»).";
const HINT_DESC_CARD =
  "Короткий текст на картці в сітці «Наші курси». Посилання: [текст](https://…) або [текст](/contact-us). Емодзі (✅ 🏫 тощо) — звичайний копіпаст, коди не потрібні.";
const HINT_DESC_EXTRA =
  "Повний опис на внутрішній сторінці «Дізнатися більше». Посилання: [текст](url). Емодзі вставляйте копіпастом (✅, 🏢, 👥…) — окремі коди писати не треба.";
const HINT_CTA_URL =
  "Основна кнопка на сторінці курсу (зовнішній сервіс: форма, Drive, партнер). Це не адреса «Дізнатися більше».";
const HINT_CTA_LABEL = "Підпис на кнопці зовнішнього посилання (наприклад «Переглянути курс»).";
const HINT_IMAGE = "Обкладинка картки. Можна залишити порожнім.";
const HINT_STATUS = "«На сайті» — видно відвідувачам. «Приховано» — лише в адмінці.";

function FieldHint({ text }: { text: string }) {
  return (
    <span className="admin-field-hint">
      <button type="button" className="admin-field-hint__btn" aria-label="Підказка">
        i
      </button>
      <span className="admin-field-hint__tip" role="tooltip">
        {text}
      </span>
    </span>
  );
}

function FieldTitle({ label, hint }: { label: string; hint?: string }) {
  return (
    <span className="admin-field-label">
      {label}
      {hint ? <FieldHint text={hint} /> : null}
    </span>
  );
}

function CourseFields({
  value,
  onChange,
  onPickImage,
}: {
  value: Omit<EducationCourse, "id"> | EducationCourse;
  onChange: (next: Omit<EducationCourse, "id"> | EducationCourse) => void;
  onPickImage: () => void;
}) {
  return (
    <>
      <label>
        <FieldTitle label="Назва (українською)" />
        <input
          value={value.titleUk}
          onChange={(e) => onChange({ ...value, titleUk: e.target.value })}
        />
      </label>
      <label>
        <FieldTitle label="Назва (English)" />
        <input
          value={value.titleEn}
          onChange={(e) => onChange({ ...value, titleEn: e.target.value })}
        />
      </label>
      {value.slug ? (
        <p className="admin-muted" style={{ margin: 0, fontSize: 13 }}>
          Сторінка «Дізнатися більше»:{" "}
          <a href={`/education/courses/${value.slug}`} target="_blank" rel="noreferrer">
            /education/courses/{value.slug}
          </a>
        </p>
      ) : (
        <p className="admin-muted" style={{ margin: 0, fontSize: 13 }}>
          Адреса сторінки «Дізнатися більше» створиться автоматично після збереження.
        </p>
      )}
      <label>
        <FieldTitle label="Рівень / chip (UK)" hint={HINT_LEVEL} />
        <input
          value={value.levelUk}
          onChange={(e) => onChange({ ...value, levelUk: e.target.value })}
        />
      </label>
      <label>
        <FieldTitle label="Рівень / chip (English)" hint={HINT_LEVEL} />
        <input
          value={value.levelEn}
          onChange={(e) => onChange({ ...value, levelEn: e.target.value })}
        />
      </label>
      <label>
        <FieldTitle label="Опис основний (UK) — на картці" hint={HINT_DESC_CARD} />
        <textarea
          rows={5}
          value={value.descriptionUk}
          onChange={(e) => onChange({ ...value, descriptionUk: e.target.value })}
          placeholder="… [замовте навчання](/contact-us)"
        />
      </label>
      <label>
        <FieldTitle label="Опис основний (English) — на картці" hint={HINT_DESC_CARD} />
        <textarea
          rows={5}
          value={value.descriptionEn}
          onChange={(e) => onChange({ ...value, descriptionEn: e.target.value })}
          placeholder="… [order training](/contact-us)"
        />
      </label>
      <label>
        <FieldTitle label="Опис додатковий (UK) — «Дізнатися більше»" hint={HINT_DESC_EXTRA} />
        <textarea
          rows={10}
          value={value.descriptionExtraUk}
          onChange={(e) => onChange({ ...value, descriptionExtraUk: e.target.value })}
        />
      </label>
      <label>
        <FieldTitle label="Опис додатковий (English) — «Learn more»" hint={HINT_DESC_EXTRA} />
        <textarea
          rows={10}
          value={value.descriptionExtraEn}
          onChange={(e) => onChange({ ...value, descriptionExtraEn: e.target.value })}
        />
      </label>
      <label>
        <FieldTitle label="Зовнішнє посилання (URL кнопки)" hint={HINT_CTA_URL} />
        <input
          type="url"
          placeholder="https://…"
          value={value.ctaUrl}
          onChange={(e) => onChange({ ...value, ctaUrl: e.target.value })}
        />
      </label>
      <label>
        <FieldTitle label="Текст зовнішньої кнопки (UK)" hint={HINT_CTA_LABEL} />
        <input
          value={value.ctaLabelUk}
          onChange={(e) => onChange({ ...value, ctaLabelUk: e.target.value })}
        />
      </label>
      <label>
        <FieldTitle label="Текст зовнішньої кнопки (English)" hint={HINT_CTA_LABEL} />
        <input
          value={value.ctaLabelEn}
          onChange={(e) => onChange({ ...value, ctaLabelEn: e.target.value })}
        />
      </label>
      <div>
        <div className="admin-muted" style={{ marginBottom: 8 }}>
          <FieldTitle label="Зображення (опційно)" hint={HINT_IMAGE} />
        </div>
        {value.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value.imageUrl}
            alt=""
            width={200}
            height={130}
            style={{ objectFit: "cover", borderRadius: 8, marginBottom: 8 }}
          />
        ) : null}
        <div className="admin-actions">
          <button type="button" className="admin-btn admin-btn-secondary" onClick={onPickImage}>
            Завантажити / обрати
          </button>
          {value.imageUrl ? (
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => onChange({ ...value, imageUrl: "" })}
            >
              Прибрати фото
            </button>
          ) : null}
        </div>
      </div>
      <label>
        <FieldTitle label="Статус" hint={HINT_STATUS} />
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
