"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_NEW_PASSWORD_MIN_LENGTH } from "@/lib/admin/password-policy";

/** RU: Форма зміни пароля в кабінеті. EN: Change-password form for the security room. */
export function AdminSecurityForm({ mustChangePassword }: { mustChangePassword: boolean }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setMessage("");
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: data.get("currentPassword"),
        newPassword: data.get("newPassword"),
        confirmPassword: data.get("confirmPassword"),
      }),
    });
    setPending(false);
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      if (payload.error === "invalid_current") setError("Поточний пароль невірний.");
      else if (payload.error === "mismatch") setError("Новий пароль і підтвердження не збігаються.");
      else if (payload.error === "invalid_new") {
        setError(`Новий пароль має бути щонайменше ${ADMIN_NEW_PASSWORD_MIN_LENGTH} символів і відрізнятися від поточного.`);
      } else if (payload.error === "unavailable") setError("База даних не налаштована.");
      else setError("Не вдалося змінити пароль.");
      return;
    }
    event.currentTarget.reset();
    setMessage("Пароль змінено. Інші сесії відкликано.");
    router.refresh();
  }

  return (
    <div className="admin-stack">
      {mustChangePassword ? (
        <p className="admin-warn-banner" role="status">
          Використовується початковий пароль. Змініть його зараз — типовий <code>admin/admin</code> небезпечний.
        </p>
      ) : null}
      <form className="admin-panel admin-form" onSubmit={onSubmit}>
        <h2>Зміна пароля</h2>
        <p className="admin-muted">Мінімум {ADMIN_NEW_PASSWORD_MIN_LENGTH} символів для нового пароля. Після зміни інші відкриті сесії буде завершено.</p>
        <label>
          Поточний пароль
          <input name="currentPassword" type="password" autoComplete="current-password" required />
        </label>
        <label>
          Новий пароль
          <input
            name="newPassword"
            type="password"
            autoComplete="new-password"
            minLength={ADMIN_NEW_PASSWORD_MIN_LENGTH}
            required
          />
        </label>
        <label>
          Підтвердження
          <input
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={ADMIN_NEW_PASSWORD_MIN_LENGTH}
            required
          />
        </label>
        {error ? <p className="admin-error">{error}</p> : null}
        {message ? <p className="admin-ok">{message}</p> : null}
        <button className="admin-btn" type="submit" disabled={pending}>
          {pending ? "Збереження…" : "Зберегти пароль"}
        </button>
      </form>
    </div>
  );
}
