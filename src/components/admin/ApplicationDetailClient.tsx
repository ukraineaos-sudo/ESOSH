"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminConfirmDelete } from "@/components/admin/AdminConfirmDelete";
import { ADMIN_DELETE_CONFIRM } from "@/lib/admin/confirm-delete";
import {
  APPLICATION_STATUSES,
  LEVEL_CODES,
  LEVEL_LABELS_UK,
  STATUS_LABELS_UK,
  type ApplicationStatus,
  type LevelCode,
} from "@/lib/enrollment/levels";

type FileRow = {
  id: number;
  fieldKey: string;
  originalName: string;
  contentType: string | null;
  reviewStatus: string;
  sizeBytes: number | null;
};

type EventRow = {
  id: number;
  eventType: string;
  message: string | null;
  createdAt: string;
  actorType: string;
};

type Props = {
  id: number;
  application: {
    publicId: string;
    status: string;
    autoLevel: string | null;
    approvedLevel: string | null;
    adminComment: string | null;
    testScore: number | null;
    requiresManualReview: boolean;
    autoLevelRules: unknown;
    payload: Record<string, unknown>;
    createdAt: string;
  };
  member: {
    publicId: string;
    firstName: string;
    lastName: string;
    primaryEmail: string;
    secondaryEmail: string | null;
    phone: string | null;
  } | null;
  files: FileRow[];
  events: EventRow[];
};

