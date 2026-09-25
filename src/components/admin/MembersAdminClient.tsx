"use client";

import { useCallback, useMemo, useState } from "react";
import { AdminConfirmDelete } from "@/components/admin/AdminConfirmDelete";
import { ADMIN_DELETE_CONFIRM } from "@/lib/admin/confirm-delete";
import type { MemberRegistryItem, MemberRegistryStats } from "@/lib/admin/member-registry";
import {
  LEVEL_CODES,
  LEVEL_LABELS_UK,
  MEMBER_STATUSES,
  MEMBER_STATUS_LABELS_UK,
  memberStatusLabelUk,
  type LevelCode,
} from "@/lib/enrollment/levels";

export type MemberListItem = MemberRegistryItem;

const emptyStats: MemberRegistryStats = {
  total: 0,
  byStatus: Object.fromEntries(MEMBER_STATUSES.map((s) => [s, 0])),
  byLevel: Object.fromEntries([...LEVEL_CODES, "none"].map((l) => [l, 0])),
};

type Props = {
  initialItems: MemberListItem[];
  initialStats?: MemberRegistryStats;
  initialIndustries?: string[];
};

type FilterState = {
  q: string;
  status: string;
  level: string;
  industry: string;
  oshFunctions: "" | "yes" | "no";
  minOshYears: string;
};

