"use client";

import { FormEvent, useState } from "react";

type UserItem = { id: number; email: string; role: string; active: boolean };

/** RU: Управление пользователями админки. EN: Admin users manager. */
export function UsersManager({ initialItems }: { initialItems: UserItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function refresh() {
    const response = await fetch("/api/admin/users");
    const data = await response.json();
    if (!response.ok) {
      setError(response.status === 401 ? "Тільки роль admin." : "Помилка завантаження.");
      return;
    }
    setItems(data.items || []);
  }

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
        role: form.get("role"),
      }),
    });
    if (!response.ok) {
      setError("Не вдалося створити користувача (мін. 8 символів пароля).");
      return;
    }
    event.currentTarget.reset();
    setMessage("Користувача створено.");
    await refresh();
  }

  async function toggleActive(id: number, active: boolean) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active }),
    });
    await refresh();
  }

  return (
    <div className="admin-stack">
      {error ? <p className="admin-error">{error}</p> : null}
      {message ? <p className="admin-ok">{message}</p> : null}
      <form className="admin-panel admin-form" onSubmit={onCreate}>
        <h2>Новий користувач</h2>
        <label>
          Email
          <input name="email" type="email" required />
        </label>
        <label>
          Password
          <input name="password" type="password" minLength={8} required />
        </label>
        <label>
          Role
          <select name="role" defaultValue="editor">
            <option value="editor">editor</option>
            <option value="admin">admin</option>
          </select>
        </label>
        <button className="admin-btn" type="submit">
          Створити
        </button>
      </form>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Active</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.email}</td>
              <td>
                <span className="admin-badge">{item.role}</span>
              </td>
              <td>{item.active ? "yes" : "no"}</td>
              <td>
                <button
                  className="admin-btn admin-btn-secondary"
                  type="button"
                  onClick={() => void toggleActive(item.id, !item.active)}
                >
                  {item.active ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
