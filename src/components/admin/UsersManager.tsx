"use client";

import { FormEvent, useState } from "react";

type UserItem = {
  id: number;
  username: string;
  email: string | null;
  role: string;
  active: boolean;
};

function roleLabelUk(role: string): string {
  if (role === "admin") return "Адміністратор";
  if (role === "editor") return "Редактор";
  return role;
}

/** RU: Управление пользователями админки. EN: Admin users manager. */
export function UsersManager({ initialItems }: { initialItems: UserItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function refresh() {
    const response = await fetch("/api/admin/users");
    const data = await response.json();
    if (!response.ok) {
      setError(
        response.status === 401
          ? "Цей розділ лише для адміністраторів."
          : "Не вдалося завантажити список.",
      );
      return;
    }
    setItems(data.items || []);
  }

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.get("username"),
        email: form.get("email") || null,
        password: form.get("password"),
        role: form.get("role"),
      }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      if (payload.error === "duplicate") setError("Такий логін або ел. пошта вже зайняті.");
      else setError("Не вдалося створити. Потрібні логін і пароль не коротший за 8 символів.");
      return;
    }
    event.currentTarget.reset();
    setMessage("Обліковий запис створено.");
    await refresh();
  }

  async function toggleActive(id: number, active: boolean) {
    setError("");
    setMessage("");
    const response = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active }),
    });
    if (!response.ok) {
      setError("Не вдалося змінити доступ.");
      return;
    }
    setMessage(active ? "Доступ увімкнено." : "Доступ вимкнено.");
    await refresh();
  }

  return (
    <div className="admin-stack">
      {error ? <p className="admin-error">{error}</p> : null}
      {message ? <p className="admin-ok">{message}</p> : null}
      <form className="admin-panel admin-form" onSubmit={onCreate}>
        <h2>Новий співробітник кабінету</h2>
        <p className="admin-muted" style={{ marginTop: 0 }}>
          Редактор може працювати з новинами, медіа та заявками. Адміністратор також керує цим
          списком і безпекою.
        </p>
        <label>
          Логін для входу
          <input
            name="username"
            type="text"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            required
          />
        </label>
        <label>
          Електронна пошта (необовʼязково)
          <input name="email" type="email" autoComplete="off" />
        </label>
        <label>
          Пароль (мін. 8 символів)
          <input name="password" type="password" minLength={8} required autoComplete="new-password" />
        </label>
        <label>
          Роль
          <select name="role" defaultValue="editor">
            <option value="editor">Редактор</option>
            <option value="admin">Адміністратор</option>
          </select>
        </label>
        <button className="admin-btn" type="submit">
          Створити обліковий запис
        </button>
      </form>

      <p className="admin-section-label">Хто має доступ</p>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Логін</th>
            <th>Ел. пошта</th>
            <th>Роль</th>
            <th>Доступ</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.username}</td>
              <td>{item.email || "—"}</td>
              <td>
                <span className="admin-badge">{roleLabelUk(item.role)}</span>
              </td>
              <td>{item.active ? "Увімкнено" : "Вимкнено"}</td>
              <td>
                <button
                  className="admin-btn admin-btn-secondary"
                  type="button"
                  onClick={() => void toggleActive(item.id, !item.active)}
                >
                  {item.active ? "Вимкнути доступ" : "Увімкнути доступ"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 ? (
        <p className="admin-muted">Поки немає інших облікових записів.</p>
      ) : null}
    </div>
  );
}
