"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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

/** RU: Клієнтський реєстр заявок. EN: Applications registry client. */
export function ApplicationsAdminClient({ initialItems }: { initialItems: ListItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [autoLevel, setAutoLevel] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredHint = useMemo(() => `${items.length} записів`, [items.length]);

  async function reload() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (status) params.set("status", status);
      if (autoLevel) params.set("autoLevel", autoLevel);
      const response = await fetch(`/api/admin/applications?${params.toString()}`);
      const data = await response.json();
      if (response.ok && data.items) setItems(data.items);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-stack">
      <div className="admin-toolbar">
        <input
          className="admin-input"
          placeholder="Пошук: ПІБ, email, org, ID…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="admin-input" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Усі статуси</option>
          {APPLICATION_STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS_UK[s]}</option>
          ))}
        </select>
        <select className="admin-input" value={autoLevel} onChange={(e) => setAutoLevel(e.target.value)}>
          <option value="">Усі рівні</option>
          {LEVEL_CODES.map((l) => (
            <option key={l} value={l}>{LEVEL_LABELS_UK[l]}</option>
          ))}
        </select>
        <button type="button" className="admin-btn" onClick={reload} disabled={loading}>
          {loading ? "…" : "Фільтр"}
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
            a.download = "esosh-applications.csv";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          CSV
        </button>
      </div>
      <p className="admin-muted">{filteredHint}</p>
      {items.length === 0 ? (
        <p className="admin-muted">Поки немає заявок.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ПІБ</th>
              <th>Org</th>
              <th>Статус</th>
              <th>Авто-рівень</th>
              <th>Дата</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <Link href={`/admin/applications/${item.id}`}>{item.publicId}</Link>
                  {item.requiresManualReview ? <span className="admin-badge">review</span> : null}
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
                  <span className="admin-badge">
                    {STATUS_LABELS_UK[item.status as ApplicationStatus] || item.status}
                  </span>
                </td>
                <td>
                  {item.autoLevel
                    ? LEVEL_LABELS_UK[item.autoLevel as LevelCode] || item.autoLevel
                    : "—"}
                </td>
                <td>{item.createdAt ? new Date(item.createdAt).toLocaleString("uk-UA") : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