/** RU: Картка заявки в адмінці. EN: Application detail admin client. */
export function ApplicationDetailClient(props: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(props.application.status);
  const [approvedLevel, setApprovedLevel] = useState(props.application.approvedLevel || "");
  const [adminComment, setAdminComment] = useState(props.application.adminComment || "");
  const [candidateMessage, setCandidateMessage] = useState("");
  const [notifyCandidate, setNotifyCandidate] = useState(false);
  const [files, setFiles] = useState(props.files);
  const [events, setEvents] = useState(props.events);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [fileAction, setFileAction] = useState<FileRow | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    setOk(false);
    try {
      const statusToSave = status;
      const levelToSave =
        statusToSave === "confirmed_no_level" ? null : approvedLevel || null;
      const response = await fetch(`/api/admin/applications/${props.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: statusToSave,
          approvedLevel: levelToSave,
          adminComment,
          notifyCandidate,
          candidateMessage: candidateMessage || undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(
          data.error === "comment_required"
            ? "Коментар обов’язковий при зміні рівня"
            : data.error === "password_change_required"
              ? "Спочатку змініть пароль у розділі «Безпека»"
              : "Помилка збереження",
        );
        return;
      }
      if (statusToSave === "confirmed_no_level") setApprovedLevel("");
      setOk(true);
      setEvents((prev) => [
        {
          id: Date.now(),
          eventType: "updated",
          message: candidateMessage || adminComment || "Оновлення",
          createdAt: new Date().toISOString(),
          actorType: "admin",
        },
        ...prev,
      ]);
    } catch {
      setError("Мережева помилка");
    } finally {
      setSaving(false);
    }
  }

  async function setFileStatus(fileId: number, reviewStatus: string) {
    const response = await fetch(`/api/admin/applications/${props.id}/files/${fileId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewStatus }),
    });
    if (!response.ok) return;
    setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, reviewStatus } : f)));
  }

  async function confirmDelete() {
    setDeleting(true);
    setDeleteError(null);
    try {
      const response = await fetch(`/api/admin/applications/${props.id}`, {
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
      router.push("/admin/applications");
      router.refresh();
    } catch {
      setDeleteError("Мережева помилка");
    } finally {
      setDeleting(false);
    }
  }

  const payload = props.application.payload || {};
  const rules =
    props.application.autoLevelRules &&
    typeof props.application.autoLevelRules === "object"
      ? (props.application.autoLevelRules as {
          criteria?: { id: string; state: string; labelUk: string; detailUk?: string }[];
          matchedRules?: string[];
          nextLevelHintUk?: string | null;
        })
      : {};

  const answerRows: { label: string; value: string }[] = [
    { label: "Прізвище", value: str(payload.lastName) },
    { label: "Ім’я", value: str(payload.firstName) },
    { label: "По батькові", value: str(payload.middleName) },
    { label: "Дата народження", value: str(payload.birthDate) },
    { label: "Країна", value: str(payload.country) },
    { label: "Місто", value: str(payload.city) },
    { label: "Телефон", value: str(payload.phone) },
    { label: "Електронна скринька", value: str(payload.email) },
    { label: "Додаткова скринька", value: str(payload.secondaryEmail) },
    { label: "Профіль", value: str(payload.profileUrl) },
    { label: "Посада", value: str(payload.jobTitle) },
    { label: "Організація", value: str(payload.organization) },
    { label: "Галузь", value: str(payload.industry) },
    { label: "Розмір організації", value: companySizeUk(payload.companySize) },
    { label: "Функції з БЗР", value: boolUk(payload.oshFunctions) },
    { label: "Загальний стаж (роки)", value: str(payload.totalYears) },
    { label: "Стаж БЗР (роки)", value: str(payload.oshYears) },
    { label: "Обов’язки", value: str(payload.responsibilities) },
    { label: "Освіта", value: educationUk(payload.educationLevel) },
    { label: "Профільна освіта", value: boolUk(payload.profileEducation) },
    { label: "Заклад", value: str(payload.institution) },
    { label: "Спеціальність", value: str(payload.speciality) },
    { label: "Рік закінчення", value: str(payload.graduationYear) },
    { label: "БПР", value: cpdUk(payload.cpdStatus) },
    {
      label: "Активності БПР",
      value: Array.isArray(payload.cpdActivities)
        ? payload.cpdActivities.map(String).join(", ")
        : "—",
    },
    { label: "Опис БПР", value: str(payload.cpdDescription) },
    { label: "Маркетингові повідомлення", value: boolUk(payload.marketingConsent) },
  ].filter((row) => row.value && row.value !== "—");

  const courses = Array.isArray(payload.courses) ? payload.courses : [];
  const pendingFiles = files.filter((f) => f.reviewStatus === "pending").length;

  return (
    <div className="admin-stack">
      <p>
        <Link href="/admin/applications">← До реєстру заявок</Link>
      </p>

      <div className="admin-panel admin-guide">
        <h3>Що робити далі</h3>
        <ol className="admin-steps">
          <li>Перегляньте анкету та попередню класифікацію.</li>
          <li>
            Перевірте файли
            {pendingFiles > 0 ? ` (${pendingFiles} очікують перевірки)` : ""} і позначте статус кожного.
          </li>
          <li>Оберіть статус і затверджений рівень у блоці «Рішення».</li>
          <li>За потреби напишіть внутрішній коментар (обов’язково при зміні рівня).</li>
          <li>Натисніть «Зберегти рішення» внизу сторінки. Кандидату лист піде лише якщо увімкнете сповіщення в блоці «Рішення».</li>
        </ol>
      </div>

      <div className="admin-panel">
        <h2>{props.application.publicId}</h2>
        <p className="admin-muted">
          {props.member ? `${props.member.lastName} ${props.member.firstName} · ${props.member.primaryEmail}` : "Без картки члена"}
          {props.member?.phone ? ` · ${props.member.phone}` : ""}
        </p>
        <p>
          Попередній рівень:{" "}
          <strong>
            {props.application.autoLevel
              ? LEVEL_LABELS_UK[props.application.autoLevel as LevelCode]
              : "—"}
          </strong>
          {props.application.requiresManualReview ? " · потребує перевірки" : ""}
          {props.application.testScore != null ? ` · тест ${props.application.testScore}%` : ""}
        </p>
      </div>

      <div className="admin-panel admin-stack">
        <h3>Анкетні відповіді</h3>
        <p className="admin-muted">Дані, які кандидат вказав у формі вступу.</p>
        {answerRows.length === 0 ? (
          <p className="admin-muted">Немає збережених відповідей.</p>
        ) : (
          <dl className="admin-dl">
            {answerRows.map((row) => (
              <div key={row.label} className="admin-dl__row">
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {courses.length > 0 ? (
          <>
            <h4>Курси та кваліфікації</h4>
            <ul className="admin-list">
              {courses.map((raw, index) => {
                const course = raw as Record<string, unknown>;
                return (
                  <li key={index}>
                    <strong>{str(course.courseName) || `Курс ${index + 1}`}</strong>
                    <div className="admin-muted">
                      {courseTypeUk(course.courseType)} · {str(course.provider)} · {str(course.courseYear)}
                      {course.hours != null && course.hours !== "" ? ` · ${str(course.hours)} год` : ""}
                      {course.certificateNo ? ` · № ${str(course.certificateNo)}` : ""}
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        ) : null}
      </div>

      <div className="admin-panel admin-stack">
        <h3>Попередня класифікація</h3>
        <p className="admin-muted">
          Автоматична перевірка критеріїв рівнів ESOSH. Це підказка для адміністратора, не фінальне рішення.
          Позначка «потребує перевірки» означає заявлене «інше/еквівалент» — файли дивіться в блоці «Файли», окремих
          слотів для кожного курсу зі списку немає.
        </p>
        {rules.criteria && rules.criteria.length > 0 ? (
          <ul className="admin-criteria">
            {rules.criteria.map((c) => (
              <li key={c.id} data-state={c.state}>
                <span className="admin-criteria__mark">
                  {c.state === "met" ? "✓" : c.state === "pending_docs" ? "!" : "–"}
                </span>
                <span>
                  {c.labelUk}
                  <span className="admin-muted"> · {criterionStateUk(c.state)}</span>
                  {c.detailUk ? <div className="admin-muted">{c.detailUk}</div> : null}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="admin-muted">Немає збережених критеріїв.</p>
        )}
        {rules.nextLevelHintUk ? <p className="admin-muted">{rules.nextLevelHintUk}</p> : null}
      </div>

      <div className="admin-panel admin-stack">
        <h3>Файли</h3>
        {files.length === 0 ? (
          <div className="admin-empty">
            <p>Кандидат не додав файлів.</p>
            <p className="admin-muted">Якщо потрібні документи — змініть статус на «потрібні уточнення» і напишіть кандидату.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Тип</th>
                <th>Файл</th>
                <th>Статус перевірки</th>
              </tr>
            </thead>
            <tbody>
              {files.map((f) => (
                <tr key={f.id}>
                  <td>{fileFieldUk(f.fieldKey)}</td>
                  <td>
                    <button
                      type="button"
                      className="admin-file-link"
                      onClick={() => setFileAction(f)}
                    >
                      {f.originalName}
                    </button>
                    <div className="admin-muted">{f.sizeBytes ? `${Math.round(f.sizeBytes / 1024)} КБ` : ""}</div>
                  </td>
                  <td>
                    <select
                      className="admin-input"
                      value={f.reviewStatus}
                      onChange={(e) => void setFileStatus(f.id, e.target.value)}
                    >
                      <option value="pending">очікує</option>
                      <option value="verified">перевірений</option>
                      <option value="rejected">неприйнятний</option>
                      <option value="needs_info">уточнення</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="admin-panel admin-stack">
        <h3>Рішення</h3>
        <label className="admin-label">
          Статус
          <select
            className="admin-input"
            value={status}
            onChange={(e) => {
              const next = e.target.value;
              setStatus(next);
              if (next === "confirmed_no_level") setApprovedLevel("");
            }}
          >
            {APPLICATION_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS_UK[s as ApplicationStatus]}</option>
            ))}
          </select>
        </label>
        <label className="admin-label">
          Затверджений рівень
          <select
            className="admin-input"
            value={approvedLevel}
            onChange={(e) => setApprovedLevel(e.target.value)}
            disabled={status === "confirmed_no_level"}
          >
            <option value="">—</option>
            {LEVEL_CODES.map((l) => (
              <option key={l} value={l}>{LEVEL_LABELS_UK[l]}</option>
            ))}
          </select>
        </label>
        {status === "confirmed_no_level" ? (
          <p className="admin-muted admin-note">
            Для статусу «Підтверджено без рівня» затверджений професійний рівень не обирається — учасник лишається без
            підтвердженого рівня.
          </p>
        ) : null}
        <label className="admin-label">
          Внутрішній коментар
          <textarea className="admin-input" rows={3} value={adminComment} onChange={(e) => setAdminComment(e.target.value)} />
        </label>
        <label className="admin-label">
          Текст для кандидата (якщо надсилаєте сповіщення)
          <textarea className="admin-input" rows={3} value={candidateMessage} onChange={(e) => setCandidateMessage(e.target.value)} />
        </label>
        <label className="admin-check">
          <input type="checkbox" checked={notifyCandidate} onChange={(e) => setNotifyCandidate(e.target.checked)} />
          Надіслати сповіщення кандидату
        </label>
        <p className="admin-muted admin-note">
          Лист адміністраторам про нову заявку вже може йти через Brevo окремо. Галочка вище стосується лише
          повідомлення кандидату через налаштований канал сповіщень — якщо канал не налаштовано, збереження рішення
          все одно спрацює, а лист кандидату може не піти.
        </p>
        {error ? <p className="admin-error">{error}</p> : null}
        {ok ? <p className="admin-ok">Рішення збережено</p> : null}
        <button type="button" className="admin-btn" onClick={() => void save()} disabled={saving}>
          {saving ? "Зберігаємо…" : "Зберегти рішення"}
        </button>
      </div>

      <div className="admin-panel">
        <h3>Журнал</h3>
        {events.length === 0 ? (
          <p className="admin-muted">Подій ще немає.</p>
        ) : (
          <ul className="admin-list">
            {events.map((e) => (
              <li key={e.id}>
                <span className="admin-muted">
                  {new Date(e.createdAt).toLocaleString("uk-UA")} · {actorUk(e.actorType)}
                </span>
                <div>{e.message || e.eventType}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="admin-panel admin-danger-zone">
        <h3>Небезпечна зона</h3>
        <p className="admin-muted">
          Видалення прибере заявку, вкладені файли та журнал. Картка члена залишиться — її можна видалити окремо в
          реєстрі членів.
        </p>
        <button
          type="button"
          className="admin-btn admin-btn-danger"
          onClick={() => {
            setDeleteError(null);
            setDeleteOpen(true);
          }}
        >
          Видалити заявку
        </button>
      </div>

      <AdminConfirmDelete
        open={deleteOpen}
        title="Видалити цю заявку?"
        description={`Заявку ${props.application.publicId} буде видалено назавжди разом із файлами та журналом.`}
        busy={deleting}
        error={deleteError}
        onCancel={() => {
          if (!deleting) setDeleteOpen(false);
        }}
        onConfirm={confirmDelete}
      />

      {fileAction ? (
        <div
          className="admin-dialog-backdrop"
          role="presentation"
          onClick={() => setFileAction(null)}
        >
          <div
            className="admin-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-file-action-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="admin-file-action-title">Файл</h2>
            <p className="admin-muted">{fileAction.originalName}</p>
            <div className="admin-dialog-actions admin-dialog-actions--stack">
              {canPreviewInBrowser(fileAction) ? (
                <a
                  className="admin-btn"
                  href={`/api/admin/applications/${props.id}/files/${fileAction.id}?disposition=inline`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setFileAction(null)}
                >
                  Переглянути
                </a>
              ) : (
                <p className="admin-muted">Перегляд у браузері для цього типу файлу недоступний — збережіть файл.</p>
              )}
              <a
                className="admin-btn admin-btn-secondary"
                href={`/api/admin/applications/${props.id}/files/${fileAction.id}?disposition=attachment`}
                download={fileAction.originalName}
                onClick={() => setFileAction(null)}
              >
                Зберегти
              </a>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setFileAction(null)}>
                Скасувати
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function str(value: unknown): string {
  if (value == null || value === "") return "—";
  return String(value);
}

function boolUk(value: unknown): string {
  if (value === true) return "Так";
  if (value === false) return "Ні";
  return "—";
}

function companySizeUk(value: unknown): string {
  if (value === "le20") return "до 20";
  if (value === "21_50") return "21–50";
  if (value === "gt50") return "понад 50";
  return str(value);
}

function educationUk(value: unknown): string {
  const map: Record<string, string> = {
    vocational: "профтех",
    junior_bachelor: "молодший бакалавр",
    bachelor: "бакалавр",
    master: "магістр",
    phd: "PhD",
    doctor: "доктор наук",
    other: "інше",
  };
  return map[String(value)] || str(value);
}

function cpdUk(value: unknown): string {
  const map: Record<string, string> = {
    participating: "беру участь",
    ready: "готовий(-а) долучитися",
    want_info: "хочу інформацію",
    not_ready: "поки не готовий(-а)",
  };
  return map[String(value)] || str(value);
}

function courseTypeUk(value: unknown): string {
  const map: Record<string, string> = {
    esosh_21: "ESOSH 21 год",
    iosh_ms: "IOSH Managing Safely",
    nebosh_award: "NEBOSH Award",
    esosh_130: "ESOSH 130 год",
    nebosh_igc: "NEBOSH IGC",
    esosh_15y: "ESOSH ≥1,5 року",
    nebosh_diploma: "NEBOSH Diploma",
    nvq5: "NVQ5",
    other: "інше / еквівалент",
  };
  return map[String(value)] || str(value);
}

function criterionStateUk(state: string): string {
  if (state === "met") return "підтверджено";
  if (state === "pending_docs") return "потребує перевірки адміном";
  if (state === "missing") return "не підтверджено";
  return state;
}

function fileFieldUk(fieldKey: string): string {
  if (fieldKey === "photo") return "Фото";
  if (fieldKey.startsWith("experience_")) return "Підтвердження стажу";
  if (fieldKey.startsWith("diploma_")) return "Диплом";
  if (fieldKey.startsWith("certificate_")) return "Сертифікат";
  return fieldKey;
}

/** RU: Чи можна відкрити файл inline у новій вкладці. EN: Whether browser can preview inline. */
function canPreviewInBrowser(file: FileRow): boolean {
  const type = (file.contentType || "").toLowerCase();
  if (type.startsWith("image/") || type === "application/pdf") return true;
  const name = file.originalName.toLowerCase();
  return /\.(png|jpe?g|gif|webp|pdf)$/i.test(name);
}

function actorUk(actorType: string): string {
  if (actorType === "admin") return "адміністратор";
  if (actorType === "system") return "система";
  if (actorType === "candidate") return "кандидат";
  return actorType;
}
