"use client";

import { useState } from "react";
import Link from "next/link";
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
  const [status, setStatus] = useState(props.application.status);
  const [approvedLevel, setApprovedLevel] = useState(props.application.approvedLevel || "");
  const [adminComment, setAdminComment] = useState(props.application.adminComment || "");
  const [candidateMessage, setCandidateMessage] = useState("");
  const [notifyCandidate, setNotifyCandidate] = useState(true);
  const [files, setFiles] = useState(props.files);
  const [events, setEvents] = useState(props.events);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function save() {
    setSaving(true);
    setError(null);
    setOk(false);
    try {
      const response = await fetch(`/api/admin/applications/${props.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          approvedLevel: approvedLevel || null,
          adminComment,
          notifyCandidate,
          candidateMessage: candidateMessage || undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error === "comment_required" ? "Коментар обов’язковий при зміні рівня" : "Помилка збереження");
        return;
      }
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

  const payload = props.application.payload || {};

  return (
    <div className="admin-stack">
      <p>
        <Link href="/admin/applications">← До реєстру</Link>
      </p>
      <div className="admin-panel">
        <h2>{props.application.publicId}</h2>
        <p className="admin-muted">
          {props.member ? `${props.member.lastName} ${props.member.firstName} · ${props.member.primaryEmail}` : "Без картки члена"}
          {props.member?.phone ? ` · ${props.member.phone}` : ""}
        </p>
        <p>
          Авто-рівень:{" "}
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
        <h3>Рішення</h3>
        <label className="admin-label">
          Статус
          <select className="admin-input" value={status} onChange={(e) => setStatus(e.target.value)}>
            {APPLICATION_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS_UK[s as ApplicationStatus]}</option>
            ))}
          </select>
        </label>
        <label className="admin-label">
          Затверджений рівень
          <select className="admin-input" value={approvedLevel} onChange={(e) => setApprovedLevel(e.target.value)}>
            <option value="">—</option>
            {LEVEL_CODES.map((l) => (
              <option key={l} value={l}>{LEVEL_LABELS_UK[l]}</option>
            ))}
          </select>
        </label>
        <label className="admin-label">
          Внутрішній коментар
          <textarea className="admin-input" rows={3} value={adminComment} onChange={(e) => setAdminComment(e.target.value)} />
        </label>
        <label className="admin-label">
          Повідомлення кандидату
          <textarea className="admin-input" rows={3} value={candidateMessage} onChange={(e) => setCandidateMessage(e.target.value)} />
        </label>
        <label className="admin-check">
          <input type="checkbox" checked={notifyCandidate} onChange={(e) => setNotifyCandidate(e.target.checked)} />
          Надіслати повідомлення кандидату (webhook)
        </label>
        {error ? <p className="admin-error">{error}</p> : null}
        {ok ? <p className="admin-ok">Збережено</p> : null}
        <button type="button" className="admin-btn" onClick={save} disabled={saving}>
          {saving ? "Зберігаємо…" : "Зберегти"}
        </button>
      </div>

      <div className="admin-panel">
        <h3>Відповіді</h3>
        <pre className="admin-pre">{JSON.stringify(payload, null, 2)}</pre>
        <h4>Правила автокласифікації</h4>
        <pre className="admin-pre">{JSON.stringify(props.application.autoLevelRules, null, 2)}</pre>
      </div>

      <div className="admin-panel admin-stack">
        <h3>Файли</h3>
        {files.length === 0 ? (
          <p className="admin-muted">Немає файлів</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Поле</th>
                <th>Файл</th>
                <th>Статус</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {files.map((f) => (
                <tr key={f.id}>
                  <td>{f.fieldKey}</td>
                  <td>
                    <a href={`/api/admin/applications/${props.id}/files/${f.id}`}>{f.originalName}</a>
                    <div className="admin-muted">{f.sizeBytes ? `${Math.round(f.sizeBytes / 1024)} KB` : ""}</div>
                  </td>
                  <td>
                    <select
                      className="admin-input"
                      value={f.reviewStatus}
                      onChange={(e) => setFileStatus(f.id, e.target.value)}
                    >
                      <option value="pending">очікує</option>
                      <option value="verified">перевірений</option>
                      <option value="rejected">неприйнятний</option>
                      <option value="needs_info">уточнення</option>
                    </select>
                  </td>
                  <td />
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="admin-panel">
        <h3>Журнал</h3>
        <ul className="admin-list">
          {events.map((e) => (
            <li key={e.id}>
              <span className="admin-muted">{new Date(e.createdAt).toLocaleString("uk-UA")} · {e.actorType}</span>
              <div>{e.message || e.eventType}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