/** RU: Реєстр членів: статистика, фільтри, видалення. EN: Members registry with stats/filters. */
export function MembersAdminClient({
  initialItems,
  initialStats,
  initialIndustries = [],
}: Props) {
  const [items, setItems] = useState(initialItems);
  const [stats, setStats] = useState<MemberRegistryStats>(initialStats || emptyStats);
  const [industries, setIndustries] = useState(initialIndustries);
  const [filters, setFilters] = useState<FilterState>({
    q: "",
    status: "",
    level: "",
    industry: "",
    oshFunctions: "",
    minOshYears: "",
  });
  const [loading, setLoading] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<MemberListItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const countHint = useMemo(() => {
    if (items.length === 0) return "Немає записів за поточними фільтрами";
    if (items.length === 1) return "1 картка у вибірці";
    if (items.length < 5) return `${items.length} картки у вибірці`;
    return `${items.length} карток у вибірці`;
  }, [items.length]);

  const fetchRegistry = useCallback(async (next: FilterState) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (next.q.trim()) params.set("q", next.q.trim());
      if (next.status) params.set("status", next.status);
      if (next.level) params.set("level", next.level);
      if (next.industry) params.set("industry", next.industry);
      if (next.oshFunctions) params.set("oshFunctions", next.oshFunctions);
      if (next.minOshYears.trim()) params.set("minOshYears", next.minOshYears.trim());
      const response = await fetch(`/api/admin/members?${params.toString()}`);
      const data = await response.json();
      if (response.ok && Array.isArray(data.items)) {
        setItems(data.items);
        if (data.stats) setStats(data.stats);
        if (data.facets?.industries) setIndustries(data.facets.industries);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  function patchFilters(patch: Partial<FilterState>) {
    const next = { ...filters, ...patch };
    setFilters(next);
    void fetchRegistry(next);
  }

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
            ? "Потрібне підтвердження словом «так»"
            : response.status === 401
              ? "Видалення доступне лише адміністратору"
              : "Не вдалося видалити картку",
        );
        return;
      }
      setPendingDelete(null);
      await fetchRegistry(filters);
    } catch {
      setDeleteError("Мережева помилка");
    } finally {
      setDeleting(false);
    }
  }

  function exportCsv() {
    const header = [
      "publicId",
      "lastName",
      "firstName",
      "email",
      "phone",
      "status",
      "level",
      "jobTitle",
      "organization",
      "industry",
      "oshYears",
      "oshFunctions",
      "country",
      "city",
    ];
    const lines = [
      header.join(","),
      ...items.map((item) =>
        [
          item.publicId,
          item.lastName,
          item.firstName,
          item.primaryEmail,
          item.phone || "",
          item.status,
          item.level || "",
          item.jobTitle || "",
          item.organization || "",
          item.industry || "",
          item.oshYears ?? "",
          item.oshFunctions == null ? "" : item.oshFunctions ? "yes" : "no",
          item.country || "",
          item.city || "",
        ]
          .map(csvEscape)
          .join(","),
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "esosh-chleny.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="admin-stack">
      <p className="admin-muted">
        Статистика й список оновлюються за фільтрами. Поля — з картки члена та останньої заявки (галузь, посада, стаж
        БЗР тощо).
      </p>

      <div className="admin-stat-row" aria-label="Статистика вибірки">
        <button
          type="button"
          className={`admin-stat admin-stat--members admin-stat--btn${filters.status === "" && filters.level === "" ? " is-active" : ""}`}
          onClick={() => patchFilters({ status: "", level: "" })}
        >
          <strong>{stats.total}</strong>
          <span>у вибірці</span>
        </button>
        {MEMBER_STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            className={`admin-stat admin-stat--btn${filters.status === s ? " is-active" : ""}`}
            onClick={() => patchFilters({ status: filters.status === s ? "" : s })}
          >
            <strong>{stats.byStatus[s] ?? 0}</strong>
            <span>{MEMBER_STATUS_LABELS_UK[s]}</span>
          </button>
        ))}
      </div>

      <div className="admin-stat-row" aria-label="За рівнями">
        {LEVEL_CODES.map((code) => (
          <button
            key={code}
            type="button"
            className={`admin-stat admin-stat--btn${filters.level === code ? " is-active" : ""}`}
            onClick={() => patchFilters({ level: filters.level === code ? "" : code })}
          >
            <strong>{stats.byLevel[code] ?? 0}</strong>
            <span>{shortLevelLabel(code)}</span>
          </button>
        ))}
        <button
          type="button"
          className={`admin-stat admin-stat--btn${filters.level === "none" ? " is-active" : ""}`}
          onClick={() => patchFilters({ level: filters.level === "none" ? "" : "none" })}
        >
          <strong>{stats.byLevel.none ?? 0}</strong>
          <span>Без рівня</span>
        </button>
      </div>

      <div className="admin-toolbar">
        <input
          className="admin-input"
          placeholder="Пошук: ПІБ, скринька, посада, організація, галузь…"
          value={filters.q}
          onChange={(e) => setFilters((prev) => ({ ...prev, q: e.target.value }))}
          onKeyDown={(e) => {
            if (e.key === "Enter") void fetchRegistry(filters);
          }}
          aria-label="Пошук членів"
        />
        <select
          className="admin-input"
          value={filters.status}
          onChange={(e) => patchFilters({ status: e.target.value })}
          aria-label="Статус"
        >
          <option value="">Усі статуси</option>
          {MEMBER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {MEMBER_STATUS_LABELS_UK[s]}
            </option>
          ))}
        </select>
        <select
          className="admin-input"
          value={filters.level}
          onChange={(e) => patchFilters({ level: e.target.value })}
          aria-label="Рівень"
        >
          <option value="">Усі рівні</option>
          {LEVEL_CODES.map((code) => (
            <option key={code} value={code}>
              {LEVEL_LABELS_UK[code]}
            </option>
          ))}
          <option value="none">Без рівня</option>
        </select>
        <select
          className="admin-input"
          value={filters.industry}
          onChange={(e) => patchFilters({ industry: e.target.value })}
          aria-label="Галузь"
        >
          <option value="">Усі галузі</option>
          {industries.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <select
          className="admin-input"
          value={filters.oshFunctions}
          onChange={(e) => patchFilters({ oshFunctions: e.target.value as "" | "yes" | "no" })}
          aria-label="Функції БЗР"
        >
          <option value="">БЗР: усі</option>
          <option value="yes">БЗР: так</option>
          <option value="no">БЗР: ні</option>
        </select>
        <input
          className="admin-input"
          type="number"
          min={0}
          step={0.5}
          placeholder="Мін. стаж БЗР (роки)"
          value={filters.minOshYears}
          onChange={(e) => setFilters((prev) => ({ ...prev, minOshYears: e.target.value }))}
          onKeyDown={(e) => {
            if (e.key === "Enter") void fetchRegistry(filters);
          }}
          aria-label="Мінімальний стаж БЗР"
        />
        <button type="button" className="admin-btn" onClick={() => void fetchRegistry(filters)} disabled={loading}>
          {loading ? "Завантаження…" : "Показати"}
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-secondary"
          onClick={() => {
            const cleared: FilterState = {
              q: "",
              status: "",
              level: "",
              industry: "",
              oshFunctions: "",
              minOshYears: "",
            };
            setFilters(cleared);
            void fetchRegistry(cleared);
          }}
          disabled={loading}
        >
          Скинути
        </button>
        <button type="button" className="admin-btn admin-btn-secondary" onClick={exportCsv} disabled={items.length === 0}>
          Експорт CSV
        </button>
      </div>

      <p className="admin-muted">{countHint}</p>

      {items.length === 0 ? (
        <div className="admin-empty">
          <p>Немає карток за цими умовами.</p>
          <p className="admin-muted">Змініть фільтри або дочекайтеся нових заявок на вступ.</p>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Код</th>
              <th>ПІБ</th>
              <th>Контакти</th>
              <th>Посада / орг.</th>
              <th>Галузь</th>
              <th>БЗР</th>
              <th>Статус</th>
              <th>Рівень</th>
              <th>Заявки</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.publicId}</td>
                <td>
                  {item.lastName} {item.firstName}
                </td>
                <td>
                  <div>{item.primaryEmail}</div>
                  <div className="admin-muted">{item.phone || item.secondaryEmail || "—"}</div>
                </td>
                <td>
                  <div>{item.jobTitle || "—"}</div>
                  <div className="admin-muted">{item.organization || "—"}</div>
                </td>
                <td>{item.industry || "—"}</td>
                <td>
                  {item.oshFunctions == null ? "—" : item.oshFunctions ? "так" : "ні"}
                  {item.oshYears != null ? ` · ${item.oshYears} р.` : ""}
                </td>
                <td>
                  <span className="admin-badge">{memberStatusLabelUk(item.status)}</span>
                </td>
                <td>
                  {item.level ? LEVEL_LABELS_UK[item.level as LevelCode] || item.level : "—"}
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

function shortLevelLabel(code: LevelCode): string {
  if (code === "diplomate") return "Дипломований";
  if (code === "certified") return "Сертифікований";
  if (code === "accredited") return "Акредитований";
  if (code === "specialist") return "Фахівець";
  return "Спільнота";
}

function csvEscape(value: string | number): string {
  const raw = String(value);
  if (/[",\n]/.test(raw)) return `"${raw.replace(/"/g, '""')}"`;
  return raw;
}
