"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

/** RU: Форма входа в админку (логін + пароль). EN: Admin login form (username + password). */
export function AdminLoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const showBootstrapHint = process.env.NODE_ENV !== "production";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: data.get("username"), password: data.get("password") }),
    });
    setPending(false);
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(
        payload.error === "unavailable"
          ? "База даних не налаштована (DATABASE_URL)."
          : "Невірний логін або пароль.",
      );
      return;
    }
    router.replace(search.get("next") || "/admin");
    router.refresh();
  }

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <label>
        Логін
        <input name="username" type="text" autoComplete="username" required autoCapitalize="none" spellCheck={false} />
      </label>
      <label>
        Пароль
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      {showBootstrapHint ? (
        <p className="admin-muted">Перший вхід (dev): логін <code>admin</code>, пароль <code>admin</code> — одразу змініть у «Безпека».</p>
      ) : (
        <p className="admin-muted">Після першого входу змініть пароль у розділі «Безпека».</p>
      )}
      {error ? <p className="admin-error">{error}</p> : null}
      <button className="admin-btn" type="submit" disabled={pending}>
        {pending ? "Вхід…" : "Увійти"}
      </button>
    </form>
  );
}
